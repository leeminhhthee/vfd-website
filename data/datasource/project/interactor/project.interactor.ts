import { projectRepository } from "../repository/project.repository";

export const projectInteractor = {
  async getProjectList() {
    const list = await projectRepository.getProjectList();
    return list;
  },
};
