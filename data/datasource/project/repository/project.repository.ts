import projectMock from "../../../mockup/project.json";
import { ProjectItem } from "../../../model/project.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const projectRepository = {
  async getProjectList(): Promise<ProjectItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return projectMock;
    }

    const response = await api.get<ProjectItem[]>("/project");
    return response.data;
  },
};
