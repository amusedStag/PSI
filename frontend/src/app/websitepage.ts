import {Website} from "./website";
import {Observable} from "rxjs";

export interface WebsitePage {
  _id: string;
  website: Website;
  url: string;
  lastEvalDate?: Date;
  pageState: string;
  lastEval?: Object;
}
