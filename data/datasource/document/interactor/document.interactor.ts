import { documentRepository } from "../repository/document.repository";

export const documentInteractor = {
  async getDocumentList() {
    const list = await documentRepository.getDocumentList();
    return list;
  },
};
