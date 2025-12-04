import { Expose } from "class-transformer";
import "reflect-metadata";
import { RegistrationStatus } from "../constants/constants";

export class RegistrationItem {
    @Expose({ name: 'id' })
    id!: number;
    @Expose({ name: 'team_name' })
    teamName!: string;
    @Expose({ name: 'tournament_id' })
    tournament!: string;
    @Expose({ name: 'contact_name' })
    contactName!: string;
    @Expose({ name: 'contact_email' })
    email!: string;
    @Expose({ name: 'contact_phone' })
    phone!: string;
    @Expose({ name: 'organization' })
    organization!: string;
    @Expose({ name: 'leader' })
    leader!: string;
    @Expose({ name: 'coach' })
    coach!: string;
    @Expose({ name: 'num_players' })
    players!: number;
    @Expose({ name: 'registration_date' })
    date!: string;
    @Expose({ name: 'status' })
    status!: RegistrationStatus;
    @Expose({ name: 'document_url' })
    documentUrl?: string;
    @Expose({ name: 'created_at' })
    createdAt?: Date;
    @Expose({ name: 'updated_at' })
    updatedAt?: Date | null;
}
