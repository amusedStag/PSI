import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-websiteadd',
  templateUrl: './websiteadd.component.html',
  styleUrls: ['./websiteadd.component.css'],
})
export class WebsiteAddComponent {
  websiteForm: FormGroup;
  successMessage: string | null = null;
  //'^((http|https)://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?$' old regex

  constructor(private formBuilder: FormBuilder, /*private websiteService: WebsiteService,*/ private router: Router) {
    this.websiteForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern('^((http|https)://)?www\\.[\\w-]+\\.[a-z]{2,}$')]]
    });
  }

  addWebsite(): void {
    this.successMessage = '';
    if (this.websiteForm.valid) {
      const url = this.websiteForm.value.url.trim();
      // this.websiteService.addWebsite(url).subscribe(() => {
      //   this.router.navigate(['/website/list']);
      // });
      console.log(url);
      this.websiteForm.reset();
      this.successMessage = 'Website added successfully';
    }
  }
}
