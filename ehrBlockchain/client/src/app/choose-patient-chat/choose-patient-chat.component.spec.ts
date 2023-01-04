import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePatientChatComponent } from './choose-patient-chat.component';

describe('ChoosePatientChatComponent', () => {
  let component: ChoosePatientChatComponent;
  let fixture: ComponentFixture<ChoosePatientChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePatientChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePatientChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
