import { Expose } from "class-transformer";

export class AboutModel {
    @Expose({ name: 'introduction' })
    introduction!: IntroductionItem[];
    @Expose({ name: 'affected_object' })
    affectedObject!: AffectedObjectItem[];
    @Expose({ name: 'board_directors' })
    boardDirectors!: BoardDirectorItem[];
}

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