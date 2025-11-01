import documentMock from "../../../mockup/document.json";
import { DocumentItem } from "../../../model/document.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const documentRepository = {
  async getDocumentList(): Promise<DocumentItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return documentMock.map(item => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    }

    const response = await api.get<DocumentItem[]>("/document");
    return response.data.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  },
};
