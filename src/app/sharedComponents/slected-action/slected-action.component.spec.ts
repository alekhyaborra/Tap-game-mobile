import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlectedActionComponent } from './slected-action.component';

describe('SlectedActionPage', () => {
  let component: SlectedActionComponent;
  let fixture: ComponentFixture<SlectedActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlectedActionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlectedActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
