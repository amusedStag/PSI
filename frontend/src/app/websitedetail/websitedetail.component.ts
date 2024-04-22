import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebsiteService} from "../website.service";
import {MessageService} from "../message.service";
import {Website} from "../website";
import {MatTableDataSource} from "@angular/material/table";
import {WebsitePage} from "../websitepage";
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-websitedetail',
  templateUrl: './websitedetail.component.html',
  styleUrls: ['./websitedetail.component.css']
})
export class WebsiteDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private ws: WebsiteService, private ms: MessageService, private fb: FormBuilder) { }

  @Input() website?: Website;
  displayedColumns: string[] = ['url', 'lastEvalDate', 'pageState'];
  color = '#673AB7';
  text_color = '#FFFFFF';
  webpages: MatTableDataSource<WebsitePage> = new MatTableDataSource<WebsitePage>();

  webpageForm = this.fb.group({
    url: ['', [
      Validators.required,
      Validators.pattern('^(http(s)?://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ;,./?%&=]*)?$'),
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
}
