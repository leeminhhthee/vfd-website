import { plainToInstance } from "class-transformer";
import { api } from "../../../../app/api/api";
import { DocumentItem } from "../../../model/document.model";

// const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_BASE = "/documents";

export const documentRepository = {
  async getDocumentList(): Promise<DocumentItem[]> {
    const response = await api.get<DocumentItem[]>(`${API_BASE}`);
    return plainToInstance(DocumentItem, response.data);
  },

  async createDocument(data: Partial<DocumentItem>): Promise<DocumentItem> {
    const response = await api.post<DocumentItem>(`${API_BASE}`, data);
    return plainToInstance(DocumentItem, response.data);
  },

  async updateDocument(
    id: string,
    data: Partial<DocumentItem>): Promise<DocumentItem> {
    const response = await api.patch<DocumentItem>(`${API_BASE}/${id}`, data);
    return plainToInstance(DocumentItem, response.data);
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    await api.delete(`${API_BASE}/${id}`);
    return { success: true };
  },
};
