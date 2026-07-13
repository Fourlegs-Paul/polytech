# 실시간 노드 그래프 — 월드컵 2026 봇 흐름 (학생 데모)

Hermes Agent가 "지금 활용하는 구조"를 그대로 실시간 노드 그래프로
보여주는 웹앱입니다. 학생이 "텔레그램에 월드컵이라고 보낸다"는
행동을 버튼/실제 봇으로 트리거하면, 흐름이 노드 단위로 점등됩니다.

## 구조 (노드)
사용자 → 텔레그램서버 → 봇서버(Node) → 트리거감지("월드컵")
→ 데이터모듈 → 응답생성 → 텔레그램전송 → 사용자수신

## 실행
1) 웹 서버 (토큰 불필요, 바로 데모 가능)
   cd html
   node server.js
   → 브라우저 http://localhost:3001
   → "📱 텔레그램에 '월드컵' 보내기" 클릭 → 그래프 점등

2) 텔레그램 봇 (실제 메시지 연동, 토큰 필요)
   - @BotFather → /newbot → 토큰 발급
   - set BOT_TOKEN=123456:ABC...
   - node bot.js
   - 텔레그램에서 봇에게 "월드컵" 전송
     → 봇이 스냅샷 회신 + 웹 그래프 라이브 점등

## 라이브 데이터 연동
worldcup-data.js 의 fetchLive() 를 football-data.org 등과 연결하면
실제 순위가 갱신됩니다 (현재는 2026-07-13 기준 데모 스냅샷).

## 파일
- index.html        : 노드그래프 UI + SSE 수신 + 트리거 버튼
- server.js         : 정적서버 + SSE(/events) + 트리거(/api/trigger)
- bot.js            : 텔레그램 폴링 봇 (월드컵 트리거)
- worldcup-data.js  : 월드컵 2026 스냅샷 + fetchLive() 자리
- config.js         : 환경변수 설정 예시
