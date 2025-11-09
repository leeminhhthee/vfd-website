import { homeRepository } from "../repository/home.repository";

export const homeInteractor = {
  async getHeroList() {
    const heroes = await homeRepository.getHeroes();
    // Có thể thêm logic xử lý ở đây, ví dụ:
    // return heroes.filter(h => h.id !== 0);
    return heroes;
  },
};
