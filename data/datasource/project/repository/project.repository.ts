import { api } from "@/app/api/api";
import { plainToInstance } from "class-transformer";
import { ProjectItem } from "../../../model/project.model";

// const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_BASE = '/projects'

type ProjectPayload = Omit<Partial<ProjectItem>, 'bankQrCode'> & {
  bankId?: number;
};

export const projectRepository = {
  async getProjectList(): Promise<ProjectItem[]> {
    const response = await api.get<ProjectItem[]>(`${API_BASE}`);
    return plainToInstance(ProjectItem, response.data);
  },

  async createProject(data: ProjectPayload) {
    const response = await api.post<ProjectItem>(`${API_BASE}`, data);
    return plainToInstance(ProjectItem, response.data);
  },

  async updateProject(id: number, data: ProjectPayload) {
    const response = await api.patch<ProjectItem>(`${API_BASE}/${id}`, data);
    return plainToInstance(ProjectItem, response.data);
  },

  async deleteProject(id: number) {
    const response = await api.delete(`${API_BASE}/${id}`);
    return response.data;
  },

  async getProjectById(id: number) {
    const response = await api.get<ProjectItem>(`${API_BASE}/${id}`);
    return plainToInstance(ProjectItem, response.data);
  }
};