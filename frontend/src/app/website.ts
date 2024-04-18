import {WebsitePage} from "./websitepage";

export interface Website {
  _id: string; // Optional if using MongoDB ObjectId
  url: string;
  registerDate: Date;
  lastEvalDate?: Date;
  monitorState: string;
  webpages: WebsitePage[];
}
