export enum ScheduleStatus {
  COMING = "coming",
  ONGOING = "ongoing",
  ENDED = "ended"
}

export const ScheduleStatusLabels: Record<ScheduleStatus, string> = {
  [ScheduleStatus.COMING]: "Sắp diễn ra",
  [ScheduleStatus.ONGOING]: "Đang diễn ra",
  [ScheduleStatus.ENDED]: "Đã kết thúc"
}

export const getScheduleStatusLabel = (status: ScheduleStatus): string => {
  return ScheduleStatusLabels[status]
}

export enum Round {
  GROUP_STAGE = "group_stage",
  ROUND_OF_16 = "round_of_16",
  QUARTER_FINAL = "quarter_final",
  SEMI_FINAL = "semi_final",
  FINAL = "final"
}

export const RoundLabels: Record<Round, string> = {
  [Round.GROUP_STAGE]: "Vòng Bảng",
  [Round.ROUND_OF_16]: "Vòng 1/8",
  [Round.QUARTER_FINAL]: "Vòng Tứ Kết",
  [Round.SEMI_FINAL]: "Vòng Bán Kết",
  [Round.FINAL]: "Chung Kết"
}

export const getRoundLabel = (round: string): string => {
  return RoundLabels[round as Round] || round
}

export enum NewsStatus {
  DRAFT = "draft",
  PUBLISHED = "published"
}

export const NewsStatusLabels: Record<NewsStatus, string> = {
  [NewsStatus.DRAFT]: "Bản nháp",
  [NewsStatus.PUBLISHED]: "Đã xuất bản"
}

export const getNewsStatusLabel = (status: NewsStatus): string => {
  return NewsStatusLabels[status]
}

export enum NewsType {
  CITY = "city",
  INTERNATIONAL = "international",
  NATIONAL = "national",
}

export const NewsTypeLabels: Record<NewsType, string> = {
  [NewsType.CITY]: "Thành phố",
  [NewsType.INTERNATIONAL]: "Quốc tế",
  [NewsType.NATIONAL]: "Trong nước",
}

export const getNewsTypeLabel = (type: NewsType): string => {
  return NewsTypeLabels[type]
}