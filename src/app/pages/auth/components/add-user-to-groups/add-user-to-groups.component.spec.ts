import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToGroupsComponent } from './add-user-to-groups.component';

describe('AddUserToGroupsComponent', () => {
  let component: AddUserToGroupsComponent;
  let fixture: ComponentFixture<AddUserToGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUserToGroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserToGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
