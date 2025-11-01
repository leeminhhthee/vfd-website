"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Tăng tốc độ tự động chuyển slide lên 5 giây (5000ms) để hiện đại hơn
const AUTO_SLIDE_INTERVAL = 5000

const slides = [
  {
    id: 1,
    image: "/hero/hero1.png",
    title: "Liên đoàn Bóng chuyền TP Đà Nẵng",
    subtitle:
      "Nơi phát triển tài năng, tổ chức các giải đấu chuyên nghiệp và nâng cao trình độ bóng chuyền tại Đà Nẵng.",
    buttonText: "Đăng ký thành viên",
    buttonHref: "/membership",
  },
  {
    id: 2,
    image: "/hero/hero2.jpg",
    title: "Kết nối – Rèn luyện – Vươn tầm",
    subtitle:
      "Cùng nhau xây dựng cộng đồng bóng chuyền Đà Nẵng vững mạnh và chuyên nghiệp. Tham gia ngay!",
    buttonText: "Xem lịch thi đấu",
    buttonHref: "/schedule",
  },
  {
    id: 3,
    image: "/hero/hero3.jpg",
    title: "Tham gia cộng đồng thành viên",
    subtitle:
      "Đăng ký thành viên để nhận tin tức, tham gia sự kiện và phát triển cùng chúng tôi!",
    buttonText: "Đăng ký ngay",
    buttonHref: "/membership",
  },
  {
    id: 4,
    image: "/hero/hero4.jpg",
    title: "Giải bóng chuyền sinh viên đại học, cao đẳng",
    subtitle: "Trải nghiệm không khí thi đấu sôi động và gắn kết cộng đồng! Đừng bỏ lỡ!",
    buttonText: "Đăng ký giải đấu",
    buttonHref: "/register",
  },
]

export default function   Hero() {
  const [current, setCurrent] = useState(0)

  // Hàm chuyển slide
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length)

  // Tự động chuyển slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, AUTO_SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  return (
    // Tăng chiều cao lên h-screen-dành cho các thiết bị lớn, hoặc giữ h-[90vh]
    <section className="relative w-full overflow-hidden pt-20 min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-5rem)]">
      {/* Container của các Slide */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6 z-20">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              current === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Ảnh nền */}
            <Image
              src={slide.image}
              alt={slide.title}
              // Sử dụng layout fill và object-cover để ảnh luôn full màn hình
              fill
              className="object-cover" 
              priority={slide.id === 1}
            />
            
            {/* Overlay Gradient (Tạo chiều sâu và độ tương phản) */}
            <div className="absolute inset-0 bg-black/10 lg:bg-gradient-to-t lg:from-black/40 lg:to-transparent"></div>

            {/* Nội dung Slide */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6 z-20">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 animate-in fade-in-up duration-1000 ease-out [text-shadow:_0_4px_8px_rgb(0_0_0_/_70%)]">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-10 max-w-3xl font-medium text-gray-100 animate-in fade-in-up delay-200 duration-1000 ease-out [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)]">
                {slide.subtitle}
              </p>
              
              {/* Nút Call-to-Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={slide.buttonHref}
                  className="px-8 py-3 bg-accent text-primary font-bold rounded-full hover:bg-accent-light transition-all duration-300 shadow-xl hover:scale-[1.03]"
                >
                  {slide.buttonText}
                </Link>
                {/* Bạn có thể thêm nút thứ hai nếu cần, ví dụ: */}
                {slide.id !== 4 && (
                  <Link
                    href="/contact"
                    className="px-8 py-3 border-2 border-white/60 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 shadow-xl hover:scale-[1.03]"
                  >
                    Liên hệ
                  </Link>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Nút điều hướng trái phải */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 p-3 rounded-full text-white transition duration-300 z-30 opacity-70 hover:opacity-100"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 p-3 rounded-full text-white transition duration-300 z-30 opacity-70 hover:opacity-100"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dấu chấm chỉ báo */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border border-white ${
              current === index ? "bg-accent scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}