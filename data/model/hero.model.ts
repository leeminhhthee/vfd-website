import { Expose } from "class-transformer";

export class HeroItem {
  @Expose({ name: "id" })
  id!: number;
  @Expose({ name: "image" })
  image!: string;
  @Expose({ name: "title" })
  title!: string;
  @Expose({ name: "sub_title" })
  subTitle!: string;
  @Expose({ name: "button_text" })
  buttonText!: string;
  @Expose({ name: "button_href" })
  buttonHref!: string;
  @Expose({ name: "button_text_2" })
  buttonText2?: string | null;
  @Expose({ name: "button_href_2" })
  buttonHref2?: string | null;
}
