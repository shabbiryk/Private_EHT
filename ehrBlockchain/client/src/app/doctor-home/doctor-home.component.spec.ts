import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorHomeComponent } from './doctor-home.component';

describe('DoctorHomeComponent', () => {
  let component: DoctorHomeComponent;
  let fixture: ComponentFixture<DoctorHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
