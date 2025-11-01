"use client"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export default function UserFooter() {
  return (
    <footer className="bg-primary text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 pb-8 border-b border-primary-light flex justify-center">
          <Image
            src="/logo-vfd-full.png"
            alt="Liên đoàn Bóng chuyền TP Đà Nẵng"
            width={300}
            height={100}
            className="h-16 w-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Về chúng tôi</h3>
            <p className="text-sm text-gray-300">
              Liên đoàn Bóng chuyền TP Đà Nẵng - Nơi phát triển tài năng bóng chuyền.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/news" className="hover:text-accent transition-colors">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-accent transition-colors">
                  Lịch thi đấu
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-accent transition-colors">
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(0236) 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@volleyball.dn</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Đà Nẵng, Việt Nam</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-4">Theo dõi</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-accent text-primary rounded-full flex items-center justify-center hover:bg-accent-light transition-colors"
              >
                f
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-accent text-primary rounded-full flex items-center justify-center hover:bg-accent-light transition-colors"
              >
                ig
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-light pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2025 Liên đoàn Bóng chuyền TP Đà Nẵng. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
