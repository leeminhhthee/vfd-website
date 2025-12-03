import { LogItem } from "@/data/model/logs.model";
import { plainToInstance } from "class-transformer";
import logMock from "../../../mockup/logs.json";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

let localLogs = plainToInstance(LogItem, logMock);

console.log(localLogs)

export const logsRepository = {
  async getLogs(filters?: { actionType?: string; targetTable?: string }): Promise<LogItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));

      let filtered = [...localLogs];
      if (filters?.actionType && filters.actionType !== 'all') {
        filtered = filtered.filter(l => l.actionType === filters.actionType);
      }
      if (filters?.targetTable && filters.targetTable !== 'all') {
        filtered = filtered.filter(l => l.targetTable === filters.targetTable);
      }

      // Sort mới nhất lên đầu
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return filtered;
    }

    const response = await api.get<LogItem[]>("/logs", { params: filters });
    return plainToInstance(LogItem, response.data);
  },

  async deleteLogs(ids: number[]): Promise<boolean> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      localLogs = localLogs.filter(l => !ids.includes(l.id));
      return true;
    }
    await api.delete("/logs", { data: { ids } });
    return true;
  },

  async clearAllLogs(): Promise<boolean> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      localLogs = [];
      return true;
    }
    await api.delete("/logs/clear-all");
    return true;
  }
};
