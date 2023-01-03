import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsListPage } from './forms-list.page';

describe('FormsListPage', () => {
  let component: FormsListPage;
  let fixture: ComponentFixture<FormsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
