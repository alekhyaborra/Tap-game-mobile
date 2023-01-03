import { TestBed } from '@angular/core/testing';

import { AttachmentServiceService } from './attachment-service.service';

describe('AttachmentServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttachmentServiceService = TestBed.get(AttachmentServiceService);
    expect(service).toBeTruthy();
  });
});
