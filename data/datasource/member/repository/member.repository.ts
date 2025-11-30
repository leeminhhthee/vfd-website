import { plainToInstance } from "class-transformer";
import memberMock from "../../../mockup/member.json";
import { MemberItem } from "../../../model/member.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const memberRepository = {
  async getMemberList(): Promise<MemberItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(MemberItem, memberMock);
    }

    const response = await api.get<MemberItem[]>("/member");
    return plainToInstance(MemberItem, response.data);
  },

  async getMemberDetail(id: number): Promise<MemberItem> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const member = memberMock.find((m) => m.id === id);
      if (!member) throw new Error("Member not found");
      return plainToInstance(MemberItem, member);
    }

    const response = await api.get<MemberItem>(`/member/${id}`);
    return plainToInstance(MemberItem, response.data);
  },

  async createMember(data: Partial<MemberItem>): Promise<MemberItem> {
    const response = await api.post<MemberItem>("/member", data);
    return plainToInstance(MemberItem, response.data);
  },

  async updateMember(id: number, data: Partial<MemberItem>): Promise<MemberItem> {
    const response = await api.put<MemberItem>(`/member/${id}`, data);
    return plainToInstance(MemberItem, response.data);
  },

  async deleteMember(id: number): Promise<boolean> {
    await api.delete<void>(`/member/${id}`);
    return true;
  }
};
