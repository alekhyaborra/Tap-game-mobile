import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsInfoPage } from './forms-info.page';

describe('FormsInfoPage', () => {
  let component: FormsInfoPage;
  let fixture: ComponentFixture<FormsInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
