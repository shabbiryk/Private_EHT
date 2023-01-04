import { TestBed } from '@angular/core/testing';

import { AuthGuardLoginService } from './auth-guard-login.service';

describe('AuthGuardLoginService', () => {
  let service: AuthGuardLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
