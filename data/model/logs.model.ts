import { Expose, Type } from "class-transformer";
import "reflect-metadata";
import { ActionType, TargetTable } from "../constants/constants";

export class LogItem {
    @Expose({ name: "id" })
    id!: number;
    @Expose({ name: "action_type" })
    actionType!: ActionType;
    @Expose({ name: "target_table" })
    targetTable!: TargetTable;
    @Expose({ name: "description" })
    description!: string;
    @Expose({ name: "full_name" })
    fullName!: string;
    @Expose({ name: "created_at" })
    @Type(() => Date)
    createdAt!: Date;
}