import { Expose } from "class-transformer";

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
  status!: string;
  @Expose({ name: "form_id" })
  formId!: string;
  @Expose({ name: "schedule_img" })
  scheduleImg!: string | null;
  @Expose({ name: "created_at" })
  createdAt!: Date | null;
  @Expose({ name: "updated_at" })
  updatedAt!: Date | null;
  @Expose({ name: "created_by" })
  createdBy!: number;
}
