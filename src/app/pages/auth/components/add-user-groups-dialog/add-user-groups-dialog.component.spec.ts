import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserGroupsDialogComponent } from './add-user-groups-dialog.component';

describe('AddUserGroupsDialogComponent', () => {
  let component: AddUserGroupsDialogComponent;
  let fixture: ComponentFixture<AddUserGroupsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUserGroupsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserGroupsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
