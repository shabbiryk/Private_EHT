import { TestBed } from '@angular/core/testing';

import { PatientAuthGuardLoginService } from './patient-auth-guard-login.service';

describe('PatientAuthGuardLoginService', () => {
  let service: PatientAuthGuardLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientAuthGuardLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
