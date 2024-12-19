import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInquiryOverviewComponent } from './admin-inquiry-overview.component';

describe('AdminInquiryOverviewComponent', () => {
  let component: AdminInquiryOverviewComponent;
  let fixture: ComponentFixture<AdminInquiryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminInquiryOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInquiryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
