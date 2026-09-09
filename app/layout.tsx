import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import PageEnter from "@/components/PageEnter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SixtyNineNails — маникюр",
  description:
    "SixtyNineNails — салон маникюра. Красота в деталях. Уверенность в каждом жесте.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable} data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-screen bg-black font-sans font-light antialiased`}>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
          <Header />
          <main className="flex flex-1 flex-col">
            <PageEnter>{children}</PageEnter>
          </main>
        </div>
      </body>
    </html>
  );
}
