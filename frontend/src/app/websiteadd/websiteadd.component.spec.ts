import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteaddComponent } from './websiteadd.component';

describe('WebsiteaddComponent', () => {
  let component: WebsiteaddComponent;
  let fixture: ComponentFixture<WebsiteaddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsiteaddComponent]
    });
    fixture = TestBed.createComponent(WebsiteaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
