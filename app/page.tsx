"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { calculateMbti, type Answer, type Choice } from "@/lib/mbti";
import { questions, resultCopy } from "@/lib/questions";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const ADMIN_EMAIL = "schaffencom@gmail.com";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [answers, setAnswers] = useState<Record<number, Choice>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getUser().then(({ data }) => setUser(data.user));
      const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
      return () => subscription.subscription.unsubscribe();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "로그인 설정을 확인해 주세요.");
    }
  }, []);

  const result = useMemo(() => {
    const completeAnswers: Answer[] = questions
      .filter((question) => answers[question.id])
      .map((question) => ({ axis: question.axis, choice: answers[question.id] }));
    return completeAnswers.length === questions.length ? calculateMbti(completeAnswers) : null;
  }, [answers]);

  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);

  async function signIn() {
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (authError) setError(authError.message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Google 로그인을 시작하지 못했습니다.");
    }
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
  }

  async function submitSurvey() {
    if (!user || !result) return;
    setSaving(true);
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: saveError } = await supabase.from("survey_responses").insert({
        user_id: user.id,
        answers,
        mbti_result: result.type,
      });
      if (saveError) throw saveError;
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "응답 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  function restart() {
    setAnswers({});
    setSubmitted(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted && result) {
    const copy = resultCopy[result.type];
    return (
      <main className="page-shell">
        <header className="topbar"><a className="brand" href="/">니 성격 뭔데?</a><Account user={user} onSignOut={signOut} /></header>
        <section className="result-card" aria-live="polite">
          <p className="eyebrow">나의 성격 경향 결과</p>
          <h1>{result.type}</h1>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
          <div className="axis-grid">
            {Object.entries(result.score).map(([axis, score]) => <div key={axis}><strong>{axis}</strong><span>A {score.A} · B {score.B}</span></div>)}
          </div>
          <button className="primary" onClick={restart}>다시 해 보기</button>
          <p className="notice">이 결과는 흥미를 위한 성격 경향 설문이며, 의학적·심리학적 진단이 아닙니다.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">니 성격 뭔데?</a>
        <Account user={user} onSignOut={signOut} />
      </header>
      <section className="hero">
        <p className="eyebrow">성격 경향 미니 테스트</p>
        <h1>나는 어떤 방식으로<br />세상을 마주할까?</h1>
        <p>12개의 선택으로 나의 성격 경향을 가볍게 알아보세요.</p>
        {!user && <button className="primary" onClick={signIn}>Google로 로그인하고 시작</button>}
        {user && <a className="primary link-button" href="#survey">설문 시작하기</a>}
        <p className="notice">로그인 후 응답 결과가 내 계정에 저장됩니다. 언제든 다시 응시할 수 있어요.</p>
      </section>
      {error && <p className="error" role="alert">{error}</p>}
      <section id="survey" className="survey" aria-label="성격 경향 설문">
        <div className="progress-label"><span>진행률</span><strong>{progress}%</strong></div>
        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
        {questions.map((question, index) => (
          <fieldset className="question" key={question.id}>
            <legend><span>{index + 1}</span>{question.prompt}</legend>
            <div className="choices">
              {question.choices.map((choice) => (
                <label className={answers[question.id] === choice.value ? "choice selected" : "choice"} key={choice.value}>
                  <input type="radio" name={`question-${question.id}`} value={choice.value} checked={answers[question.id] === choice.value} onChange={() => setAnswers((current) => ({ ...current, [question.id]: choice.value }))} />
                  {choice.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {!user ? <button className="primary" onClick={signIn}>로그인 후 결과 저장하기</button> : <button className="primary" disabled={!result || saving} onClick={submitSurvey}>{saving ? "결과 저장 중…" : result ? "결과 확인하기" : `질문 ${questions.length - Object.keys(answers).length}개 더 답하기`}</button>}
      </section>
    </main>
  );
}

function Account({ user, onSignOut }: { user: User | null; onSignOut: () => void }) {
  if (!user) return <span className="account muted">로그인 전</span>;
  const email = user.email ?? "로그인 사용자";
  return <div className="account"><span>{email}</span>{email === ADMIN_EMAIL && <a href="/admin">관리자</a>}<button onClick={onSignOut}>로그아웃</button></div>;
}
