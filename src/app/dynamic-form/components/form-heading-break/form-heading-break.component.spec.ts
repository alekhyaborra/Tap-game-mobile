import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHeadingBreakPage } from './form-heading-break.page';

describe('FormHeadingBreakPage', () => {
  let component: FormHeadingBreakPage;
  let fixture: ComponentFixture<FormHeadingBreakPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormHeadingBreakPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHeadingBreakPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
