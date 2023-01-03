import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometryObjectFormPage } from './geometry-object-form.page';

describe('GeometryObjectFormPage', () => {
  let component: GeometryObjectFormPage;
  let fixture: ComponentFixture<GeometryObjectFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeometryObjectFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeometryObjectFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
