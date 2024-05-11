import {WebsitePage} from "./websitepage";

export interface Website {
  _id: string;
  url: string;
  registerDate: Date;
  lastEvalDate?: Date;
  monitorState: string;
  webpages: WebsitePage[];
  nPagesWithoutErrors: number;
  pPagesWithoutErrors: number;
  nPagesWithErrors: number;
  pPagesWithErrors: number;
  nPagesWithAError: number;
  pPagesWithAError: number;
  nPagesWithAAError: number;
  pPagesWithAAError: number;
  nPagesWithAAAError: number;
  pPagesWithAAAError: number;
  top10Errors: Array<{key: string, value: number}>;
}
