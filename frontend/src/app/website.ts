import {WebsitePage} from "./websitepage";

export interface Website {
  _id: string;
  url: string;
  registerDate: Date;
  lastEvalDate?: Date;
  monitorState: string;
  webpages: WebsitePage[];
}
