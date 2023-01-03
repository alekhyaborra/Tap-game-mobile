import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTextAreaPage } from './form-text-area.page';

describe('FormTextAreaPage', () => {
  let component: FormTextAreaPage;
  let fixture: ComponentFixture<FormTextAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTextAreaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTextAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
