"use client"

import Link from "next/link"
import Image from "next/image"

interface AffectedObject {
  id: number
  title: string
  description: string
  image: string
}

const objectData: AffectedObject[] = [
  {
    id: 1,
    title: "Hệ thống giáo dục các cấp",
    description:
      "Tạo điều kiện để các em làm quen và phát triển kỹ năng bóng chuyền từ sớm thông qua các chương trình đào tạo, trại hè, và giải đấu học sinh.",
    image: "/assets/images/intro/hocsinh.png",
  },
  {
    id: 2,
    title: "Học sinh, sinh viên",
    description:
      "Xây dựng phong trào bóng chuyền trong trường học, tổ chức các giải đấu và hoạt động ngoại khóa, từ đó phát triển thói quen tập thể thao và nâng cao tinh thần đồng đội.",
    image: "/assets/images/intro/cd3-2.jpg",
  },
  {
    id: 3,
    title: "Mọi lứa tuổi đang sinh sống, làm việc tại Đà Nẵng",
    description:
      "Khuyến khích những người yêu thích bóng chuyền tham gia các hoạt động tập luyện và thi đấu phong trào nhằm rèn luyện sức khỏe, nâng cao tinh thần thể thao.",
    image: "/assets/images/intro/cd3-3.png",
  },
  {
    id: 4,
    title: "Vận động viên",
    description:
      "Cá nhân người chơi chuyên nghiệp và nghiệp dư, từ trẻ em đến người lớn, nhằm phát triển kỹ năng và nâng cao thành tích thi đấu.",
    image: "/assets/images/intro/bc-db.png",
  },
  {
    id: 5,
    title: "Các câu lạc bộ và tổ chức thể thao",
    description:
      "Hỗ trợ và hợp tác trong việc tổ chức các giải đấu và sự kiện bóng chuyền.",
    image: "/assets/images/intro/cd5.png",
  },
  {
    id: 6,
    title: "Huấn luyện viên và trọng tài",
    description:
      "Tổ chức các khóa học nâng cao kiến thức và kỹ năng huấn luyện, cập nhật các phương pháp huấn luyện hiện đại.",
    image: "/assets/images/intro/trong-tai.png",
  },
]

export default function AffectedObjects() {
  return (
    <section className="py-4 md:py-4 bg-white font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề chính */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-12 uppercase font-heading">
          Đối tượng tác động
        </h2>

        {/* Lưới 3 cột trên desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objectData.map((obj) => (
            <div
              key={obj.id}
              className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl border border-border/50"
            >
              {/* Hình ảnh (Sử dụng tỷ lệ 4:3) */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={obj.image}
                  alt={obj.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Nội dung */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-foreground mb-3 uppercase font-heading">
                  {obj.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow">
                  {obj.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
