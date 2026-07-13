import type { Axis, Choice } from "./mbti";

export type Question = {
  id: number;
  axis: Axis;
  prompt: string;
  choices: { label: string; value: Choice }[];
};

export const questions: Question[] = [
  { id: 1, axis: "EI", prompt: "처음 보는 사람이 많은 자리에서 나는", choices: [{ label: "분위기를 먼저 살핀다", value: "A" }, { label: "먼저 말을 걸어본다", value: "B" }] },
  { id: 2, axis: "EI", prompt: "에너지를 회복하는 가장 좋은 시간은", choices: [{ label: "혼자 조용히 있을 때", value: "A" }, { label: "좋아하는 사람들과 있을 때", value: "B" }] },
  { id: 3, axis: "EI", prompt: "머릿속 생각을 정리할 때 나는", choices: [{ label: "혼자 생각한 뒤 말한다", value: "A" }, { label: "말하면서 생각을 정리한다", value: "B" }] },
  { id: 4, axis: "SN", prompt: "새로운 일을 배울 때 더 편한 방식은", choices: [{ label: "구체적인 예시와 순서", value: "A" }, { label: "큰 그림과 가능성", value: "B" }] },
  { id: 5, axis: "SN", prompt: "여행을 떠난다면 나는", choices: [{ label: "검증된 장소를 자세히 찾아본다", value: "A" }, { label: "현지에서 우연히 발견하는 것을 즐긴다", value: "B" }] },
  { id: 6, axis: "SN", prompt: "대화에서 더 끌리는 주제는", choices: [{ label: "실제로 있었던 경험", value: "A" }, { label: "앞으로 일어날 수 있는 일", value: "B" }] },
  { id: 7, axis: "TF", prompt: "친구가 고민을 털어놓으면 먼저", choices: [{ label: "해결 방법을 함께 찾는다", value: "A" }, { label: "충분히 공감해 준다", value: "B" }] },
  { id: 8, axis: "TF", prompt: "중요한 결정을 내릴 때 기준은", choices: [{ label: "공정하고 논리적인가", value: "A" }, { label: "사람들에게 어떤 영향이 있을까", value: "B" }] },
  { id: 9, axis: "TF", prompt: "피드백을 줄 때 나는", choices: [{ label: "핵심을 분명하게 말한다", value: "A" }, { label: "상대 기분을 고려해 말한다", value: "B" }] },
  { id: 10, axis: "JP", prompt: "마감이 있는 일을 할 때 나는", choices: [{ label: "미리 계획해서 끝낸다", value: "A" }, { label: "마감 직전 집중력이 올라간다", value: "B" }] },
  { id: 11, axis: "JP", prompt: "주말 계획은", choices: [{ label: "대략이라도 정해두는 편", value: "A" }, { label: "그날 기분에 따라 움직이는 편", value: "B" }] },
  { id: 12, axis: "JP", prompt: "예상치 못한 일정 변경이 생기면", choices: [{ label: "조금 당황하지만 다시 정리한다", value: "A" }, { label: "새로운 흐름도 괜찮다고 느낀다", value: "B" }] },
];

export const resultCopy: Record<string, { title: string; description: string }> = {
  ISTJ: { title: "차분한 현실주의자", description: "약속과 기준을 소중히 여기고, 맡은 일을 믿음직하게 끝내는 편이에요." },
  ISFJ: { title: "다정한 수호자", description: "주변을 세심하게 살피고, 조용하지만 꾸준한 배려를 실천해요." },
  INFJ: { title: "통찰력 있는 조력자", description: "사람과 상황의 의미를 깊게 읽고, 더 나은 방향을 고민해요." },
  INTJ: { title: "전략적인 설계자", description: "복잡한 문제를 구조화하고, 긴 호흡의 목표를 세우는 데 강해요." },
  ISTP: { title: "침착한 해결사", description: "직접 해 보며 원리를 파악하고, 필요한 순간에 실용적인 해법을 찾아요." },
  ISFP: { title: "감각적인 탐험가", description: "자신의 감각과 가치를 따르며, 자연스럽고 편안한 분위기를 만들어요." },
  INFP: { title: "진심 어린 이상주의자", description: "자신만의 가치와 상상력을 바탕으로 사람과 세상을 따뜻하게 바라봐요." },
  INTP: { title: "호기심 많은 분석가", description: "왜 그런지 끝까지 파고들며, 새로운 관점과 논리를 찾는 것을 즐겨요." },
  ESTP: { title: "에너지 넘치는 실천가", description: "현장의 흐름을 빠르게 읽고, 직접 부딪치며 기회를 만들어 가요." },
  ESFP: { title: "분위기 메이커", description: "사람들과 즐거움을 나누고, 지금 이 순간을 생생하게 경험해요." },
  ENFP: { title: "열정적인 아이디어 뱅크", description: "새로운 가능성에 설레고, 사람들에게 긍정적인 에너지를 전해요." },
  ENTP: { title: "재치 있는 발명가", description: "익숙한 생각에 질문을 던지고, 더 재미있는 방법을 발견하는 것을 좋아해요." },
  ESTJ: { title: "명확한 추진자", description: "목표와 기준을 분명히 세우고, 모두가 움직일 수 있도록 이끌어요." },
  ESFJ: { title: "친화적인 지원가", description: "사람들이 편하게 어울리도록 살피고, 함께하는 경험을 소중히 여겨요." },
  ENFJ: { title: "따뜻한 리더", description: "사람의 잠재력을 알아보고, 함께 성장할 수 있게 북돋아 줘요." },
  ENTJ: { title: "대담한 지휘관", description: "큰 목표를 세우고, 자원과 사람을 연결해 결과로 만들어 가요." },
};
