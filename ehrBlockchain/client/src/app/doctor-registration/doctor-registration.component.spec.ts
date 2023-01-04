import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorRegistrationComponent } from './doctor-registration.component';

describe('DoctorRegistrationComponent', () => {
  let component: DoctorRegistrationComponent;
  let fixture: ComponentFixture<DoctorRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
