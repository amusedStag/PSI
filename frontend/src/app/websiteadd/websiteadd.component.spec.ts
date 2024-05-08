import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteAddComponent } from './websiteadd.component';

describe('WebsiteaddComponent', () => {
  let component: WebsiteAddComponent;
  let fixture: ComponentFixture<WebsiteAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsiteAddComponent]
    });
    fixture = TestBed.createComponent(WebsiteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
