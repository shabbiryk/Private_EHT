import { TestBed } from '@angular/core/testing';

import { PatientAuthGuardService } from './patient-auth-guard.service';

describe('PatientAuthGuardService', () => {
  let service: PatientAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
