export type Axis = "EI" | "SN" | "TF" | "JP";
export type Choice = "A" | "B";

export type Answer = {
  axis: Axis;
  choice: Choice;
};

export type MbtiScore = Record<Axis, { A: number; B: number }>;

const letters: Record<Axis, { A: string; B: string }> = {
  EI: { A: "I", B: "E" },
  SN: { A: "S", B: "N" },
  TF: { A: "T", B: "F" },
  JP: { A: "J", B: "P" },
};

export function calculateMbti(answers: Answer[]) {
  const score: MbtiScore = {
    EI: { A: 0, B: 0 },
    SN: { A: 0, B: 0 },
    TF: { A: 0, B: 0 },
    JP: { A: 0, B: 0 },
  };

  for (const answer of answers) score[answer.axis][answer.choice] += 1;

  const type = (Object.keys(letters) as Axis[])
    .map((axis) => (score[axis].A > score[axis].B ? letters[axis].A : letters[axis].B))
    .join("");

  return { type, score };
}
