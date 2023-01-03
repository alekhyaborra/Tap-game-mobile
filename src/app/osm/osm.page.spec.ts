import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsmPage } from './osm.page';

describe('OsmPage', () => {
  let component: OsmPage;
  let fixture: ComponentFixture<OsmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
