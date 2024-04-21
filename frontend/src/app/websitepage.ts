import {Website} from "./website";

export interface WebsitePage {
  _id: string;
  website: Website;
  url: string;
  lastEvalDate?: Date;
  pageState: string;
}
