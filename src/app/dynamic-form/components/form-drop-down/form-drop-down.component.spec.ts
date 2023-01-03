import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDropDownPage } from './form-drop-down.page';

describe('FormDropDownPage', () => {
  let component: FormDropDownPage;
  let fixture: ComponentFixture<FormDropDownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDropDownPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDropDownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
