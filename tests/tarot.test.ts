import { describe, expect, it } from "vitest";
import { drawThreeCards } from "../lib/tarot";

describe("3장 타로 뽑기", () => {
  it("중복 없이 정확히 세 장을 뽑는다", () => {
    const cards = drawThreeCards(() => 0.25);
    expect(cards).toHaveLength(3);
    expect(new Set(cards.map((card) => card.id)).size).toBe(3);
  });

  it("각 카드에 정방향 또는 역방향 상태를 부여한다", () => {
    const cards = drawThreeCards(() => 0.9);
    expect(cards.every((card) => ["upright", "reversed"].includes(card.orientation))).toBe(true);
  });
});
