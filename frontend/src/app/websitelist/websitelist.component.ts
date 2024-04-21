import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Website } from '../website';
import {WebsiteService} from "../website.service";
import {MessageService} from "../message.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-websitelist',
  templateUrl: './websitelist.component.html',
  styleUrls: ['./websitelist.component.css']
})
export class WebsiteListComponent implements OnInit {
  websites: MatTableDataSource<Website> = new MatTableDataSource<Website>();
  displayedColumns: string[] = ['url', 'registerDate', 'lastEvalDate', 'monitorState', 'webpages'];
  color = '#673AB7';
  text_color = '#FFFFFF';

  constructor(private ws: WebsiteService, private ms: MessageService, private router: Router) { }

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngOnInit() {
    this.ws.getWebsites().subscribe(websitesData => {
      this.websites = new MatTableDataSource(websitesData);
      this.websites.sort = this.sort;
    });
  }

  // ngAfterViewInit() {
  //   this.websites.sort = this.sort;
  // }

  applyFilter(filterValue: string) {
    this.websites.filter = filterValue.trim()
  }

  resetFilter() {
    //select.value = '';
    this.websites.filter = '';
  }

  navigateToDetails(website: Website) {
    this.router.navigate(['/websitelist', website._id]);
  }

}
