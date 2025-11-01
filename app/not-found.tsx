"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003d7a] via-[#0052a3] to-[#003d7a] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#ff8c42] rounded-full opacity-10 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-[#ff8c42] rounded-full opacity-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full opacity-5 animate-bounce"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo-vfd-full.png"
            alt="Liên đoàn Bóng chuyền TP Đà Nẵng"
            width={120}
            height={80}
            className="h-20 w-auto animate-bounce"
            style={{ animationDuration: "2s" }}
          />
        </div>

        {/* Animated volleyball */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-30 h-30 animate-spin" style={{ animationDuration: "3s" }}>
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Volleyball */}
              <circle cx="50" cy="50" r="45" stroke="#ff8c42" strokeWidth="2" />
              <circle cx="50" cy="50" r="40" fill="#ffffff" opacity="0.1" />

              {/* Curved lines on volleyball */}
              <path d="M 50 10 Q 70 30 70 50 Q 70 70 50 90" stroke="#ff8c42" strokeWidth="1.5" fill="none" />
              <path d="M 50 10 Q 30 30 30 50 Q 30 70 50 90" stroke="#ff8c42" strokeWidth="1.5" fill="none" />
              <line x1="30" y1="50" x2="70" y2="50" stroke="#ff8c42" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* 404 Text with animation */}
        <div className="mb-6">
          <h1
            className="text-6xl md:text-8xl font-bold text-white mb-2 animate-bounce"
            style={{ animationDuration: "2s" }}
          >
            404
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[#ff8c42] to-transparent mx-auto mb-6 animate-pulse"></div>
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Không tìm thấy trang</h2>
          <p className="text-lg text-gray-200 mb-2">Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <p className="text-base text-gray-300">Giống như một quả bóng bay ra ngoài sân, trang này đã biến mất!</p>
        </div>

        {/* Animated court lines */}
        <div className="mb-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#ff8c42] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#ff8c42] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-[#ff8c42] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button
              size="lg"
              className="bg-[#ff8c42] hover:bg-[#ffb380] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Quay lại trang chủ
            </Button>
          </Link>
          <Link href="/search">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#003d7a] font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 bg-transparent"
            >
              Tìm kiếm
            </Button>
          </Link>
        </div>

        {/* Decorative text */}
        <div className="mt-12 text-sm text-gray-300">
          <p>Liên đoàn Bóng chuyền TP Đà Nẵng</p>
        </div>
      </div>

      {/* Animated floating elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
