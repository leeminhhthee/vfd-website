import UserLayout from "@/components/layouts/user-layout"
import ProjectsList from "@/components/pages/project/projects-list"
import Partners from "@/components/sections/partners"

export default function ProjectsPage() {
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-accent rounded-full"></div>
            <h1 className="text-4xl font-bold text-foreground uppercase">Các Dự Án</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Các dự án và sáng kiến của Liên đoàn Bóng chuyền TP Đà Nẵng đang thực hiện
          </p>
        </div>

        <ProjectsList />
        
        <Partners />
      </div>
    </UserLayout>
  )
}
