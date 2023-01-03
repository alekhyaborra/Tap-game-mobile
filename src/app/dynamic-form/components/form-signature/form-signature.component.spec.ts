import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSignaturePage } from './form-signature.page';

describe('FormSignaturePage', () => {
  let component: FormSignaturePage;
  let fixture: ComponentFixture<FormSignaturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSignaturePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSignaturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
