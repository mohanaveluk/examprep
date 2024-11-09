import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryDashboardComponent } from './inquiry-dashboard.component';

describe('InquiryDashboardComponent', () => {
  let component: InquiryDashboardComponent;
  let fixture: ComponentFixture<InquiryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InquiryDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InquiryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
