import { Injectable } from '@angular/core';
import { PatientService } from './patient.service';
import { AlertService } from './alert.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class PatientAuthGuardService implements CanActivate{

  constructor(  private patientService: PatientService,
                private router: Router,
                private alertService: AlertService  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

    console.log("ActivatedRouteSS : ", route.url.length);
    console.log("RouterStateSS : ", state.url);
    
    let stateUrl = state.url;

    if(!this.patientService.isLoggedIn()){
      this.router.navigate(['/patientLogin']);
      this.alertService.warn("Cannot access without logging in");
      return false;
    }
    else if(stateUrl.startsWith("/patientHome/")){
      let accessingPatientId = route.url[1].path;
      let loggedPatientId = localStorage.getItem("p_patientId")
      

      if(accessingPatientId != loggedPatientId)
      {
        this.router.navigate(['/patientHome/'+loggedPatientId])
        this.alertService.warn("You tried to access other patient's account. Redirecting you to the authorized account");
        return false;
      }
    }
    return true;    
  }

}
