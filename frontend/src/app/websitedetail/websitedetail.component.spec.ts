import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitedetailComponent } from './websitedetail.component';

describe('WebsitedetailComponent', () => {
  let component: WebsitedetailComponent;
  let fixture: ComponentFixture<WebsitedetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsitedetailComponent]
    });
    fixture = TestBed.createComponent(WebsitedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
