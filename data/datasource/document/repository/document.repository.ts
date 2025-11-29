import { plainToInstance } from "class-transformer";
import { api } from "../../../../app/api/api";
import { DocumentItem } from "../../../model/document.model";
import documentMock from "../../../mockup/document.json";

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

  async createDocument(data: { title: string; category: string; file: File }): Promise<DocumentItem> {
    if (USE_MOCK) {
      return plainToInstance(DocumentItem, {
        id: Date.now().toString(),
        title: data.title,
        category: data.category,
        fileUrl: URL.createObjectURL(data.file),
        fileName: data.file.name,
        fileSize: `${(data.file.size / 1024 / 1024).toFixed(2)} MB`,
        created_at: new Date(),
        updated_at: new Date(),
        content: "",
      });
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("file", data.file);

    const response = await api.post<DocumentItem>("/document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return plainToInstance(DocumentItem, response.data);
  },

  async updateDocument(
    id: string,
    data: Partial<DocumentItem> & { file?: File }
  ): Promise<DocumentItem> {
    if (USE_MOCK) {
      return plainToInstance(DocumentItem, {
        id,
        title: data.title || "Mock doc",
        category: data.category || "Quy định",
        fileUrl: data.file ? URL.createObjectURL(data.file) : undefined,
        fileName: data.file?.name,
        fileSize: data.file ? `${(data.file.size / 1024 / 1024).toFixed(2)} MB` : "1 MB",
        created_at: new Date(),
        updated_at: new Date(),
        content: data.content || "",
      });
    }

    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.category) formData.append("category", data.category);
    if (data.file) formData.append("file", data.file);

    const response = await api.put<DocumentItem>(`/document/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return plainToInstance(DocumentItem, response.data);
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return { success: true };
    await api.delete(`/document/${id}`);
    return { success: true };
  },
};
