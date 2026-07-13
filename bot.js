// 텔레그램 봇 → 웹 콘솔 릴레이 + Hermes(LLM) 답변
// 텔레그램에서 보낸 메시지를 localhost:3001 웹 채팅창에 그대로 띄우고,
// LLM(Hermes) 답변을 텔레그램으로 회신한다.
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { llmAnswer } = require('./llm.js');

try {
  const txt = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  txt.split(/\r?\n/).forEach(line => {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
} catch (_) {}

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const WEB = 'http://localhost:3001';
let lastUpdateId = 0;
process.env.BOT_ONLINE = '1';
const history = [];

function tgApi(method, params = {}) {
  return new Promise((resolve, reject) => {
    const q = new URLSearchParams(params).toString();
    https.get(`https://api.telegram.org/bot${BOT_TOKEN}/${method}?${q}`, (res) => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

function relayToWeb(text, from) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ from, text });
    const req = http.request(`${WEB}/api/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => { res.on('data', () => {}); res.on('end', resolve); });
    req.on('error', () => resolve()); req.write(data); req.end();
  });
}

async function poll() {
  if (!BOT_TOKEN) { console.log('⚠ BOT_TOKEN 없음. .env 확인.'); return; }
  console.log('🤖 텔레그램 릴레이 시작 → 웹 콘솔에 메시지 표시');
  try {
    const r = await tgApi('getUpdates', { offset: lastUpdateId + 1, timeout: 30 });
    if (r.ok && r.result.length) {
      for (const u of r.result) {
        lastUpdateId = u.update_id;
        const msg = u.message;
        if (!msg || !msg.text) continue;
        const name = msg.from ? (msg.from.first_name || msg.from.username || 'user') : 'user';
        console.log(`📨 텔레그램(${name}): ${msg.text}`);
        await relayToWeb(msg.text, name);              // 웹 채팅창에 표시!
        const answer = await llmAnswer(msg.text, history); // Hermes 답변
        history.push({ role: 'user', content: msg.text }, { role: 'assistant', content: answer });
        await tgApi('sendMessage', { chat_id: msg.chat.id, text: answer });
        console.log('   → 답변 회신 완료');
      }
    }
  } catch (e) { console.log('poll error:', e.message); }
  setTimeout(poll, 1000);
}
poll();
