"use client"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function ProjectsList() {
  const projects = [
    {
      id: 1,
      title: "Dự án phát triển bóng chuyền trẻ",
      description: "Chương trình phát triển tài năng bóng chuyền cho các vận động viên trẻ tuổi",
      image: "/youth-volleyball.jpg",
      status: "Đang thực hiện",
    },
    {
      id: 2,
      title: "Xây dựng trung tâm đào tạo bóng chuyền",
      description: "Dự án xây dựng trung tâm đào tạo chuyên nghiệp tại Đà Nẵng",
      image: "/volleyball-tournament.jpg",
      status: "Lên kế hoạch",
    },
    {
      id: 3,
      title: "Chương trình trao đổi quốc tế",
      description: "Hợp tác với các liên đoàn bóng chuyền quốc tế để trao đổi kinh nghiệm",
      image: "/volleyball-team.jpg",
      status: "Đang thực hiện",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-48 object-cover" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  project.status === "Đang thực hiện" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {project.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">{project.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-2 text-accent font-bold hover:text-accent-light transition-colors"
            >
              Xem chi tiết <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
