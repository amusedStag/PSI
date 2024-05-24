import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {WebsiteService} from "../website.service";
import {MessageService} from "../message.service";
import {Website} from "../website";
import {MatTableDataSource} from "@angular/material/table";
import {WebsitePage} from "../websitepage";
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from '@angular/forms';
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog.component";
import {Location} from "@angular/common";
import { descs } from '../descriptions';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-websitedetail',
  templateUrl: './websitedetail.component.html',
  styleUrls: ['./websitedetail.component.css']
})
export class WebsiteDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private ws: WebsiteService,
              private ms: MessageService, private fb: FormBuilder, private dg: MatDialog, private lc: Location, private router: Router) { }

  @Input() website?: Website;
  displayedColumns: string[] = ['select', 'url', 'lastEvalDate', 'pageState'];
  color = '#673AB7';
  text_color = '#FFFFFF';
  webpages: MatTableDataSource<WebsitePage> = new MatTableDataSource<WebsitePage>();
  selection = new SelectionModel<WebsitePage>(true, []);
  interval: number | undefined;
  hasConformeOrNonConformePages: boolean = false;
  descriptions: { [key: string]: string } = descs;

  webpageForm = this.fb.group({
    url: ['', [
      Validators.required,
      //Validators.pattern('^(http(s)?://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ;,./?%&=]*)?$'),
      //Validators.pattern('^((http|https)://)?(?!www\\.)[a-z-]+(\\.[a-z-]+)+(/.*)?$'),
      Validators.pattern('^((http|https)://)[a-z-]+(\\.[a-z-]+)+(/.*)?$'),
      this.subpageValidator()
    ]]
  });

  ngOnInit(): void {
    this.getWebsite();
  }

  getWebsite(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.ws.getWebsite(id)
      .subscribe(website => {
        this.website = website;
        this.webpages = new MatTableDataSource(website.webpages);
        this.calculateStats(this.website as Website);
        this.hasConformeOrNonConformePages = this.website.webpages.some(webpage => webpage.pageState === 'Conforme' || webpage.pageState === 'Não conforme');
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

  // async evaluateSelected() {
  //   this.startPolling();
  //   const promises = this.selection.selected.map(webpage =>
  //     this.ws.evaluateWebsite(this.website?._id, { _id: webpage._id, url: webpage.url } as WebsitePage)
  //       .toPromise()
  //       .catch(error => {
  //         console.error(`Error evaluating webpage ${webpage.url}:`, error);
  //       })
  //   );
  //   try {
  //     await Promise.all(promises);
  //     this.getWebsite();
  //     this.calculateStats(this.website as Website);
  //   } catch (error) {
  //     console.error('Error during evaluation:', error);
  //   } finally {
  //     this.stopPolling();
  //   }
  // }
  async evaluateSelected() {
    this.startPolling();
    for (const webpage of this.selection.selected) {
      try {
        await this.ws.evaluateWebsite(this.website?._id, { _id: webpage._id, url: webpage.url } as WebsitePage).toPromise();
      } catch (error) {
        console.error(`Error evaluating webpage ${webpage.url}:`, error);
        //this.stopPolling();
      }
    }
    this.getWebsite();
    this.calculateStats(this.website as Website); //might be useless as its already in getWebsite
    this.stopPolling();
    this.selection.clear();
  }

  startPolling() {
    this.interval = setInterval(() => {
      this.getWebsite();
    }, 1000);
  }

  stopPolling() {
    clearInterval(this.interval);
  }

  calculateStats(website: Website) {
    const evaluatedWebpages = website.webpages.filter(page => page.pageState === 'Conforme' || page.pageState === 'Não conforme');
    const totalEvaluatedPages = evaluatedWebpages.length;

    website.nPagesWithoutErrors = evaluatedWebpages.filter(page => page.nErrorsA === 0 && page.nErrorsAA === 0 && page.nErrorsAAA === 0).length;
    website.nPagesWithErrors = evaluatedWebpages.length - website.nPagesWithoutErrors;
    website.nPagesWithAError = evaluatedWebpages.filter(page => page.nErrorsA !== undefined && page.nErrorsA > 0).length;
    website.nPagesWithAAError = evaluatedWebpages.filter(page => page.nErrorsAA !== undefined && page.nErrorsAA > 0).length;
    website.nPagesWithAAAError = evaluatedWebpages.filter(page => page.nErrorsAAA !== undefined && page.nErrorsAAA > 0).length;

    website.pPagesWithoutErrors = (website.nPagesWithoutErrors / totalEvaluatedPages) * 100;
    website.pPagesWithErrors = (website.nPagesWithErrors / totalEvaluatedPages) * 100;
    website.pPagesWithAError = (website.nPagesWithAError / totalEvaluatedPages) * 100;
    website.pPagesWithAAError = (website.nPagesWithAAError / totalEvaluatedPages) * 100;
    website.pPagesWithAAAError = (website.nPagesWithAAAError / totalEvaluatedPages) * 100;

    const errors = new Map<string, number>();
    evaluatedWebpages.forEach(page => {
      if (page.errorCodes) {
        page.errorCodes.forEach(code => {
          if (errors.has(code)) {
            errors.set(code, errors.get(code) as number + 1);
          } else {
            errors.set(code, 1);
          }
        });
      }
    });
    // const top10Errors = new Map<string, number>();
    // Array.from(errors.entries())
    //   .sort((a, b) => b[1] - a[1])
    //   .slice(0, 10)
    //   .forEach(([code, frequency]) => top10Errors.set(code, frequency));
    //
    // website.top10Errors = top10Errors;
    website.top10Errors = Array.from(errors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key, value]) => ({key, value, desc: this.getDescription(key)}));
  }

  getDescription(key: string): string {
    return this.descriptions[key];
  }

  navigateToDetails(webpage: WebsitePage) {
    this.router.navigate(['/webpagedetail', webpage._id]);
  }

  generatePDF(): void {
    const data = document.getElementById('stats');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 320;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'mm', 'a4');
        pdf.text('URL: ' + this.website?.url, 10, 10);
        pdf.text('Last Evaluation Date: ' + (this.website?.lastEvalDate ? new Date(this.website?.lastEvalDate).toLocaleDateString() : 'Not evaluated yet'), 10, 20);
        pdf.addImage(contentDataURL, 'PNG', 0, 30, imgWidth, imgHeight);
        const filename = this.website?.url + '-statistics.pdf';
        pdf.save(filename);
      });
    } else {
      console.error('Element with id "stats" not found');
    }
  }
}
