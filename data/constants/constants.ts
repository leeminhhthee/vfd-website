export enum ScheduleStatus {
  COMING = "coming",
  ONGOING = "ongoing",
  ENDED = "ended"
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

export enum NewsType {
  CITY = "city",
  NATIONAL = "national",
  INTERNATIONAL = "international"
}

export enum NewsStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  DELETE = "delete"
}

export const ScheduleStatusLabels: Record<ScheduleStatus, string> = {
  [ScheduleStatus.COMING]: "Sắp diễn ra",
  [ScheduleStatus.ONGOING]: "Đang diễn ra",
  [ScheduleStatus.ENDED]: "Đã kết thúc"
}

export const RoundLabels: Record<Round, string> = {
  [Round.GROUP_STAGE]: "Vòng Bảng",
  [Round.ROUND_OF_16]: "Vòng 1/8",
  [Round.QUARTER_FINAL]: "Vòng Tứ Kết",
  [Round.SEMI_FINAL]: "Vòng Bán Kết",
  [Round.THRID_PLACE]: "Tranh Hạng Ba",
  [Round.FINAL]: "Chung Kết"
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

export const NewsTypeLabels: Record<NewsType, string> = {
  [NewsType.CITY]: "Thành phố",
  [NewsType.NATIONAL]: "Trong nước",
  [NewsType.INTERNATIONAL]: "Quốc tế"
}

export const NewsStatusLabels: Record<NewsStatus, string> = {
  [NewsStatus.DRAFT]: "Bản nháp",
  [NewsStatus.PUBLISHED]: "Đã xuất bản",
  [NewsStatus.DELETE]: "Đã xóa"
}

export const getScheduleStatusLabel = (status: string): string => {
  return ScheduleStatusLabels[status as ScheduleStatus]
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

export const getNewsTypeLabel = (type: string): string => {
  return NewsTypeLabels[type as NewsType]
}

export const getNewsStatusLabel = (status: string): string => {
  return NewsStatusLabels[status as NewsStatus]
}