import "reflect-metadata";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import type React from "react";
import "./globals.css";

const headingFont = Montserrat({
  subsets: ["vietnamese"],
  weight: ["700", "800", "900"],
  variable: "--font-heading",
});

const bodyFont = Open_Sans({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Liên đoàn Bóng chuyền TP Đà Nẵng",
  description: "Website chính thức của Liên đoàn Bóng chuyền TP Đà Nẵng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className={`${bodyFont.className} ${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
