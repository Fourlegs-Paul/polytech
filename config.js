// config.js — 환경변수 기반 설정 예시
// 실제 토큰은 코드에 박지 말고 환경변수로 주입하세요.
module.exports = {
  PORT: process.env.PORT || 3001,
  // 텔레그램 봇 토큰 (bot.js 용). @BotFather 로 발급.
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  // 실제 월드컵 API (선택). football-data.org 무료 키.
  FOOTBALL_TOKEN: process.env.FOOTBALL_TOKEN || '',
};
