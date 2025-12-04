export enum ScheduleStatus {
  COMING = "coming",
  ONGOING = "ongoing",
  ENDED = "ended",
  POSTPONED = "postponed",
}

export const ScheduleStatusLabels: Record<ScheduleStatus, string> = {
  [ScheduleStatus.COMING]: "Sắp diễn ra",
  [ScheduleStatus.ONGOING]: "Đang diễn ra",
  [ScheduleStatus.ENDED]: "Đã kết thúc",
  [ScheduleStatus.POSTPONED]: "Tạm hoãn"
}

export const getScheduleStatusLabel = (status: string): string => {
  return ScheduleStatusLabels[status as ScheduleStatus]
}

export enum DocumentCategorys {
  PLAN = "plan", // Kế hoạch
  CHARTER = "charter", // Điều lệ
  REGULATIONS = "regulations", // Quy định
  FORMS = "forms", // Biểu mẫu
  OTHER = "other"
}

export const DocumentCategorysLabels: Record<DocumentCategorys, string> = {
  [DocumentCategorys.PLAN]: "Kế hoạch",
  [DocumentCategorys.CHARTER]: "Điều lệ",
  [DocumentCategorys.REGULATIONS]: "Quy định",
  [DocumentCategorys.FORMS]: "Biểu mẫu",
  [DocumentCategorys.OTHER]: "Khác"
}

export const getDocumentCategoryLabel = (category: string): string => {
  return DocumentCategorysLabels[category as DocumentCategorys]
}

export enum Round {
  GROUP_STAGE = "group",
  ROUND_OF_16 = "round-of-16",
  QUARTER_FINAL = "quarter-final",
  SEMI_FINAL = "semi-final",
  THRID_PLACE = "third-place",
  FINAL = "final"
}

export const RoundLabels: Record<Round, string> = {
  [Round.GROUP_STAGE]: "Vòng Bảng",
  [Round.ROUND_OF_16]: "Vòng 1/8",
  [Round.QUARTER_FINAL]: "Vòng Tứ Kết",
  [Round.SEMI_FINAL]: "Vòng Bán Kết",
  [Round.THRID_PLACE]: "Tranh Hạng Ba",
  [Round.FINAL]: "Chung Kết"
}

export const getRoundLabel = (round: string): string => {
  return RoundLabels[round as Round]
}

export enum GalleryCategory {
  TOURNAMENT = "tournament",
  TEAM = "team",
  EVENT = "event",
  OTHER = "other"
}

export const GalleryCategoryLabels: Record<GalleryCategory, string> = {
  [GalleryCategory.TOURNAMENT]: "Giải đấu",
  [GalleryCategory.TEAM]: "Đội tuyển",
  [GalleryCategory.EVENT]: "Sự kiện",
  [GalleryCategory.OTHER]: "Khác"
}

export const getGalleryCategoryLabel = (category: string): string => {
  return GalleryCategoryLabels[category as GalleryCategory]
}

export enum NewsType {
  CITY = "city",
  NATIONAL = "national",
  INTERNATIONAL = "international"
}

export const NewsTypeLabels: Record<NewsType, string> = {
  [NewsType.CITY]: "Thành phố",
  [NewsType.NATIONAL]: "Trong nước",
  [NewsType.INTERNATIONAL]: "Quốc tế"
}

export const getNewsTypeLabel = (type: string): string => {
  return NewsTypeLabels[type as NewsType]
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

export const getNewsStatusLabel = (status: string): string => {
  return NewsStatusLabels[status as NewsStatus]
}

export enum RegistrationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export const RegistrationStatusLabels: Record<RegistrationStatus, string> = {
  [RegistrationStatus.PENDING]: "Chờ duyệt",
  [RegistrationStatus.APPROVED]: "Đã duyệt",
  [RegistrationStatus.REJECTED]: "Từ chối"
}

export const getRegistrationStatusLabel = (status: string): string => {
  return RegistrationStatusLabels[status as RegistrationStatus]
}

export enum ProjectCategory {
  SPORT_EVENT = "sport_event",
  COMMUNITY = "community",
  TRAINING = "training",
  SPONSORSHIP = "sponsorship",
  OTHER = "other"
}

export const ProjectCategoryLabels: Record<ProjectCategory, string> = {
  [ProjectCategory.SPORT_EVENT]: "Sự kiện thể thao",
  [ProjectCategory.COMMUNITY]: "Cộng đồng",
  [ProjectCategory.TRAINING]: "Đào tạo",
  [ProjectCategory.SPONSORSHIP]: "Tài trợ",
  [ProjectCategory.OTHER]: "Khác"
}

export const getProjectCategoryLabel = (category: string): string => {
  return ProjectCategoryLabels[category as ProjectCategory]
}

export enum MemberLevel {
  INTERMEDIATE = "intermediate",
  UNIVERSITY = "university",
  COLLEGE = "college",
  MASTERS_DEGREE = "masters_degree",
  PHD = "phd",
  HIGH_SCHOOL = "high_school",
  OTHER = "other"
}

export const MemberLevelLabels: Record<MemberLevel, string> = {
  [MemberLevel.INTERMEDIATE]: "Trung cấp",
  [MemberLevel.UNIVERSITY]: "Đại học",
  [MemberLevel.COLLEGE]: "Cao đẳng",
  [MemberLevel.MASTERS_DEGREE]: "Thạc sĩ",
  [MemberLevel.PHD]: "Tiến sĩ",
  [MemberLevel.HIGH_SCHOOL]: "Trung học phổ thông",
  [MemberLevel.OTHER]: "Khác"
}

export const getMemberLevelLabel = (level: string): string => {
  return MemberLevelLabels[level as MemberLevel]
}

export enum MemberStatus {
  ACTIVE = "active",
  LOCK = "lock",
}

export const MemberStatusLabels: Record<MemberStatus, string> = {
  [MemberStatus.ACTIVE]: "Hoạt động",
  [MemberStatus.LOCK]: "Khóa",
}

export const getMemberStatusLabel = (status: string): string => {
  return MemberStatusLabels[status as MemberStatus]
}

export enum MemberRole {
  ADMIN = "admin",
  MEMBER = "member",
}

export const MemberRoleLabels: Record<MemberRole, string> = {
  [MemberRole.ADMIN]: "Quản trị viên",
  [MemberRole.MEMBER]: "Thành viên",
};

export const getMemberRoleLabel = (role: string): string => {
  return MemberRoleLabels[role as MemberRole] || role;
};

export enum ActionType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LOGIN = "login",
  EXPORT = "export",
}

export const ActionTypeLabels: Record<ActionType, string> = {
  [ActionType.CREATE]: "Thêm mới",
  [ActionType.UPDATE]: "Cập nhật",
  [ActionType.DELETE]: "Xóa",
  [ActionType.LOGIN]: "Đăng nhập",
  [ActionType.EXPORT]: "Xuất dữ liệu",
};

export const getActionTypeLabel = (type: string) => ActionTypeLabels[type as ActionType] || type;

export enum TargetTable {
  MEMBERS = "members",
  TOURNAMENTS = "tournaments",
  SETTINGS = "settings",
  HERO_BANNER = "hero_banner",
  AUTH = "auth",
}

export const TargetTableLabels: Record<TargetTable, string> = {
  [TargetTable.MEMBERS]: "Thành viên",
  [TargetTable.TOURNAMENTS]: "Giải đấu",
  [TargetTable.SETTINGS]: "Cài đặt",
  [TargetTable.HERO_BANNER]: "Banner",
  [TargetTable.AUTH]: "Hệ thống",
};

export const getTargetTableLabel = (table: string) => TargetTableLabels[table as TargetTable] || table;