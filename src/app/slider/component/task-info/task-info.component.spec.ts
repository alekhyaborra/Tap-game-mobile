import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskInfoPage } from './task-info.page';

describe('TaskInfoPage', () => {
  let component: TaskInfoPage;
  let fixture: ComponentFixture<TaskInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
