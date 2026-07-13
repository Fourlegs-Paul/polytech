export default function HowPage() {
  return <main className="how"><header><b>달빛 타로 · 따라하기 수업</b><a href="/">서비스로 돌아가기</a></header><article><p className="kicker">BUILD WITH HERMES</p><h1>아이디어를 웹서비스로<br/>배포하는 방법</h1><p className="lead">이 수업의 목표는 코드를 직접 외우는 것이 아닙니다. GitHub, Vercel, Supabase, AI API가 각각 무엇을 맡는지 이해하고, 자신의 Hermes에게 원하는 서비스를 정확히 요청해 완성하는 것입니다.</p>
  <section><h2>수업의 전체 지도</h2><pre>{`1. 서비스 아이디어 정하기
        ↓
2. GitHub 저장소 만들기 ── 코드의 원본·변경 기록
        ↓
3. Hermes에게 앱 제작 요청 ── 코드와 테스트 생성
        ↓
4. Vercel 연결 ──────────── 웹에 자동 배포
        ↓
5. Supabase 연결 ────────── 로그인·DB·권한
        ↓
6. Gemini API 연결 ──────── AI 기능
        ↓
7. 실제 사용자 흐름 검증 ── 로그인 → 저장 → 결과`}</pre></section>
  <section><h2>1. GitHub: 프로젝트의 원본 보관함</h2><p>GitHub는 코드 파일을 보관하고, 언제 무엇이 바뀌었는지 기록하는 서비스입니다. Hermes가 만든 코드는 GitHub 저장소에 푸시하고, Vercel은 이 저장소의 변경을 감지해 자동으로 새 웹사이트를 만듭니다.</p><div className="grid"><div><strong>가입</strong><p>github.com에서 계정을 만들고 이메일 인증을 합니다.</p></div><div><strong>저장소(Repository)</strong><p>서비스 하나당 저장소 하나를 만듭니다. 예: <code>my-tarot-app</code></p></div><div><strong>커밋(Commit)</strong><p>“어떤 변경을 저장했다”는 이력입니다. 문제가 생기면 이전 상태를 비교할 수 있습니다.</p></div></div><p className="tip"><b>Hermes에게 이렇게 요청하세요.</b><br/>“현재 폴더의 프로젝트를 GitHub 저장소에 연결하고, 변경 내용을 커밋한 뒤 main 브랜치로 푸시해줘.”</p></section>
  <section><h2>2. Vercel: 코드를 웹주소로 바꾸는 서비스</h2><p>Vercel은 GitHub 저장소를 받아 자동으로 빌드하고, 누구나 접속할 수 있는 <code>프로젝트이름.vercel.app</code> 주소로 배포합니다. 코드를 수정해 GitHub에 푸시하면 Vercel이 다시 배포합니다.</p><ol><li><b>가입 및 연결</b><span>vercel.com에서 GitHub 계정으로 로그인하고, GitHub 저장소를 Import합니다.</span></li><li><b>프로젝트 주소 확인</b><span>여러 Vercel 프로젝트가 생기면 각각 다른 <code>vercel.app</code> 주소를 갖습니다. 실제 사용 중인 주소 하나를 기준으로 삼아야 합니다.</span></li><li><b>환경 변수 설정</b><span>Settings → Environment Variables에서 API 키와 서비스 주소를 입력합니다. 키를 코드나 GitHub에 쓰지 않는 이유는 비밀 정보를 보호하기 위해서입니다.</span></li><li><b>재배포</b><span>환경 변수를 바꾼 뒤에는 Deployments에서 Redeploy해야 새 배포본에 반영됩니다.</span></li></ol><p className="tip"><b>핵심 팁:</b> 환경 변수는 <em>어느 Vercel 프로젝트</em>의 <em>Production</em> 환경에 넣었는지 확인해야 합니다. 다른 프로젝트에 넣으면 사이트에서는 읽을 수 없습니다.</p></section>
  <section><h2>3. Supabase: 로그인과 데이터베이스</h2><p>Supabase는 PostgreSQL 데이터베이스와 사용자 로그인을 함께 제공하는 백엔드 서비스입니다. 타로 서비스에서는 Google 로그인 정보와 사용자가 뽑은 카드·질문·AI 풀이를 저장합니다.</p><div className="grid"><div><strong>Authentication</strong><p>Google 로그인처럼 “누가 접속했는지” 확인합니다.</p></div><div><strong>Table Editor</strong><p>데이터베이스 테이블과 실제 저장된 행을 표 형태로 확인합니다.</p></div><div><strong>SQL Editor</strong><p>테이블과 접근 규칙을 만드는 명령을 실행합니다.</p></div></div><p>중요한 개념은 <b>RLS(Row Level Security)</b>입니다. “로그인한 사용자는 자기 기록만 읽는다”, “관리자만 전체 기록을 본다” 같은 규칙을 DB 자체에 설정합니다.</p><p className="tip"><b>OAuth 팁:</b> Google 로그인 뒤 돌아올 주소는 Supabase → Authentication → URL Configuration에 등록해야 합니다. Vercel 주소가 바뀌면 Site URL과 Redirect URLs도 함께 변경합니다.</p></section>
  <section><h2>4. Gemini API: 앱에 AI 기능 붙이기</h2><p>Gemini API는 사용자의 질문과 카드 정보를 받아 자연스러운 텍스트 풀이를 생성합니다. API 키는 Gemini에 요청할 자격증명이며, 반드시 Vercel 환경 변수 <code>GEMINI_API_KEY</code>로만 보관합니다.</p><ul><li>키는 Google AI Studio에서 발급합니다.</li><li>키를 Telegram, GitHub, 브라우저 코드에 붙여 넣지 않습니다.</li><li>모델 이름은 시간이 지나면 바뀌거나 종료될 수 있으므로, 오류가 나면 공식 모델 목록을 확인합니다.</li><li>무료 티어도 호출 횟수·속도 제한이 있을 수 있습니다.</li></ul></section>
  <section><h2>5. Hermes에게 잘 요청하는 법</h2><p>코드를 직접 작성하는 대신, 요구사항·제약·완료 기준을 분명하게 말합니다.</p><pre>{`좋은 요청 예시
“Google 로그인 사용자만 사용할 수 있는 타로 웹앱을 만들어줘.
카드는 3장을 중복 없이 랜덤으로 뽑고,
결과는 Supabase에 저장해줘.
관리자 이메일은 example@gmail.com이고,
Vercel 배포까지 가능한 Next.js 프로젝트로 만들어줘.
테스트와 빌드도 실행해서 검증해줘.”`}</pre><p>에러가 나면 “안 돼”보다 <b>오류 메시지 전체, 현재 접속 주소, 설정 화면</b>을 함께 보여주는 것이 가장 빠릅니다.</p></section>
  <section><h2>6. 우리가 겪은 오류로 배우기</h2><div className="lessons"><div><b>“Supabase 환경 변수가 없습니다”</b><p>원인: 실제 접속 도메인과 환경 변수를 설정한 Vercel 프로젝트가 달랐습니다.</p><p>점검: 주소창의 도메인 → Vercel 프로젝트 이름 → Production 환경 변수 순서로 확인합니다.</p></div><div><b>Google 로그인 후 예전 주소로 이동</b><p>원인: Supabase Redirect URL이 이전 Vercel 주소였습니다.</p><p>점검: Supabase URL Configuration에 현재 배포 주소를 등록합니다.</p></div><div><b>AI API 429 / 404</b><p>429는 보통 한도·결제·요청량 문제, 404는 모델 이름·경로 문제입니다.</p><p>점검: API 키 자체보다 오류 코드와 공식 문서를 먼저 확인합니다.</p></div><div><b>배포했는데 예전 화면이 보임</b><p>환경 변수 변경은 새 배포에만 반영됩니다. Redeploy 후 강력 새로고침합니다.</p></div></div></section>
  <section className="check"><h2>수업 마무리 체크리스트</h2><p>□ GitHub 저장소를 만들었는가? &nbsp; □ Vercel이 올바른 저장소와 연결됐는가? &nbsp; □ 실제 접속 주소를 알고 있는가? &nbsp; □ Supabase 테이블과 RLS를 만들었는가? &nbsp; □ Google Redirect URL을 등록했는가? &nbsp; □ API 키를 Vercel Production 환경에만 넣었는가? &nbsp; □ Hermes에게 테스트와 빌드 검증을 요청했는가?</p></section></article></main>
}
