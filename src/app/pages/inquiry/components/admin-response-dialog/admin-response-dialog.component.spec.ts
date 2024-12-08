import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResponseDialogComponent } from './admin-response-dialog.component';

describe('AdminResponseDialogComponent', () => {
  let component: AdminResponseDialogComponent;
  let fixture: ComponentFixture<AdminResponseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminResponseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
