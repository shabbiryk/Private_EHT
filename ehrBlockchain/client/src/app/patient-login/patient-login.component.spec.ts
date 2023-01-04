import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLoginComponent } from './patient-login.component';

describe('PatientLoginComponent', () => {
  let component: PatientLoginComponent;
  let fixture: ComponentFixture<PatientLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
