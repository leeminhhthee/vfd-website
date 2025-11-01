import type React from "react"
import type { Metadata } from "next"
// Sửa đổi: Import Montserrat và Open_Sans thay vì Geist
import { Montserrat, Open_Sans } from "next/font/google"
import "./globals.css"

// Khởi tạo Montserrat cho Tiêu đề
const headingFont = Montserrat({
  subsets: ["vietnamese"],
  weight: ["700", "800", "900"],
  variable: "--font-heading",
})

// Khởi tạo Open Sans cho Nội dung (sẽ là font mặc định)
const bodyFont = Open_Sans({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
})


export const metadata: Metadata = {
  title: "Liên đoàn Bóng chuyền TP Đà Nẵng",
  description: "Website chính thức của Liên đoàn Bóng chuyền TP Đà Nẵng",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      {/* Áp dụng bodyFont.className (Open Sans) làm mặc định, và thêm các biến font vào body */}
      <body 
        className={`${bodyFont.className} ${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}