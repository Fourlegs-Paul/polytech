import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { question, cards } = await request.json();
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "OPENAI_API_KEY가 Vercel에 설정되지 않았습니다." }, { status: 503 });
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const list = cards.map((card: { name: string; orientation: string; keyword: string }, index: number) => `${["과거", "현재", "조언"][index]}: ${card.name} (${card.orientation === "upright" ? "정방향" : "역방향"}, ${card.keyword})`).join("\n");
  const response = await client.chat.completions.create({ model: "gpt-4o-mini", temperature: 0.8, messages: [{ role: "system", content: "당신은 따뜻하고 현실적인 한국어 타로 리더입니다. 단정적 예언이나 의료·법률·금융 조언을 하지 말고, 사용자가 스스로 선택하도록 돕는 3단락의 짧은 해석을 작성하세요." }, { role: "user", content: `질문: ${question}\n\n뽑은 카드:\n${list}` }] });
  return NextResponse.json({ interpretation: response.choices[0]?.message.content ?? "해석을 만들지 못했습니다." });
}
