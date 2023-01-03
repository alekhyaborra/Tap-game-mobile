import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTablePage } from './form-table.page';

describe('FormTablePage', () => {
  let component: FormTablePage;
  let fixture: ComponentFixture<FormTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTablePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
