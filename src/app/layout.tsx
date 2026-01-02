import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "조력자들 | 개그맨·MC·아나운서 섭외 전문",
  description: "기업 행사, 축제, 웨딩, 각종 이벤트에 딱 맞는 전문 MC와 진행자를 섭외해 드립니다. 개그맨, MC, 아나운서 섭외 전문 업체 조력자들",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
