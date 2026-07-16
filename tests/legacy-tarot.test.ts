import { describe, expect, it } from "vitest";
import { toLegacyTarotResponse } from "../lib/legacy-tarot";

describe("기존 설문 스키마용 타로 저장 데이터", () => {
  it("타로 질문·카드·풀이를 answers JSON에 보관하고 유효한 MBTI 호환값을 넣는다", () => {
    const row = toLegacyTarotResponse("오늘의 선택은?", [{ name: "태양" }], "밝은 가능성을 봅니다.");
    expect(row.mbti_result).toBe("INFP");
    expect(row.answers).toMatchObject({ kind: "tarot", question: "오늘의 선택은?", interpretation: "밝은 가능성을 봅니다." });
    expect(row.answers.cards).toEqual([{ name: "태양" }]);
  });
});
