export interface Project {
  id: number
  title: string
  overview: string
  duration: string
  location: string
  price: string
  image: string
  category: string
}

export const PROJECTS_PER_PAGE = 6

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Dự án phát triển bóng chuyền trẻ",
    overview:
      "Chương trình phát triển tài năng bóng chuyền cho các vận động viên trẻ tuổi, tập trung vào kỹ năng cơ bản và xây dựng tinh thần đội tuyển.",
    duration: "4 - 6 tháng",
    location: "Đà Nẵng",
    price: "Miễn phí",
    image: "/project/volleyball-youth-training.jpg",
    category: "Phát triển",
  },
  {
    id: 2,
    title: "Xây dựng trung tâm đào tạo bóng chuyền",
    overview:
      "Dự án xây dựng trung tâm đào tạo chuyên nghiệp tại Đà Nẵng với đầy đủ tiện nghi hiện đại, phục vụ đội tuyển quốc gia và phát triển cơ sở hạ tầng.",
    duration: "12 - 18 tháng",
    location: "Khu công nghiệp, Đà Nẵng",
    price: "$500,000",
    image: "/project/volleyball-training-center.jpg",
    category: "Cơ sở hạ tầng",
  },
  {
    id: 3,
    title: "Chương trình trao đổi quốc tế",
    overview:
      "Hợp tác với các liên đoàn bóng chuyền quốc tế để trao đổi kinh nghiệm, nâng cao trình độ, tham dự các giải đấu quốc tế.",
    duration: "6 - 12 tháng",
    location: "Quốc tế",
    price: "$50,000",
    image: "/project/volleyball-international-exchange.jpg",
    category: "Hợp tác",
  },
  {
    id: 4,
    title: "Chương trình phát triển huấn luyện viên",
    overview:
      "Đào tạo và phát triển kỹ năng huấn luyện viên, cập nhật kiến thức huấn luyện hiện đại, lấy bằng cấp quốc tế.",
    duration: "3 - 6 tháng",
    location: "Đà Nẵng",
    price: "$15,000",
    image: "/project/volleyball-coaching-development.jpg",
    category: "Đào tạo",
  },
  {
    id: 5,
    title: "Nâng cấp cơ sở vật chất",
    overview:
      "Nâng cấp các sân tập, phòng gym, hệ thống chiếu sáng, và thiết bị đào tạo hiện đại theo tiêu chuẩn quốc tế.",
    duration: "8 - 12 tháng",
    location: "Trung tâm VFD, Đà Nẵng",
    price: "$200,000",
    image: "/project/volleyball-facility-upgrade.jpg",
    category: "Cơ sở hạ tầng",
  },
  {
    id: 6,
    title: "Chương trình phát triển cộng đồng",
    overview:
      "Khuyến khích phát triển bóng chuyền ở cấp cơ sở, hỗ trợ các câu lạc bộ địa phương, tổ chức các giải đấu sơ tuyển.",
    duration: "Liên tục",
    location: "Toàn thành phố Đà Nẵng",
    price: "$30,000/năm",
    image: "/project/volleyball-community-program.jpg",
    category: "Cộng đồng",
  },
]

export function getProjectsPaginated(page: number) {
  const start = (page - 1) * PROJECTS_PER_PAGE
  const end = start + PROJECTS_PER_PAGE
  return projectsData.slice(start, end)
}

export function getTotalPages() {
  return Math.ceil(projectsData.length / PROJECTS_PER_PAGE)
}
