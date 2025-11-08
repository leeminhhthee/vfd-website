import { AffectedObjectItem, BoardDirectorItem, IntroductionItem } from "@/data/model/about.model";
import { plainToInstance } from "class-transformer";
import { aboutRepository } from "../repository/about.repository";

export const aboutInteractor = {
  async getIntroduction() {
    const list = await aboutRepository.getAboutList()
    const introduction = plainToInstance(IntroductionItem,list.introduction);
    return introduction;
  },

  async getAffectedObject() {
    const list = await aboutRepository.getAboutList()
    const affectedObject = plainToInstance(AffectedObjectItem,list.affectedObject);
    return affectedObject;
  },

  async getBoardDirectors() {
    const list = await aboutRepository.getAboutList()
    const boardDirectors = plainToInstance(BoardDirectorItem,list.boardDirectors);
    return boardDirectors;
  },
};
