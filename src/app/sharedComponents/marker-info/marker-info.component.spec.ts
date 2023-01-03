import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerInfoPage } from './marker-info.page';

describe('MarkerInfoPage', () => {
  let component: MarkerInfoPage;
  let fixture: ComponentFixture<MarkerInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
