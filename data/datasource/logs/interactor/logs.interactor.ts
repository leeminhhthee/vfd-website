import { logsRepository } from "../repository/logs.repository";

export const logsInteractor = {
  async getLogs(filters?: { actionType?: string; targetTable?: string }) {
    return await logsRepository.getLogs(filters);
  },

  async deleteLogs(ids: number[]) {
    return await logsRepository.deleteLogs(ids);
  },

  async clearAllLogs() {
    return await logsRepository.clearAllLogs();
  }
};
