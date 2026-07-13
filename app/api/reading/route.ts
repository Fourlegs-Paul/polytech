import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { question, cards } = await request.json();
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "GEMINI_API_KEY가 Vercel에 설정되지 않았습니다." }, { status: 503 });
  const cardList = cards.map((card: { name: string; orientation: string; keyword: string }, index: number) => `${["과거", "현재", "조언"][index]}: ${card.name} (${card.orientation === "upright" ? "정방향" : "역방향"}, ${card.keyword})`).join("\n");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `질문: ${question}\n\n뽑은 카드:\n${cardList}`,
      config: { systemInstruction: "당신은 따뜻하고 현실적인 한국어 타로 리더입니다. 단정적 예언이나 의료·법률·금융 조언을 하지 말고, 사용자가 스스로 선택하도록 돕는 3단락의 짧은 해석을 작성하세요." },
    });
    return NextResponse.json({ interpretation: response.text || "해석을 만들지 못했습니다." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini 리딩 요청에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
