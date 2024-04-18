import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-websiteadd',
  templateUrl: './websiteadd.component.html',
  styleUrls: ['./websiteadd.component.css'],
})
export class WebsiteAddComponent implements OnInit {
  websiteForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, /*private websiteService: WebsiteService,*/ private router: Router) { }

  ngOnInit(): void {
    this.websiteForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern('^((http|https)://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?$')]]
    });
  }

  addWebsite(): void {
    // if (this.websiteForm.valid) {
    //   const url = this.websiteForm.value.url.trim();
    //   this.websiteService.addWebsite(url).subscribe(() => {
    //     this.router.navigate(['/website/list']);
    //   });
    // }
  }
}
