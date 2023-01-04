import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorOptionComponent } from './doctor-option.component';

describe('DoctorOptionComponent', () => {
  let component: DoctorOptionComponent;
  let fixture: ComponentFixture<DoctorOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
