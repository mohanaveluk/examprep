import { TestBed } from '@angular/core/testing';

import { ExamlistService } from './examlist.service';

describe('ExamlistService', () => {
  let service: ExamlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
