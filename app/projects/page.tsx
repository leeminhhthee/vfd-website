import UserLayout from "@/components/layouts/user-layout"
import ProjectsList from "@/components/pages/projects-list"

export default function ProjectsPage() {
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Dự án</h1>
          <p className="text-lg text-muted-foreground">Các dự án và sáng kiến của Liên đoàn</p>
        </div>

        <ProjectsList />
      </div>
    </UserLayout>
  )
}
