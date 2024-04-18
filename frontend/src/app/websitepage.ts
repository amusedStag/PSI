import {Website} from "./website";

export interface WebsitePage {
  _id: string; // Optional if using MongoDB ObjectId
  website: Website; // Reference to the parent website's _id
  url: string;
  lastEvalDate?: Date;
  pageState: string;
}
