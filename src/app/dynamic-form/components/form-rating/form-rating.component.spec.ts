import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRatingPage } from './form-rating.page';

describe('FormRatingPage', () => {
  let component: FormRatingPage;
  let fixture: ComponentFixture<FormRatingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRatingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRatingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
