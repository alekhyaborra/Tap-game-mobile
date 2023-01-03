import { TestBed } from '@angular/core/testing';

import { FormDataDistributionService } from './form-data-distribution.service';

describe('FormDataDistributionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormDataDistributionService = TestBed.get(FormDataDistributionService);
    expect(service).toBeTruthy();
  });
});
