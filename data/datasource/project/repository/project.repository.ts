import { plainToInstance } from "class-transformer";
import projectMock from "../../../mockup/project.json";
import { ProjectItem } from "../../../model/project.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const projectRepository = {
  async getProjectList(): Promise<ProjectItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(ProjectItem, projectMock);
    }

    const response = await api.get<ProjectItem[]>("/project");
    return plainToInstance(ProjectItem, response.data);
  },

  async createProject(data: Partial<ProjectItem>) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      console.log("Mock Create Partner:", data);
      return plainToInstance(ProjectItem, { id: Date.now(), ...data });
    }
    const response = await api.post<ProjectItem>("/project", data);
    return plainToInstance(ProjectItem, response.data);
  },

  async updateProject(id: number, data: Partial<ProjectItem>) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      console.log("Mock Update Partner:", id, data);
      return plainToInstance(ProjectItem, { id, ...data });
    }
    const response = await api.put<ProjectItem>(`/project/${id}`, data);
    return plainToInstance(ProjectItem, response.data);
  },

  async deleteProject(id: number) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      console.log("Mock Delete Partner:", id);
      return { success: true };
    }
    const response = await api.delete(`/project/${id}`);
    return response.data;
  }, 
};