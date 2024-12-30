import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserGroupDialogComponent } from './update-user-group-dialog.component';

describe('UpdateUserGroupDialogComponent', () => {
  let component: UpdateUserGroupDialogComponent;
  let fixture: ComponentFixture<UpdateUserGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateUserGroupDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
