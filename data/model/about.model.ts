import { Expose, Type } from "class-transformer";
import "reflect-metadata";


export class IntroductionItem {
    @Expose({ name: 'title' })
    title!: string;
    @Expose({ name: 'description' })
    description!: string;
}

export class AffectedObjectItem {
    @Expose({ name: 'id' })
    id!: number;
    @Expose({ name: 'title' })
    title!: string;
    @Expose({ name: 'description' })
    description!: string;
    @Expose({ name: 'image_url' })
    imageUrl!: string;
}

export class BoardDirectorItem {
    @Expose({ name: 'id' })
    id!: number;
    @Expose({ name: 'name' })
    name!: string;
    @Expose({ name: 'role' })
    role!: string;
    @Expose({ name: 'note' })
    note!: string | null;
    @Expose({ name: 'term' })
    term!: string;
    @Expose({ name: 'image' })
    imageUrl!: string;
    @Expose({ name: 'bio' })
    bio!: string[];
}

export class BankQrItem {
    @Expose({ name: 'id' })
    id!: number;
    @Expose({ name: 'accountNumber' })
    accountNumber!: string;
    @Expose({ name: 'fullName' })
    fullName!: string;
    @Expose({ name: 'imageUrl' })
    imageUrl!: string;
    @Expose({ name: 'bankName' })
    bankName!: string;
    @Expose({ name: 'branch' })
    branch!: string;
    @Expose({ name: 'createdAt' })
    createdAt!: Date;
    @Expose({ name: 'updatedAt' })
    updatedAt!: Date;
}

export class AboutModel {
    @Expose({ name: 'introduction' })
    @Type(() => IntroductionItem)
    introduction!: IntroductionItem[];
    @Expose({ name: 'affected_object' })
    @Type(() => AffectedObjectItem)
    affectedObject!: AffectedObjectItem[];
    @Expose({ name: 'board_directors' })
    @Type(() => BoardDirectorItem)
    boardDirectors!: BoardDirectorItem[];
    @Expose({ name: 'bank_qrs' })
    @Type(() => BankQrItem)
    bankQr!: BankQrItem[];
}