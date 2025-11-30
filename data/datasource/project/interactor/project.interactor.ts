import { ProjectItem } from "@/data/model/project.model";
import { projectRepository } from "../repository/project.repository";

export const projectInteractor = {
  async getProjectList() {
    const list = await projectRepository.getProjectList();
    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async createProject(data: Partial<ProjectItem>) {
    const created = await projectRepository.createProject(data);
    return created;
  },

  async updateProject(id: number, data: Partial<ProjectItem>) {
    const updated = await projectRepository.updateProject(id, data);
    return updated;
  },

  async deleteProject(id: number) {
    const result = await projectRepository.deleteProject(id);
    return result;
  },
};
