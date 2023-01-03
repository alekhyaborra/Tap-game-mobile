import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsTabPage } from './forms-tab.page';

describe('FormsTabPage', () => {
  let component: FormsTabPage;
  let fixture: ComponentFixture<FormsTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
