import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { AlertService } from './alert.service';
import { DoctorOptionComponent } from '../doctor-option/doctor-option.component';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate{

  constructor(  private doctorService : DoctorService, 
                private router : Router, 
                private alertService : AlertService ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    console.log("ActivatedRouteSS : ", route.url.length);
    console.log("RouterStateSS : ", state.url);
    
    let stateUrl = state.url;

    if(!this.doctorService.isLoggedIn()){
      this.router.navigate(['/doctorLogin'])
      return false;
    }
    else if(stateUrl.startsWith("/doctorHome/")){
      let accessingDoctorId = route.url[1].path;
      let loggedDoctorId = localStorage.getItem("doctorId")
      

      if(accessingDoctorId != loggedDoctorId)
      {
        this.router.navigate(['/doctorHome/'+loggedDoctorId])
        this.alertService.warn("You tried to access unauthorized doctor's Id. Redirecting you to the authorized account");
        return false;
      }
    }
    else if(stateUrl.startsWith("/doctorOption/"))
    { 
      let accessingPatientId=route.url[2].path;
      // let fun=route.url[2].path;
      console.log("verify ",accessingPatientId);
      let loggedDoctorId = localStorage.getItem("doctorId")
      let consentedPatientId=localStorage.getItem("consentedPatient");  
      if(accessingPatientId!=consentedPatientId)
      {
        this.router.navigate(['/doctorHome/'+loggedDoctorId]);
        this.alertService.warn("Take patient's consent before moving here!");
        return false;
      }
    }
    return true;    
  }
}
