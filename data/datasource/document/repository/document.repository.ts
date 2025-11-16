import { plainToInstance } from 'class-transformer';
import { api } from "../../../../app/api/api";
import documentMock from "../../../mockup/document.json";
import { DocumentItem } from "../../../model/document.model";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const documentRepository = {
  async getDocumentList(): Promise<DocumentItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(DocumentItem, documentMock);
    }

    const response = await api.get<DocumentItem[]>("/document");
    return plainToInstance(DocumentItem, response.data);
  },
};
