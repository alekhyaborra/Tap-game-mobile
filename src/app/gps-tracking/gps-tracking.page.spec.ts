import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsTrackingPage } from './gps-tracking.page';

describe('GpsTrackingPage', () => {
  let component: GpsTrackingPage;
  let fixture: ComponentFixture<GpsTrackingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpsTrackingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsTrackingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
