import "reflect-metadata";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";
import { ScheduleStatus } from "../constants/constants";

export class TournamentItem {
  @Expose({ name: "id" })
  id!: number;
  @Expose({ name: "name" })
  name!: string;
  @Expose({ name: "description" })
  description!: string;
  @Expose({ name: "start_date" })
  startDate!: string;
  @Expose({ name: "end_date" })
  endDate!: string;
  @Expose({ name: "location" })
  location!: string;
  @Expose({ name: "teams" })
  teams!: number;
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

  constructor() {
    if (this.description == null) {
      this.description = "";
    }
    if (typeof this.teams !== "number") {
      this.teams = 0;
    }
  }
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
