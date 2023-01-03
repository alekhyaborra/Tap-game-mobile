import { TestBed } from '@angular/core/testing';

import { GpsDevicesService } from './gps-devices.service';

describe('GpsDevicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GpsDevicesService = TestBed.get(GpsDevicesService);
    expect(service).toBeTruthy();
  });
});
