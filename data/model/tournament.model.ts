import "reflect-metadata";
import { Expose, Type } from "class-transformer";
import { ScheduleStatus } from "../constants/constants";

export class TournamentItem {
  @Expose({ name: "id" })
  id!: number;
  @Expose({ name: "name" })
  name!: string;
  @Expose({ name: "description" })
  description!: string | null;
  @Expose({ name: "start_date" })
  startDate!: Date;
  @Expose({ name: "end_date" })
  endDate!: Date;
  @Expose({ name: "location" })
  location!: string;
  @Expose({ name: "status" })
  status!: ScheduleStatus;
  @Expose({ name: "form_id" })
  formId!: string;
  @Expose({ name: "registration_open" })
  registrationOpen!: boolean;
  @Expose({ name: "schedule_img" })
  scheduleImg!: string[] | null;
  @Expose({ name: "related_files" })
  @Type(() => RelatedFile)
  relatedFiles!: RelatedFile[] | null;
  @Expose({ name: "match_schedules" })
  @Type(() => MatchSchedule)
  matchSchedules!: MatchSchedule[] | null;
  @Expose({ name: "created_at" })
  createdAt!: Date | null;
  @Expose({ name: "updated_at" })
  updatedAt!: Date | null;
  @Expose({ name: "created_by" })
  createdBy!: number;
}

export class RelatedFile {
  @Expose({ name: "name" })
  name!: string
  @Expose({ name: "doc_url" })
  docUrl!: string
}

export class MatchSchedule {
  @Expose({ name: "id" })
  id!: number
  @Expose({ name: "round" })
  round!: string
  @Expose({ name: "table" })
  table!: string | null
  @Expose({ name: "match_date" })
  @Type(() => Date)
  matchDate!: Date
  @Expose({ name: "team_A" })
  teamA!: string
  @Expose({ name: "team_B" })
  teamB!: string
  @Expose({ name: "score_A" })
  scoreA!: number | null
  @Expose({ name: "score_B" })
  scoreB!: number | null
}
