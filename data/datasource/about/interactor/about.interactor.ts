import { aboutRepository } from "../repository/about.repository";

export const aboutInteractor = {
  async getIntroduction() {
    const list = await aboutRepository.getAboutList()
    const introduction = list.introduction;
    return introduction;
  },

  async getAffectedObject() {
    const list = await aboutRepository.getAboutList()
    const affectedObject = list.affectedObject;
    return affectedObject;
  },

  async getBoardDirectors() {
    const list = await aboutRepository.getAboutList()
    const boardDirectors = list.boardDirectors;
    return boardDirectors;
  },
};
