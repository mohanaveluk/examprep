import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewDialogComponent } from './user-view-dialog.component';

describe('UserViewDialogComponent', () => {
  let component: UserViewDialogComponent;
  let fixture: ComponentFixture<UserViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
