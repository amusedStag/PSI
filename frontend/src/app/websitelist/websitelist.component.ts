import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Website } from '../website';

@Component({
  selector: 'app-websitelist',
  templateUrl: './websitelist.component.html',
  styleUrls: ['./websitelist.component.css']
})
export class WebsiteListComponent implements OnInit, AfterViewInit {
  websites: MatTableDataSource<Website> = new MatTableDataSource<Website>();
  displayedColumns: string[] = ['url', 'registerDate', 'lastEvalDate', 'monitorState', 'webpages'];
  color = '#673AB7';
  text_color = '#FFFFFF';

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngOnInit() {
    const website1: Website = {
      _id: '1',
      url: 'https://www.example1.com',
      registerDate: new Date(),
      monitorState: 'Por avaliar',
      webpages: []
    };

    const website2: Website = {
      _id: '2',
      url: 'https://www.example2.com',
      registerDate: new Date('2020-01-01'),
      lastEvalDate: new Date('2020-02-01'),
      monitorState: 'Avaliado',
      webpages: []
    };

    website1.webpages = [
      {
        _id: '1',
        website: website1,
        url: 'https://www.example1.com/page1',
        lastEvalDate: new Date(),
        pageState: 'Conforme'
      },
      {
        _id: '2',
        website: website1,
        url: 'https://www.example1.com/page2',
        lastEvalDate: new Date(),
        pageState: 'Conforme'
      }
    ];

    website2.webpages = [
      {
        _id: '3',
        website: website2,
        url: 'https://www.example2.com/page1',
        lastEvalDate: new Date(),
        pageState: 'Não conforme'
      }
    ];

    const websitesData: Website[] = [website1, website2];

    this.websites = new MatTableDataSource(websitesData);
  }

  ngAfterViewInit() {
    this.websites.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.websites.filter = filterValue.trim()
  }

  resetFilter() {
    //select.value = '';
    this.websites.filter = '';
  }
}
