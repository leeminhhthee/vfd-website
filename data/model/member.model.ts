import { Expose } from "class-transformer";
import { MemberLevel, MemberRole, MemberStatus } from "../constants/constants";

export class MemberItem {
    @Expose({ name: "id" })
    id!: number;
    @Expose({ name: "name" })
    name!: string;
    @Expose({ name: "birthday" })
    birthday!: Date;
    @Expose({ name: "address" })
    address!: string;
    @Expose({ name: "email" })
    email!: string;
    @Expose({ name: "phone" })
    phone!: string;
    @Expose({ name: "level" })
    level!: MemberLevel;
    @Expose({ name: "education" })
    education!: string;
    @Expose({ name: "role" })
    role!: MemberRole;
    @Expose({ name: "status" })
    status!: MemberStatus;
    @Expose({ name: "accumulated_points" })
    accumulatedPoints!: number;
    @Expose({ name: "joined_at" })
    joinedAt!: Date;
}