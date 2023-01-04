import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArCompComponent } from './ar-comp.component';

describe('ArCompComponent', () => {
  let component: ArCompComponent;
  let fixture: ComponentFixture<ArCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
