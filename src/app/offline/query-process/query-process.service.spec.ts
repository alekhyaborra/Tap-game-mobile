import { TestBed } from '@angular/core/testing';

import { QueryProcessService } from './query-process.service';

describe('QueryProcessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryProcessService = TestBed.get(QueryProcessService);
    expect(service).toBeTruthy();
  });
});
