import {Website} from "./website";
import {Observable} from "rxjs";

export interface WebsitePage {
  _id: string;
  website: Website;
  url: string;
  lastEvalDate?: Date;
  pageState: string;
  lastEval?: Object;
  nErrorsA?: number;
  nErrorsAA?: number;
  nErrorsAAA?: number;
  errorCodes?: string[];
  nTestsPassed?: number;
  pTestsPassed?: number;
  nTestsFailed?: number;
  pTestsFailed?: number;
  nTestsWarning?: number;
  pTestsWarning?: number;
  nTestsInapplicable?: number;
  pTestsInapplicable?: number;
  tests?: {
    testName: string;
    testType: string;
    testResult: string;
    levels: string[];
    elements: {
      element: string;
      testResult: string;
    }[];
  }[];
}
