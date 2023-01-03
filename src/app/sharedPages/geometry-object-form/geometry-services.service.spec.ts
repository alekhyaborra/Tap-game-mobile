import { TestBed } from '@angular/core/testing';

import { GeometryServicesService } from './geometry-services.service';

describe('GeometryServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeometryServicesService = TestBed.get(GeometryServicesService);
    expect(service).toBeTruthy();
  });
});
