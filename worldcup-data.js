// World Cup 2026 snapshot.
// NOTE: This is a DEMO snapshot assembled from the known tournament
// structure (48 teams / 12 groups, opened 2026-06-11, final 2026-07-19
// in New Jersey). It is NOT a live fetch — the sandbox has no network.
//
// To make it LIVE, replace `fetchLive()` with a real call to
// football-data.org or fotmob and map the result into `summary`.

const STAMP = '2026-07-13 (데모 스냅샷)';

const summary = `🏆 2026 FIFA 월드컵 (미국·캐나다·멕시코 공동개최)
개막: 2026-06-11 · 결승: 2026-07-19 (뉴저지 메트라이프 스타디움)
포맷: 48개국 → 12조 → 32강 토너먼트

📊 현재 단계 (7/13 기준): 16강 토너먼트 진행 중
조별리그 12조 완료 · 32강(RO32) 완료 · 16강(RO16) 진행 중

⚡ 16강 주요 대진 (예시 데모)
• A1 캐나다 vs B2 독일
• C1 멕시코 vs D2 아르헨티나
• E1 미국   vs F2 프랑스
• G1 브라질 vs H2 스페인
• 나머지 4경기 진행 중

🔥 득점왕 레이스 (데모)
1. 킬리안 음바페(프랑스) 6골
2. 리오넬 메시(아르헨티나) 5골
3. 비니시우스 주니오르(브라질) 4골

⏭ 다음 일정: 8강전 2026-07-15~16
🏟 결승: 2026-07-19 20:00(ET) 뉴저지

※ 위 값은 교육용 데모 구성값입니다. 실제 순위는 bot.js의
  fetchLive()를 football-data.org 등과 연동해 갱신하세요.`;

// Placeholder for real API integration.
async function fetchLive() {
  // const r = await fetch('https://api.football-data.org/v4/competitions/WC/standings', {
  //   headers: { 'X-Auth-Token': process.env.FOOTBALL_TOKEN }
  // });
  // return mapToSummary(await r.json());
  return { summary, stamp: STAMP };
}

module.exports = { summary, stamp: STAMP, fetchLive };
