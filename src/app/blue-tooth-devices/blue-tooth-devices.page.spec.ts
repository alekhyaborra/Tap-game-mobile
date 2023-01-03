import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueToothDevicesPage } from './blue-tooth-devices.page';

describe('BlueToothDevicesPage', () => {
  let component: BlueToothDevicesPage;
  let fixture: ComponentFixture<BlueToothDevicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlueToothDevicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueToothDevicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
