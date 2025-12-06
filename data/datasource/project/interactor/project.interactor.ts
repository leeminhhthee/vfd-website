import { ProjectItem } from "@/data/model/project.model";
import { projectRepository } from "../repository/project.repository";

type ProjectPayload = Omit<Partial<ProjectItem>, 'bankQrCode'> & {
  bankId?: number;
};

export const projectInteractor = {
  async getProjectList() {
    const list = await projectRepository.getProjectList();
    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async createProject(data: ProjectPayload) {
    const created = await projectRepository.createProject(data);
    return created;
  },

  async updateProject(id: number, data: ProjectPayload) {
    const updated = await projectRepository.updateProject(id, data);
    return updated;
  },

  async deleteProject(id: number) {
    const result = await projectRepository.deleteProject(id);
    return result;
  },

  async getProjectById(id: number) {
    const project = await projectRepository.getProjectById(id);
    return project;
  },

  async getProjectsByCategory(id: number) {
    const list = await projectRepository.getProjectList();
    const currentProject = list.find(p => p.id === id);

    if (!currentProject) {
      return [];
    }

    return list.filter(
      (project) =>
        project.id !== id &&
        project.category.toLowerCase() === currentProject.category.toLowerCase()
    );
  }
};
