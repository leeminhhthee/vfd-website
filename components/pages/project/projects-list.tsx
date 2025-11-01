"use client"

import { useState } from "react"
import { getProjectsPaginated, getTotalPages } from "@/lib/projects-data"
import ProjectsGrid from "./projects-grid"
import ProjectsPagination from "./projects-pagination"

export default function ProjectsList() {
  const [currentPage, setCurrentPage] = useState(1)
  const projects = getProjectsPaginated(currentPage)
  const totalPages = getTotalPages()

  return (
    <div className="space-y-8">
      <ProjectsGrid projects={projects} />
      <ProjectsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}
