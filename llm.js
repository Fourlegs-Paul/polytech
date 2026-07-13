// 공유 LLM 호출 모듈 — Hermes 페르소나, Ollama/OpenAI/폴백
// server.js 와 bot.js 가 공통으로 사용.
const https = require('https');
const http = require('http');

const HERMES_PERSONA = `너는 "Hermes Agent"라는 이름의 지능형 AI 비서다.
- 한국어로 친절하고, 정확하고, 간결하게 답한다.
- 코드, 파일, 터미널, 웹 탐색 등 다양한 작업을 돕는다.
- 모르는 실시간 사실은 솔직히 "실시간 정보는 연동되지 않았다"고 말한다.
- 말투는 부드럽지만 능숙한 비서 톤이다.`;

const LLM_PROVIDER = process.env.LLM_PROVIDER || '';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_BASE = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

function httpsPostJson(urlStr, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const data = JSON.stringify(body);
    const req = https.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...(headers || {}) },
    }, (res) => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } }); });
    req.on('error', reject); req.write(data); req.end();
  });
}
function httpPostJson(urlStr, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const data = JSON.stringify(body);
    const req = http.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...(headers || {}) },
    }, (res) => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } }); });
    req.on('error', reject); req.write(data); req.end();
  });
}

// 대화 기록을 받아 답변 생성. history: [{role:'user'|'assistant', content}]
async function llmAnswer(userText, history = []) {
  const messages = [
    { role: 'system', content: HERMES_PERSONA },
    ...history.slice(-12).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userText },
  ];

  if (LLM_PROVIDER === 'ollama' || (!LLM_PROVIDER && !OPENAI_KEY)) {
    try {
      const r = await httpPostJson(`${OLLAMA_URL}/api/chat`, {
        model: OLLAMA_MODEL, messages, stream: false,
      });
      if (r && r.message && r.message.content) return r.message.content.trim();
    } catch (e) {
      if (LLM_PROVIDER === 'ollama') console.log('⚠ Ollama 실패:', e.message);
    }
  }
  if ((LLM_PROVIDER === 'openai' || (!LLM_PROVIDER && OPENAI_KEY)) && OPENAI_KEY) {
    try {
      const r = await httpsPostJson(`${OPENAI_BASE}/chat/completions`, { model: OPENAI_MODEL, messages },
        { Authorization: `Bearer ${OPENAI_KEY}` });
      if (r && r.choices && r.choices[0]) return r.choices[0].message.content.trim();
    } catch (e) { console.log('⚠ OpenAI 실패:', e.message); }
  }
  // 폴백
  return `(LLM 연동 안 됨 · 폴백) "${userText}" — Ollama(localhost:11434)를 설치하고 'ollama pull ${OLLAMA_MODEL}' 하거나 .env에 OPENAI_API_KEY 를 넣으면 진짜 Hermes 답변이 생성됩니다.`;
}

module.exports = { llmAnswer, HERMES_PERSONA };
