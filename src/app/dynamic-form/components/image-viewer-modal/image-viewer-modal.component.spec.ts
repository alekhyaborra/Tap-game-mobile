import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewerModalPage } from './image-viewer-modal.page';

describe('ImageViewerModalPage', () => {
  let component: ImageViewerModalPage;
  let fixture: ComponentFixture<ImageViewerModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageViewerModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewerModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
