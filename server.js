// 통합 콘솔 서버: 웹 채팅 + SSE 실시간 + 텔레그램 릴레이 + 노드그래프 편집
const http = require('http');
const fs = require('fs');
const path = require('path');
const { llmAnswer } = require('./llm.js');

const PORT = 3001;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
};

// --- 실시간 SSE 클라이언트 ---
const clients = new Set();
function broadcast(obj) { const p = `data: ${JSON.stringify(obj)}\n\n`; clients.forEach(r => r.write(p)); }

// --- 동적 노드 그래프 (실시간 수정 가능) ---
let GRAPH = {
  nodes: [
    { id: 'user',    x: 60,  y: 230, label: '사용자(웹)',   sub: '브라우저 입력' },
    { id: 'web',     x: 240, y: 120, label: '웹 페이지',     sub: 'index.html' },
    { id: 'tg_user', x: 60,  y: 380, label: '텔레그램 사용자', sub: '모바일 앱' },
    { id: 'telegram',x: 240, y: 410, label: '텔레그램 서버', sub: '클라우드 API' },
    { id: 'bot',     x: 420, y: 380, label: '봇 서버',       sub: 'bot.js' },
    { id: 'server',  x: 420, y: 200, label: 'Node 서버',     sub: 'server.js' },
    { id: 'llm',     x: 620, y: 290, label: 'Hermes (LLM)',  sub: 'Ollama/OpenAI' },
    { id: 'response',x: 820, y: 290, label: '응답 생성',     sub: '메시지 조립' },
  ],
  edges: [
    ['user','web'], ['web','server'], ['server','llm'], ['llm','response'], ['response','web'],
    ['tg_user','telegram'], ['telegram','bot'], ['bot','server'],
    ['response','bot'], ['bot','telegram'],
  ],
  paths: {
    web: ['user','web','server','llm','response','web'],
    telegram: ['tg_user','telegram','bot','server','llm','response','bot','telegram'],
  },
};
function saveGraph() { try { fs.writeFileSync(path.join(ROOT, '_graph.json'), JSON.stringify(GRAPH, null, 2)); } catch (_) {} }
try { const g = JSON.parse(fs.readFileSync(path.join(ROOT, '_graph.json'), 'utf8')); GRAPH = g; } catch (_) {}

// --- 대화 기록 (간단 메모리) ---
const history = [];

const server = http.createServer((req, res) => {
  const urlPath = (req.url === '/' ? '/index.html' : req.url).split('?')[0];

  if (urlPath === '/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' });
    res.write(`data: ${JSON.stringify({ type: 'hello', botOnline: !!process.env.BOT_ONLINE })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'graph', graph: GRAPH })}\n\n`);
    clients.add(res); req.on('close', () => clients.delete(res));
    return;
  }

  if (urlPath === '/api/graph' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(GRAPH)); return;
  }
  // 그래프 실시간 수정
  if (urlPath === '/api/graph' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      try {
        const g = JSON.parse(b);
        if (Array.isArray(g.nodes) && Array.isArray(g.edges)) { GRAPH = g; saveGraph(); broadcast({ type: 'graph', graph: GRAPH }); res.writeHead(200); res.end(JSON.stringify({ ok: true })); }
        else { res.writeHead(400); res.end(JSON.stringify({ ok: false, error: 'nodes/edges 필요' })); }
      } catch (e) { res.writeHead(400); res.end(JSON.stringify({ ok: false, error: e.message })); }
    });
    return;
  }

  // 웹 채팅: 사용자가 보낸 메시지 → Hermes(LLM) 답변 → SSE广播
  if (urlPath === '/api/chat' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', async () => {
      let text = ''; try { text = JSON.parse(b).text || ''; } catch (_) {}
      if (!text) { res.writeHead(400); res.end(JSON.stringify({ ok: false })); return; }
      broadcast({ type: 'message', source: 'web', from: 'user', text, ts: Date.now() });
      const answer = await llmAnswer(text, history);
      history.push({ role: 'user', content: text }, { role: 'assistant', content: answer });
      broadcast({ type: 'message', source: 'web', from: 'hermes', text: answer, ts: Date.now() });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // 텔레그램 릴레이: bot.js 가 호출. 웹 채팅창에 텔레그램 메시지 표시
  if (urlPath === '/api/telegram' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let p = {}; try { p = JSON.parse(b); } catch (_) {}
      broadcast({ type: 'message', source: 'telegram', from: p.from || 'user', text: p.text || '', ts: Date.now() });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // 정적 파일
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('404 Not Found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' }); res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Hermes 통합 콘솔 서버: http://localhost:${PORT}`);
});
