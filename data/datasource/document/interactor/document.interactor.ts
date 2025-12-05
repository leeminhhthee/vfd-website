import { DocumentItem } from "../../../model/document.model";
import { documentRepository } from "../repository/document.repository";

export const documentInteractor = {
  async getDocumentsList(): Promise<DocumentItem[]> {
    const documents = await documentRepository.getDocumentList();
    return documents
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  },

  async createDocument(data: Partial<DocumentItem>): Promise<DocumentItem> {
    return documentRepository.createDocument(data);
  },

  async updateDocument(
    id: string,
    data: Partial<DocumentItem>
  ): Promise<DocumentItem> {
    return documentRepository.updateDocument(id, data);
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    return documentRepository.deleteDocument(id);
  },
};
