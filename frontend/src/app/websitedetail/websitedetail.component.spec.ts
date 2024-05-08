import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteDetailComponent } from './websitedetail.component';

describe('WebsitedetailComponent', () => {
  let component: WebsiteDetailComponent;
  let fixture: ComponentFixture<WebsiteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsiteDetailComponent]
    });
    fixture = TestBed.createComponent(WebsiteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
