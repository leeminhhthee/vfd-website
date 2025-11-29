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

export enum DocumentCategorys {
  PLAN = "plan", // Kế hoạch
  CHARTER = "charter", // Điều lệ
  REGULATIONS = "regulations", // Quy định
  FORMS = "forms", // Biểu mẫu
  OTHER = "other"
}

export enum Round {
  GROUP_STAGE = "group",
  ROUND_OF_16 = "round-of-16",
  QUARTER_FINAL = "quarter-final",
  SEMI_FINAL = "semi-final",
  THRID_PLACE = "third-place",
  FINAL = "final"
}

export enum GalleryCategory {
  INSIDE = "inside",
  TEAM = "team",
  OTHER = "other"
}

export const RoundLabels: Record<Round, string> = {
  [Round.GROUP_STAGE]: "Vòng Bảng",
  [Round.ROUND_OF_16]: "Vòng 1/8",
  [Round.QUARTER_FINAL]: "Vòng Tứ Kết",
  [Round.SEMI_FINAL]: "Vòng Bán Kết",
  [Round.THRID_PLACE]: "Tranh Hạng Ba",
  [Round.FINAL]: "Chung Kết"
}

export enum NewsStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  DELETE = "delete"
}

export const NewsStatusLabels: Record<NewsStatus, string> = {
  [NewsStatus.DRAFT]: "Bản nháp",
  [NewsStatus.PUBLISHED]: "Đã xuất bản",
  [NewsStatus.DELETE]: "Đã xóa"
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

export const DocumentCategorysLabels: Record<DocumentCategorys, string> = {
  [DocumentCategorys.PLAN]: "Kế hoạch",
  [DocumentCategorys.CHARTER]: "Điều lệ",
  [DocumentCategorys.REGULATIONS]: "Quy định",
  [DocumentCategorys.FORMS]: "Biểu mẫu",
  [DocumentCategorys.OTHER]: "Khác"
}

export const GalleryCategoryLabels: Record<GalleryCategory, string> = {
  [GalleryCategory.INSIDE]: "Giải đấu TP",
  [GalleryCategory.TEAM]: "Đội tuyển",
  [GalleryCategory.OTHER]: "Khác"
}


export const getRoundLabel = (round: string): string => {
  return RoundLabels[round as Round]
}

export const getDocumentCategoryLabel = (category: string): string => {
  return DocumentCategorysLabels[category as DocumentCategorys]
}

export const getGalleryCategoryLabel = (category: string): string => {
  return GalleryCategoryLabels[category as GalleryCategory]
}