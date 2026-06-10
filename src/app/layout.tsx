import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-cn",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://intlaward.com'),
  title: "DesignMatch | AI 设计奖项匹配工具",
  description: "免费 AI 工具，智能匹配 iF、Red Dot、G-Mark 等 30+ 国际设计奖项。上传作品，1 分钟获取精准推荐。",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'DesignMatch',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${spaceGrotesk.variable} ${notoSansSC.variable}`}>
      <body className="min-h-full flex flex-col bg-white text-black font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'DesignMatch',
              url: 'https://intlaward.com',
              logo: 'https://intlaward.com/icon.png',
              description: 'AI 驱动的国际设计奖项匹配与推荐平台',
              areaServed: '中国',
              availableLanguage: ['zh-Hans', 'en'],
            }),
          }}
        />
      </body>
    </html>
  );
}
