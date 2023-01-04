import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PatientService } from './patient.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class PatientAuthGuardLoginService implements CanActivate{

  constructor(  private patientService: PatientService,
                private router: Router,
                private alertService: AlertService ) { }

  canActivate(){
    if(this.patientService.isLoggedIn()){
      let loggedPatientId = localStorage.getItem("p_patientId");
      this.router.navigate(['/patientHome/'+loggedPatientId]);
      this.alertService.warn("You cannot go back to login page without logging out.");
      return false;
    }
    return true;
  }
}
