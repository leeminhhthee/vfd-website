"use client"

type Props = {
  backgroundUrl?: string
}

export default function Introductions({ backgroundUrl = "/assets/images/bg.jpg" }: Props) {
  const sections = [
    {
      title: "Mục tiêu",
      description:
        "Phát triển phong trào bóng chuyền trong cộng đồng, đào tạo và bồi dưỡng tài năng trẻ, nâng cao chất lượng chuyên môn, tổ chức các giải đấu cấp thành phố và khu vực, đồng thời đóng góp vào sự phát triển của thể thao chuyên nghiệp và xây dựng cộng đồng yêu thích bóng chuyền mạnh mẽ.",
    },
    {
      title: "Sứ mệnh",
      description:
        "Liên đoàn bóng chuyền Tp.Đà Nẵng thúc đẩy sự phát triển của bóng chuyền trong cộng đồng, tạo cơ hội cho mọi người tham gia và rèn luyện sức khỏe, đồng thời phát hiện và nuôi dưỡng những tài năng thể thao để nâng cao vị thế của bóng chuyền Đà Nẵng trên cả nước.",
    },
    {
      title: "Tầm nhìn",
      description:
        "Liên đoàn bóng chuyền Tp.Đà Nẵng phải trở thành một trung tâm phát triển bóng chuyền hàng đầu của Việt Nam, với phong trào thể thao mạnh mẽ, các vận động viên xuất sắc và đóng góp tích cực cho nền thể thao quốc gia, đồng thời xây dựng cộng đồng bóng chuyền sôi động và bền vững.",
    },
  ]

  return (
    <section
      className="relative py-20 md:py-22 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold italic tracking-wider text-white">
            OUR VALUE
          </h2>
          <p className="mt-2 text-base md:text-xl text-white/80">
            GIÁ TRỊ CHÚNG TÔI HƯỚNG ĐẾN
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-[#0B3B88]/95 text-white rounded-[28px] md:rounded-[40px] p-6 md:p-10 shadow-2xl backdrop-blur-[1px] h-full"
            >
              <h3 className="text-2xl md:text-4xl font-extrabold italic text-center mb-4 md:mb-6">
                {section.title}
              </h3>
              <p className="text-white/90 text-base md:text-sm leading-relaxed text-center text-justify">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
