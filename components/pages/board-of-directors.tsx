"use client"

import Image from "next/image"
import { useMemo, useRef, useState } from "react"

type Leader = {
  id: number
  name: string
  role: string
  term?: string
  note?: string
  image: string
  bio?: string[]
}

// Data thống nhất (đưa ra module scope để ổn định tham chiếu)
const LEADERS: Leader[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Chủ tịch Liên đoàn Bóng chuyền TP. Đà Nẵng",
    term: "Nhiệm kỳ 20xx–20xx",
    image: "/placeholder.svg?key=president",
    bio: [
      "Sinh năm 19xx, quê quán Đà Nẵng.",
      "Từ năm 20xx: Tham gia công tác quản lý, điều hành phong trào bóng chuyền thành phố.",
      "20xx–20xx: Giữ chức Phó Chủ tịch Liên đoàn.",
      "Từ 20xx đến nay: Chủ tịch Liên đoàn Bóng chuyền TP. Đà Nẵng (nhiệm kỳ 20xx–20xx).",
    ],
  },
  {
    id: 2,
    name: "Ông A",
    role: "Chủ tịch LĐBC Đà Nẵng",
    term: "Khóa VI (20xx–20xx)",
    note: "Nhiệm kỳ trọn vẹn",
    image: "/placeholder.svg?key=past1",
    bio: ["Lãnh đạo phong trào bóng chuyền phát triển rộng khắp.", "Tập trung công tác đào tạo tuyến trẻ."],
  },
  {
    id: 3,
    name: "Ông B",
    role: "Chủ tịch LĐBC Đà Nẵng",
    term: "Khóa V (20xx–20xx)",
    image: "/placeholder.svg?key=past2",
    bio: ["Tăng cường xã hội hóa, kết nối doanh nghiệp đồng hành."],
  },
  {
    id: 4,
    name: "Ông C",
    role: "Chủ tịch LĐBC Đà Nẵng",
    term: "Khóa IV (20xx–20xx)",
    note: "Từ 2003 đến hết nhiệm kỳ",
    image: "/placeholder.svg?key=past3",
    bio: ["Đẩy mạnh phong trào trường học, phát triển hệ thống giải phong trào."],
  },
  {
    id: 5,
    name: "Ông D",
    role: "Quyền Chủ tịch",
    term: "Khóa IV (20xx–20xx)",
    note: "Từ tháng 1 đến tháng 8/20xx",
    image: "/placeholder.svg?key=past4",
    bio: ["Điều hành liên đoàn giai đoạn chuyển giao."],
  },
  {
    id: 6,
    name: "Ông E",
    role: "Chủ tịch LĐBC Đà Nẵng",
    term: "Khóa III (20xx–20xx)",
    image: "/placeholder.svg?key=past5",
    bio: ["Củng cố tổ chức, kiện toàn các ban chuyên môn."],
  },
  {
    id: 7,
    name: "Bà F",
    role: "Chủ tịch LĐBC Đà Nẵng",
    term: "Khóa II (20xx–20xx)",
    image: "/placeholder.svg?key=past6",
    bio: ["Mở rộng hợp tác với các địa phương bạn."],
  },
  {
    id: 8,
    name: "Ông G",
    role: "Chủ tịch LĐBC Đà Nẵng",
    term: "Khóa I (20xx–20xx)",
    image: "/placeholder.svg?key=past7",
    bio: ["Đặt nền móng tổ chức Liên đoàn."],
  },
]

export default function BoardOfDirectors() {
  // Leader được chọn để hiển thị ở khối trên
  const [selected, setSelected] = useState<Leader>(LEADERS[0])

  // Trang hóa carousel (4 thẻ/trang) — an toàn với React Compiler
  const pages = useMemo(() => chunk(LEADERS, 4), [])
  const [page, setPage] = useState(0)

  // Ref để cuộn mượt tới khối chi tiết khi chọn từ carousel
  const detailRef = useRef<HTMLDivElement>(null)
  const showDetail = (leader: Leader) => {
    setSelected(leader)
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section className="bg-blue-50">
      {/* Khối chi tiết/“Chủ tịch hiện tại” */}
      <div ref={detailRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <h2 className="text-xl md:text-2xl font-extrabold uppercase text-center text-blue-700 mb-8 leading-tight">
          Ban lãnh đạo Liên đoàn Bóng chuyền thành phố Đà Nẵng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:gap-8 items-start">
          <div>
            <p className="text-base md:text-lg font-semibold text-foreground mb-1">
              Ông/Bà {selected.name}
            </p>
            <p className="text-sm md:text-base text-foreground/80 mb-3">
              {selected.role} {selected.term ? `• ${selected.term}` : ""} {selected.note ? `• ${selected.note}` : ""}
            </p>

            {/* giới hạn chiều cao để không tràn màn hình */}
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-foreground/90 max-h-48 md:max-h-56 overflow-y-auto pr-1">
              {(selected.bio?.length ? selected.bio : ["Đang cập nhật thông tin."]).map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="order-first md:order-last flex justify-end items-end">
            <Image
              src={selected.image || "/placeholder.svg"}
              width={300}
              height={320}
              alt={`Ảnh ${selected.name}`}
              className="w-[500px] h-[200px] md:h-80 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Carousel các lãnh đạo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-10">
        <div className="relative overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${page * 100}%)` }}
            aria-live="polite"
          >
            {pages.map((group, idx) => (
              <div key={idx} className="min-w-full py-4 px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                  {group.map((leader) => (
                    <figure
                      key={leader.id}
                      className={`bg-white rounded-lg shadow-sm p-3 text-center cursor-pointer transition
                        hover:shadow-md ${selected.id === leader.id ? "ring-2 ring-blue-600" : ""}`}
                      onClick={() => showDetail(leader)}
                      aria-pressed={selected.id === leader.id}
                    >
                      <Image
                        src={leader.image || "/placeholder.svg"}
                        width={360}
                        height={200}
                        alt={`Ảnh ${leader.name}`}
                        className="w-full h-60 md:h-48 object-cover rounded-md mb-3"
                      />
                      <figcaption>
                        <p className="text-xs md:text-sm text-foreground">
                          Ông/Bà <span className="font-semibold">{leader.name}</span>
                        </p>
                        <p className="text-xs md:text-sm text-foreground/80">{leader.role}</p>
                        {leader.term && <p className="text-xs text-foreground/70">{leader.term}</p>}
                        {leader.note && <p className="text-xs text-foreground/60">{leader.note}</p>}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Điều hướng trang */}
          <div className="flex items-center justify-center gap-2.5 mt-4">
            {pages.map((_, i) => (
              <button
                key={i}
                aria-label={`Trang ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${page === i ? "bg-blue-600" : "bg-blue-300 hover:bg-blue-400"
                  }`}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Utilities
function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = []
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
  return res
}
