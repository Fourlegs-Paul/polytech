import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "니 성격 뭔데?",
  description: "Google 로그인 기반 성격 경향 설문",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
