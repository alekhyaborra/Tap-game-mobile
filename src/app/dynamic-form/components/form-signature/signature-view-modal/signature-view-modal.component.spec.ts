import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureViewModalPage } from './signature-view-modal.page';

describe('SignatureViewModalPage', () => {
  let component: SignatureViewModalPage;
  let fixture: ComponentFixture<SignatureViewModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureViewModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureViewModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
