"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const ADMIN_EMAIL = "schaffencom@gmail.com";
type TarotRecord = { answers: { question?: string; cards?: { name: string }[] }; created_at: string; user_id: string };

export default function Admin(){
  const [records,setRecords]=useState<TarotRecord[]>([]),[error,setError]=useState("");
  useEffect(()=>{const s=getSupabaseBrowserClient();s.auth.getUser().then(async({data})=>{if(data.user?.email!==ADMIN_EMAIL){setError("관리자 계정으로 로그인해 주세요.");return}const x=await s.from("survey_responses").select("answers,created_at,user_id").eq("answers->>kind","tarot").order("created_at",{ascending:false});if(x.error)setError(x.error.message);else setRecords((x.data||[]) as TarotRecord[])})},[]);
  return <main><header><b>달빛 타로 · 관리자</b><a href="/">리딩으로</a></header><section className="reading"><p>RECENT READINGS</p><h2>기존 DB에 저장된 최근 {records.length}개의 타로 리딩</h2>{error&&<aside>{error}</aside>}{records.map((record,index)=><div key={`${record.created_at}-${index}`}><b>{record.answers.question}</b><br/><small>{record.answers.cards?.map(card=>card.name).join(" · ")} — {new Date(record.created_at).toLocaleString("ko-KR")}</small></div>)}</section></main>
}
