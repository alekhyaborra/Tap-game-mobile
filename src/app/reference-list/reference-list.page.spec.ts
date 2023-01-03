import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceListPage } from './reference-list.page';

describe('ReferenceListPage', () => {
  let component: ReferenceListPage;
  let fixture: ComponentFixture<ReferenceListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
