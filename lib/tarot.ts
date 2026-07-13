export type TarotCard = {
  id: number;
  name: string;
  keyword: string;
  image: string;
};

export type DrawnCard = TarotCard & { orientation: "upright" | "reversed" };

const image = (name: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}.jpg`;

export const majorArcana: TarotCard[] = [
  [0, "바보", "새로운 시작 · 가능성", "RWS_Tarot_00_Fool"], [1, "마법사", "의지 · 실행", "RWS_Tarot_01_Magician"], [2, "여사제", "직관 · 내면의 목소리", "RWS_Tarot_02_High_Priestess"], [3, "여황제", "풍요 · 돌봄", "RWS_Tarot_03_Empress"], [4, "황제", "구조 · 책임", "RWS_Tarot_04_Emperor"], [5, "교황", "배움 · 전통", "RWS_Tarot_05_Hierophant"], [6, "연인", "관계 · 선택", "RWS_Tarot_06_Lovers"], [7, "전차", "추진 · 방향", "RWS_Tarot_07_Chariot"], [8, "힘", "용기 · 부드러운 통제", "RWS_Tarot_08_Strength"], [9, "은둔자", "성찰 · 탐색", "RWS_Tarot_09_Hermit"], [10, "운명의 수레바퀴", "변화 · 전환", "RWS_Tarot_10_Wheel_of_Fortune"], [11, "정의", "균형 · 정직", "RWS_Tarot_11_Justice"], [12, "매달린 사람", "관점 전환 · 기다림", "RWS_Tarot_12_Hanged_Man"], [13, "죽음", "끝맺음 · 변신", "RWS_Tarot_13_Death"], [14, "절제", "조화 · 회복", "RWS_Tarot_14_Temperance"], [15, "악마", "집착 · 해방", "RWS_Tarot_15_Devil"], [16, "탑", "깨달음 · 재구성", "RWS_Tarot_16_Tower"], [17, "별", "희망 · 치유", "RWS_Tarot_17_Star"], [18, "달", "불안 · 무의식", "RWS_Tarot_18_Moon"], [19, "태양", "기쁨 · 명료함", "RWS_Tarot_19_Sun"], [20, "심판", "각성 · 결단", "RWS_Tarot_20_Judgement"], [21, "세계", "완성 · 통합", "RWS_Tarot_21_World"],
].map(([id, name, keyword, file]) => ({ id: Number(id), name: String(name), keyword: String(keyword), image: image(String(file)) }));

export function drawThreeCards(random: () => number = Math.random): DrawnCard[] {
  const deck = [...majorArcana];
  return Array.from({ length: 3 }, () => {
    const index = Math.floor(random() * deck.length);
    const card = deck.splice(index, 1)[0];
    return { ...card, orientation: random() >= 0.5 ? "reversed" : "upright" };
  });
}
