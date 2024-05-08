import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebsiteService} from "../website.service";
import {MessageService} from "../message.service";
import {Website} from "../website";
import {MatTableDataSource} from "@angular/material/table";
import {WebsitePage} from "../websitepage";
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../confirm-dialog.component";
import { Location } from "@angular/common";

@Component({
  selector: 'app-websitedetail',
  templateUrl: './websitedetail.component.html',
  styleUrls: ['./websitedetail.component.css']
})
export class WebsiteDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private ws: WebsiteService,
              private ms: MessageService, private fb: FormBuilder, private dg: MatDialog, private lc: Location) { }

  @Input() website?: Website;
  displayedColumns: string[] = ['select', 'url', 'lastEvalDate', 'pageState'];
  color = '#673AB7';
  text_color = '#FFFFFF';
  webpages: MatTableDataSource<WebsitePage> = new MatTableDataSource<WebsitePage>();
  selection = new SelectionModel<WebsitePage>(true, []);
  interval: number | undefined;

  webpageForm = this.fb.group({
    url: ['', [
      Validators.required,
      //Validators.pattern('^(http(s)?://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ;,./?%&=]*)?$'),
      Validators.pattern('^((http|https)://)?(?!www\\.)[\\w-]+\\.[a-z]{2,}(/[\\w- ;,./?%&=]*)?$'),
      this.subpageValidator()
    ]]
  });

  ngOnInit(): void {
    this.getWebsite();
    this.calculateStats(this.website as Website)
  }

  getWebsite(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.ws.getWebsite(id)
      .subscribe(website => {
        this.website = website;
        this.webpages = new MatTableDataSource(website.webpages);
      });
  }

  addWebpage(): void {
    if (this.webpageForm.valid) {
      const url = this.webpageForm.get('url')?.value?.trim();
      this.ws.updateWebsitePages({ url } as WebsitePage, this.website).subscribe(() => {
        this.ms.add('Webpage added successfully');
        this.webpageForm.reset();
        this.getWebsite();
      });
    }
  }

  subpageValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && (value === this.website?.url || value === `${this.website?.url}/` || !value.startsWith(this.website?.url))) {
        return { 'notSubpage': true };
      }
      return null;
    };
  }

  deleteSelected() {
    this.selection.selected.forEach((webpage: WebsitePage) => {
      this.ws.deleteWebsitePage(webpage._id, this.website?._id).subscribe(() => {
        this.ms.add('Webpage deleted successfully');
        this.getWebsite();
      });
    });
    this.selection.clear();
  }

  deleteWebsite(): void {
    if (this.website?._id) {
      this.ws.deleteWebsite(this.website._id).subscribe(() => {
        this.ms.add('Website deleted successfully');
        this.lc.back();
      });
    }
  }

  confirmAndDelete(): void {
    if ((this.website?.webpages.length ?? 0) > 0) {
      const dialogRef = this.dg.open(ConfirmDialogComponent, {
        data: { message: 'Are you sure you want to delete this website?' }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.deleteWebsite();
        }
      });
    } else {
      this.deleteWebsite();
    }
  }

  async evaluateSelected() {
    this.startPolling();
    const promises = this.selection.selected.map(webpage =>
      this.ws.evaluateWebsite(this.website?._id, { _id: webpage._id, url: webpage.url } as WebsitePage).toPromise()
    );
    await Promise.all(promises);
    this.stopPolling();
    this.getWebsite();
    this.calculateStats(this.website as Website);
  }

  startPolling() {
    this.interval = setInterval(() => {
      this.getWebsite();
    }, 500);
  }

  stopPolling() {
    clearInterval(this.interval);
  }

  calculateStats(website: Website) {
    website.nPagesWithoutErrors = website.webpages.filter(page => page.nErrorsA === 0 && page.nErrorsAA === 0 && page.nErrorsAAA === 0).length;
    website.nPagesWithErrors = website.webpages.length - website.nPagesWithoutErrors;
    website.nPagesWithAError = website.webpages.filter(page => page.nErrorsA !== undefined && page.nErrorsA > 0).length;
    website.nPagesWithAAError = website.webpages.filter(page => page.nErrorsAA !== undefined && page.nErrorsAA > 0).length;
    website.nPagesWithAAAError = website.webpages.filter(page => page.nErrorsAAA !== undefined && page.nErrorsAAA > 0).length;

    const errorCodes = new Map<string, number>();
    website.webpages.forEach(page => {
      if (page.errorCodes) {
        page.errorCodes.forEach(code => {
          if (errorCodes.has(code)) {
            errorCodes.set(code, errorCodes.get(code) as number + 1);
          } else {
            errorCodes.set(code, 1);
          }
        });
      }
    });

    website.top10Errors = Array.from(errorCodes).sort((a, b) => b[1] - a[1]).slice(0, 10).map(a => a[0]);
  }

}
