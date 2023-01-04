import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseChatComponent } from './choose-chat.component';

describe('ChooseChatComponent', () => {
  let component: ChooseChatComponent;
  let fixture: ComponentFixture<ChooseChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
