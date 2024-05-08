import {WebsitePage} from "./websitepage";

export interface Website {
  _id: string;
  url: string;
  registerDate: Date;
  lastEvalDate?: Date;
  monitorState: string;
  webpages: WebsitePage[];
  nPagesWithoutErrors: number;
  nPagesWithErrors: number;
  nPagesWithAError: number;
  nPagesWithAAError: number;
  nPagesWithAAAError: number;
  top10Errors: string[];
  // number of pages without errors
  // number of pages with each error
  // top10Errors list / map string number
}
