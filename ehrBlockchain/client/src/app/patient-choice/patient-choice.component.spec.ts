import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientChoiceComponent } from './patient-choice.component';

describe('PatientChoiceComponent', () => {
  let component: PatientChoiceComponent;
  let fixture: ComponentFixture<PatientChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
