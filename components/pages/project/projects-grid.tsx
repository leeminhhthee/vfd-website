import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { ProjectItem } from "@/data/model/project.model"

interface ProjectsGridProps {
  projects: ProjectItem[]
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg?height=200&width=400"}
              fill
              alt={project.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-primary mb-3 line-clamp-2">{project.title}</h3>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.overview}</p>

            {/* Details */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-bold text-foreground min-w-fit">Duration:</span>
                <span className="text-muted-foreground">{project.duration}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-foreground min-w-fit">Location:</span>
                <span className="text-muted-foreground">{project.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-foreground min-w-fit">Budget:</span>
                <span className="text-accent font-bold">{project.price}</span>
              </div>
            </div>

            {/* Button */}
            <Link
              href={`/projects`}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-accent text-accent font-bold rounded-lg hover:bg-accent hover:text-white transition-colors duration-200"
            >
              Xem chi tiết
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
