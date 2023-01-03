import { TestBed } from '@angular/core/testing';

import { GpsTrackerService } from './gps-tracker.service';

describe('GpsTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GpsTrackerService = TestBed.get(GpsTrackerService);
    expect(service).toBeTruthy();
  });
});
