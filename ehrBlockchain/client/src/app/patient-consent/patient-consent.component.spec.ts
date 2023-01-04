import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientConsentComponent } from './patient-consent.component';

describe('PatientConsentComponent', () => {
  let component: PatientConsentComponent;
  let fixture: ComponentFixture<PatientConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientConsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
