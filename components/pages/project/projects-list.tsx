"use client";

import { projectInteractor } from "@/data/datasource/project/interactor/project.interactor";
import { ProjectItem } from "@/data/model/project.model";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProjectsGrid from "./projects-grid";

const PROJECTS_PER_PAGE = 12;

export default function ProjectsList() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: projectsData,
    isLoading,
    isError,
  } = useQuery<ProjectItem[]>({
    queryKey: ["projects"],
    queryFn: () => projectInteractor.getProjectList(),
  });

  const filteredProjects = projectsData || [];

  const projects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading projects</div>;
  }

  return (
    <div className="space-y-8">
      <ProjectsGrid projects={projects} />
      {/* <ProjectsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> */}
    </div>
  );
}
