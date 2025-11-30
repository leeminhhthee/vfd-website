import { MemberItem } from "@/data/model/member.model";
import { memberRepository } from "../repository/member.repository";

export const memberInteractor = {
  async getMemberList() {
    const list = await memberRepository.getMemberList();
    return list;
  },

  async getMemberDetail(id: number) {
    const member = await memberRepository.getMemberDetail(id);
    return member;
  },

  async createMember(data: Partial<MemberItem>) {
    const newMember = await memberRepository.createMember(data);
    return newMember;
  },

  async updateMember(id: number, data: Partial<MemberItem>) {
    const updatedMember = await memberRepository.updateMember(id, data);
    return updatedMember;
  },

  async deleteMember(id: number) {
    return await memberRepository.deleteMember(id);
  }
};
