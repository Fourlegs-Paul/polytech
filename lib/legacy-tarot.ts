export type LegacyTarotRow = {
  answers: {
    kind: "tarot";
    question: string;
    cards: unknown[];
    interpretation: string;
  };
  // 기존 survey_responses의 MBTI CHECK 제약을 바꾸지 않기 위한 호환값입니다.
  mbti_result: "INFP";
};

export function toLegacyTarotResponse(question: string, cards: unknown[], interpretation: string): LegacyTarotRow {
  return { answers: { kind: "tarot", question, cards, interpretation }, mbti_result: "INFP" };
}
