export interface TournamentResult {
  id: number
  round: string
  date: string
  time: string
  teamA: string
  scoreA: number
  scoreB: number
  teamB: string
}

export interface RelatedFile {
  name: string
  url: string // Đường dẫn tới file (ví dụ: PDF, DOCX)
}

export interface Tournament {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  location: string
  status: "upcoming" | "ongoing" | "completed"
  registrationOpen: boolean
  scheduleImage?: string
  relatedFiles?: RelatedFile[] 
  results?: TournamentResult[]
}

export const tournaments: Tournament[] = [
  {
    id: 1,
    name: "Giải Vô địch Bóng chuyền TP Đà Nẵng 2025",
    description:
      "Giải vô địch bóng chuyền của thành phố Đà Nẵng với sự tham gia của các đội hàng đầu. Đây là sự kiện thể thao lớn nhất của năm với quy mô lên đến 16 đội tham dự.",
    startDate: "2025-03-15",
    endDate: "2025-03-28",
    location: "Nhà thi đấu Tiên Sơn, Đà Nẵng",
    status: "upcoming",
    registrationOpen: true,
    scheduleImage: "/schedule/volleyball-tournament-schedule.jpg",
    relatedFiles: [
        { name: "Điều lệ Giải đấu 2025", url: "/documents/dieu-le-2025.pdf" },
        { name: "Mẫu đơn đăng ký", url: "/documents/mau-don-dang-ky.docx" },
    ],
    results: [
      {
        id: 1,
        round: "Vòng loại - Bảng A",
        date: "15/03/2025",
        time: "14:00",
        teamA: "Tây Nam FC",
        scoreA: 3,
        scoreB: 1,
        teamB: "Đà Nẵng United",
      },
      {
        id: 2,
        round: "Vòng loại - Bảng A",
        date: "15/03/2025",
        time: "16:30",
        teamA: "Hải Phòng FC",
        scoreA: 2,
        scoreB: 3,
        teamB: "TP HCM Sports",
      },
    ],
  },
  {
    id: 2,
    name: "Giải Bóng chuyền Thiếu niên Đà Nẵng 2025",
    description:
      "Giải bóng chuyền dành cho các vận động viên thiếu niên, nhằm phát triển tài năng trẻ và nâng cao kỹ năng bóng chuyền.",
    startDate: "2025-04-10",
    endDate: "2025-04-18",
    location: "Trường THPT Nguyễn Hữu Thọ, Đà Nẵng",
    status: "completed",
    registrationOpen: false,
    results: [
      {
        id: 1,
        round: "Bán kết",
        date: "17/04/2025",
        time: "15:00",
        teamA: "Quân Anh",
        scoreA: 3,
        scoreB: 0,
        teamB: "Thanh Sơn",
      },
      {
        id: 2,
        round: "Chung kết",
        date: "18/04/2025",
        time: "16:00",
        teamA: "Quân Anh",
        scoreA: 3,
        scoreB: 1,
        teamB: "Hoàng Long",
      },
    ],
  },
  {
    id: 3,
    name: "Giải Bóng chuyền Nữ Đà Nẵng 2025",
    description: "Giải bóng chuyền nữ quy tụ những đội bóng mạnh nhất của thành phố Đà Nẵng và các tỉnh lân cận.",
    startDate: "2025-05-01",
    endDate: "2025-05-15",
    location: "Nhà thi đấu Tiên Sơn, Đà Nẵng",
    status: "ongoing",
    registrationOpen: false,
  },
]

export function getTournamentById(id: string | number): Tournament | undefined {
  const numericId = Number(id)
  return tournaments.find((t) => t.id === numericId)
}

export function getRelatedTournaments(currentId: string | number, limit = 3): Tournament[] {
  const numericId = Number(currentId)
  return tournaments.filter((t) => t.id !== numericId).slice(0, limit)
}
