# 니 성격 뭔데?

Google 로그인 기반의 성격 경향 설문 서비스입니다. 12개 질문의 응답을 바탕으로 16가지 MBTI 형식 결과를 보여 주고, 응답을 Supabase PostgreSQL에 저장합니다.

> 이 서비스는 흥미를 위한 성격 경향 설문이며, 의학적·심리학적 진단 도구가 아닙니다.

## 기능

- Google OAuth 로그인
- 12문항·16유형 결과 계산
- 로그인 사용자별 응답 저장 및 재응시
- 관리자(`schaffencom@gmail.com`) 전용 통계·CSV 다운로드
- Supabase Row Level Security(RLS) 기반 권한 제어
- Vercel 배포 지원

## 로컬 실행

```bash
npm install
copy .env.example .env.local
npm run dev
```

`.env.local`의 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 Supabase의 **anon public key**를 입력하세요.

## Supabase 설정

1. Supabase Dashboard → **SQL Editor**에서 `supabase/schema.sql` 전체를 실행합니다.
2. Authentication → Providers → **Google**을 켭니다.
3. Google Cloud Console에서 발급한 Client ID/Client Secret을 Google Provider 설정에 입력합니다.
4. Authentication → URL Configuration에서 다음을 추가합니다.
   - Site URL: `https://polytech-4mv4.vercel.app`
   - Redirect URLs: `http://localhost:3000`, `https://polytech-4mv4.vercel.app`

## Vercel 환경 변수

Vercel Dashboard → Project → Settings → Environment Variables에 다음을 입력합니다.

| 이름 | 값 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hhirmhtkdjclvjsbpuad.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings → API의 anon public key |

`service_role key`, Google Client Secret, Vercel 토큰은 코드나 채팅에 절대 넣지 마세요.

## 배포

GitHub의 `main` 브랜치에 푸시하면, 해당 저장소와 연결된 Vercel 프로젝트에서 자동으로 빌드·배포하도록 연결할 수 있습니다.

```bash
npm run test
npm run build
```
