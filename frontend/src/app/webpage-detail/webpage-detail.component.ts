import {Component, Input, OnInit} from '@angular/core';
import {WebsiteService} from "../website.service";
import {ActivatedRoute} from "@angular/router";
import {WebsitePage} from "../websitepage";
import {Location} from "@angular/common";

@Component({
  selector: 'app-webpage-detail',
  templateUrl: './webpage-detail.component.html',
  styleUrls: ['./webpage-detail.component.css']
})
export class WebpageDetailComponent implements OnInit {

  @Input() webpage?: WebsitePage;
  originalTests?: any[];

  testTypeFilter?: string;
  testResultFilter?: string;
  conformanceLevelFilter?: string;

  constructor(private ws: WebsiteService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.getWebpage();
  }

  getWebpage(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.ws.getWebpage(id)
      .subscribe(webpage => {
        this.webpage = webpage;
        this.originalTests = [...(this.webpage?.tests ?? [])]; // copy the original list of tests
        this.calculatePercentages(this.webpage as WebsitePage);
      });
  }

  goBack(): void {
    this.location.back();
  }

  calculatePercentages(webpage: WebsitePage): void {
    //the ?? operator is used to provide a default value if the field is undefined
    const totalTests = (webpage.nTestsPassed ?? 0) + (webpage.nTestsFailed ?? 0) + (webpage.nTestsWarning ?? 0) + (webpage.nTestsInapplicable ?? 0);

    webpage.pTestsPassed = ((webpage.nTestsPassed ?? 0) / totalTests) * 100;
    webpage.pTestsFailed = ((webpage.nTestsFailed ?? 0) / totalTests) * 100;
    webpage.pTestsWarning = ((webpage.nTestsWarning ?? 0) / totalTests) * 100;
    webpage.pTestsInapplicable = ((webpage.nTestsInapplicable ?? 0) / totalTests) * 100;
  }

  applyFilters(): void {
    if (this.webpage && this.originalTests) {
      this.webpage.tests = this.originalTests.filter(test => {
        return (!this.testTypeFilter || test.testType === this.testTypeFilter) &&
          (!this.testResultFilter || test.testResult === this.testResultFilter) &&
          (!this.conformanceLevelFilter || test.levels.includes(this.conformanceLevelFilter));
      });
    }
  }
}
