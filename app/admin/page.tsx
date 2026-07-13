"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const ADMIN_EMAIL = "schaffencom@gmail.com";
type ResponseRow = { id: string; mbti_result: string; created_at: string; user_id: string };

export default function AdminPage() {
  const [rows, setRows] = useState<ResponseRow[]>([]);
  const [status, setStatus] = useState("권한을 확인하고 있습니다…");

  useEffect(() => {
    async function load() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email !== ADMIN_EMAIL) { setStatus("관리자 권한이 없습니다."); return; }
        const { data, error } = await supabase.from("survey_responses").select("id, user_id, mbti_result, created_at").order("created_at", { ascending: false });
        if (error) throw error;
        setRows(data ?? []);
        setStatus("");
      } catch (cause) { setStatus(cause instanceof Error ? cause.message : "통계를 불러오지 못했습니다."); }
    }
    load();
  }, []);

  const counts = useMemo(() => rows.reduce<Record<string, number>>((all, row) => ({ ...all, [row.mbti_result]: (all[row.mbti_result] ?? 0) + 1 }), {}), [rows]);
  const orderedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  function downloadCsv() {
    const header = "응답ID,사용자ID,결과,제출시각\n";
    const body = rows.map((row) => [row.id, row.user_id, row.mbti_result, row.created_at].map((value) => `\"${value}\"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + header + body], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "ni-seonggyeok-mwonde-responses.csv"; link.click(); URL.revokeObjectURL(url);
  }

  return <main className="page-shell"><header className="topbar"><a className="brand" href="/">니 성격 뭔데?</a><a className="account" href="/">설문으로 돌아가기</a></header><section className="admin"><p className="eyebrow">관리자 대시보드</p><h1>설문 응답 통계</h1>{status && <p className="error">{status}</p>}{!status && <><div className="stat-total"><strong>{rows.length}</strong><span>총 응답 수</span><button className="secondary" onClick={downloadCsv}>CSV 내려받기</button></div><div className="stats-grid">{orderedCounts.map(([type, count]) => <div className="stat" key={type}><strong>{type}</strong><span>{count}명</span></div>)}</div><div className="response-list"><h2>최근 응답</h2>{rows.slice(0, 20).map((row) => <div key={row.id}><strong>{row.mbti_result}</strong><span>{new Date(row.created_at).toLocaleString("ko-KR")}</span></div>)}</div></>}</section></main>;
}
