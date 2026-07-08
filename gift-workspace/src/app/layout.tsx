import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "선물 추천 | 예산·취향 맞춤 선물 찾기",
  description: "관계, 예산, 성향을 선택하면 이유 있는 선물 3~5개를 추천하고 카카오·쿠팡·네이버에서 바로 구매할 수 있습니다.",
  openGraph: {
    title: "선물 추천 | 예산·취향 맞춤 선물 찾기",
    description: "5가지 질문으로 예산에 맞는 선물을 추천받고 바로 구매하세요.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* 현재 대시보드의 측정 ID로 스크립트 로드 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VDNT5S5ZX5"
          strategy="afterInteractive"
        />
        {/* 현재 대시보드의 측정 ID로 초기화 설정 */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VDNT5S5ZX5');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
