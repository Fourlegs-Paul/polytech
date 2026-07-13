import { describe, expect, it } from "vitest";
import { calculateMbti, type Answer } from "../lib/mbti";

describe("MBTI 결과 계산", () => {
  it("각 축에서 A 선택이 많으면 INFP를 반환한다", () => {
    const answers: Answer[] = [
      { axis: "EI", choice: "A" }, { axis: "EI", choice: "A" }, { axis: "EI", choice: "B" },
      { axis: "SN", choice: "B" }, { axis: "SN", choice: "B" }, { axis: "SN", choice: "A" },
      { axis: "TF", choice: "B" }, { axis: "TF", choice: "B" }, { axis: "TF", choice: "A" },
      { axis: "JP", choice: "B" }, { axis: "JP", choice: "B" }, { axis: "JP", choice: "A" },
    ];

    expect(calculateMbti(answers).type).toBe("INFP");
  });

  it("동점인 축은 B 선택지를 우선해 일관된 결과를 반환한다", () => {
    const answers: Answer[] = [
      { axis: "EI", choice: "A" }, { axis: "EI", choice: "B" },
      { axis: "SN", choice: "A" },
      { axis: "TF", choice: "A" },
      { axis: "JP", choice: "A" },
    ];

    expect(calculateMbti(answers).type).toBe("ESTJ");
  });
});
