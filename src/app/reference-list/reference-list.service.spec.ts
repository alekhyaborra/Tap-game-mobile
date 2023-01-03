import { TestBed } from '@angular/core/testing';

import { ReferenceListService } from './reference-list.service';

describe('ReferenceListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferenceListService = TestBed.get(ReferenceListService);
    expect(service).toBeTruthy();
  });
});
