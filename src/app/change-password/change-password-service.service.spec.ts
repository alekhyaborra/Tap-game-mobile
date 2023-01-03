import { TestBed } from '@angular/core/testing';

import { ChangePasswordServiceService } from './change-password-service.service';

describe('ChangePasswordServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangePasswordServiceService = TestBed.get(ChangePasswordServiceService);
    expect(service).toBeTruthy();
  });
});
