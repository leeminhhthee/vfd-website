import { DocumentItem } from "../../../model/document.model";
import { documentRepository } from "../repository/document.repository";

export const documentInteractor = {
  async getDocumentsList(): Promise<DocumentItem[]> {
    return documentRepository.getDocumentList();
  },

  async createDocument(data: { title: string; category: string; file: File }): Promise<DocumentItem> {
    return documentRepository.createDocument(data);
  },

  async updateDocument(
    id: string,
    data: Partial<DocumentItem> & { file?: File }
  ): Promise<DocumentItem> {
    return documentRepository.updateDocument(id, data);
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    return documentRepository.deleteDocument(id);
  },
};
