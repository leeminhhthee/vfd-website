export enum ScheduleStatus {
  COMING = "coming",
  ONGOING = "ongoing",
  ENDED = "ended"
}

export enum Round {
  GROUP_STAGE = "group_stage",
  ROUND_OF_16 = "round_of_16",
  QUARTER_FINAL = "quarter_final",
  SEMI_FINAL = "semi_final",
  FINAL = "final"
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
  [Round.FINAL]: "Chung Kết"
}

export const getScheduleStatusLabel = (status: ScheduleStatus): string => {
  return ScheduleStatusLabels[status]
}

export const getRoundLabel = (round: string): string => {
  return RoundLabels[round as Round] || round
}