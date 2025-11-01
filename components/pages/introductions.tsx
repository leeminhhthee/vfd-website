"use client"
import { Target, Users, Trophy } from "lucide-react"

export default function Introductions() {
  const sections = [
    {
      icon: Target,
      title: "Sứ mệnh",
      description:
        "Phát triển bóng chuyền tại Đà Nẵng, nâng cao trình độ và tạo cơ hội cho các vận động viên tài năng.",
    },
    {
      icon: Users,
      title: "Tầm nhìn",
      description: "Trở thành liên đoàn bóng chuyền hàng đầu khu vực, góp phần nâng cao vị thế bóng chuyền Việt Nam.",
    },
    {
      icon: Trophy,
      title: "Giá trị",
      description: "Chuyên nghiệp, công bằng, minh bạch và cam kết phát triển bóng chuyền bền vững.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div key={section.title} className="bg-white rounded-lg p-8 border border-border text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Icon size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{section.title}</h3>
                <p className="text-muted-foreground">{section.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
