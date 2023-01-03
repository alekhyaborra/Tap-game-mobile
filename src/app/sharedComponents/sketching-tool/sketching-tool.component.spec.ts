import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchingToolComponent } from './sketching-tool.component';

describe('SketchingToolComponent', () => {
  let component: SketchingToolComponent;
  let fixture: ComponentFixture<SketchingToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchingToolComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
