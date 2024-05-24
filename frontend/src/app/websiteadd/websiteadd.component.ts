import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { MessageService } from "../message.service";
import { WebsiteService } from "../website.service";
import { Website } from "../website";
//import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-websiteadd',
  templateUrl: './websiteadd.component.html',
  styleUrls: ['./websiteadd.component.css'],
  animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class WebsiteAddComponent {
  websiteForm: FormGroup;
  successMessage: string | null = null;
  //'^((http|https)://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?$' old regex

  constructor(private formBuilder: FormBuilder, private websiteService: WebsiteService, private router: Router, private ms: MessageService) {
    this.websiteForm = this.formBuilder.group({
      //url: ['', [Validators.required, Validators.pattern('^((http|https)://)?www\\.[\\w-]+\\.[a-z]{2,}$')]]
      //url: ['', [Validators.required, Validators.pattern('^((http|https)://)?(?!www\\.)[\\w-]+\\.[a-z]{2,}(/[\\w- ;,./?%&=]*)?$')]]
      //url: ['', [Validators.required, Validators.pattern('^(http|https)://(?!www.)[a-z-]+(.[a-z-]+)+$')]]
      url: ['', [Validators.required, Validators.pattern('^(http|https):\/\/[a-z-]+(\.[a-z-]+)+$')]]
    });
  }

  addWebsite(): void {
    if (this.websiteForm.valid) {
      const url = this.websiteForm.value.url.trim();
      this.websiteService.addWebsite({ url } as Website).subscribe(() => {
        this.successMessage = 'Website added successfully';
        setTimeout(() => {
          this.router.navigate(['/websitelist']);
        }, 3000); // Navigate after 3 seconds
      });
      console.log(url);
      this.ms.add(`in addWebsite ${url}`);
      this.websiteForm.reset();

      setTimeout(() => {
        this.successMessage = null;
      } , 2000);
    }
  }
}
