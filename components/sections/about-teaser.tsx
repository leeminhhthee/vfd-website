"use client"

import Link from "next/link"
import Image from "next/image"

export default function AboutTeaser() {
  return (
    // Sử dụng min-h-[50vh] để đảm bảo chiều cao tối thiểu và tạo không gian thoáng
    <section className="relative w-full min-h-[50vh] flex items-center justify-center py-20 bg-gray-900">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bannner.jpg" // Đảm bảo đường dẫn này khớp với vị trí file bannner.jpg của bạn
          alt="Background thể thao"
          fill
          className="object-cover opacity-70" // Giảm opacity để chữ dễ đọc hơn
          priority 
        />
        {/* Overlay tối nhẹ để tăng độ tương phản của chữ */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase mb-6 drop-shadow-lg">
          LIÊN ĐOÀN BÓNG CHUYỀN THÀNH PHỐ ĐÀ NẴNG
        </h2>

        {/* Subtitle/Mission Statement */}
        <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed font-light">
          Chúng tôi xây dựng các chương trình trình với nhiều hình thức khác nhau và tập trung vào việc thúc đẩy hoạt động bóng chuyền, thể chất, xây dựng phát triển thể thao cộng đồng và kết nối xã hội và tạo cơ hội phát triển thể chất vì thành phố Đà Nẵng khỏe mạnh.
        </p>

        {/* CTA Button */}
        <Link
          href="/about" // Link đến trang Giới thiệu (Về chúng tôi)
          className="inline-block px-10 py-3 bg-red-700 text-white font-bold rounded-lg shadow-xl hover:bg-red-800 transition-all duration-300 transform hover:scale-105"
        >
          Xem thêm
        </Link>
      </div>
    </section>
  )
}