import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientArComponent } from './client-ar.component';

describe('ClientArComponent', () => {
  let component: ClientArComponent;
  let fixture: ComponentFixture<ClientArComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientArComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
