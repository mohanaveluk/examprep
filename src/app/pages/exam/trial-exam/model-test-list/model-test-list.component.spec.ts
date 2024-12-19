import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelTestListComponent } from './model-test-list.component';

describe('ModelTestListComponent', () => {
  let component: ModelTestListComponent;
  let fixture: ComponentFixture<ModelTestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelTestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
