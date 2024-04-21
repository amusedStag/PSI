import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-websitedetail',
  templateUrl: './websitedetail.component.html',
  styleUrls: ['./websitedetail.component.css']
})
export class WebsiteDetailComponent {
  id: string | null = this.route.snapshot.paramMap.get('id');
  constructor(private route: ActivatedRoute) { }

}
