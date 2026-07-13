import { createBrowserClient } from "@supabase/ssr";

// Supabase anon key는 브라우저에 공개되는 키이며, 실제 데이터 접근은 RLS 정책이 제한합니다.
// 환경 변수가 없는 다른 Vercel 프로젝트 배포에서도 로그인 화면이 중단되지 않도록 공개 연결값을 기본값으로 둡니다.
const fallbackUrl = "https://hhirmhtkdjclvjsbpuad.supabase.co";
const fallbackAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoaXJtaHRrZGpjbHZqc2JwdWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzE1MTIsImV4cCI6MjA5OTUwNzUxMn0.yg-NvTtQ-tNIvCo2atIfx-JjAv-49Jcnu4LXAZ_lzRQ";

export function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackAnonKey,
  );
}
