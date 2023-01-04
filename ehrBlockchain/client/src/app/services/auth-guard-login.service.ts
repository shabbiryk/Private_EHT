import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DoctorService } from './doctor.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardLoginService implements CanActivate{

  constructor(  private doctorService : DoctorService, 
                private router : Router, 
                private alertService : AlertService) { }

  canActivate(){

    
    if(this.doctorService.isLoggedIn()){
      let loggedDoctorId = localStorage.getItem("doctorId");
      this.router.navigate(['/doctorHome/'+loggedDoctorId]);
      this.alertService.warn("You cannot go back to login page without logging out.");
      return false;
    }
    return true;

  }
}
