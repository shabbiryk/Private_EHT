import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.css']
})
export class DoctorHomeComponent implements OnInit {

  isLoggedIn: boolean;
  patientList: string[];
  doctorId="";
  
  constructor( private doctorService : DoctorService,
               private spinner : NgxSpinnerService,
               private router : Router,
               private alertService:AlertService ) { 
  }

  ngOnInit() {
    
    this.isLoggedIn = this.doctorService.isLoggedIn();
    this.getPatientsAlignedToDoctor()
    this.patientList=[];
    this.doctorId=localStorage.getItem('doctorId');
  }

  getPatientsAlignedToDoctor(){
    let doctorId=localStorage.getItem('doctorId');
    this.doctorService.getPatientsAlignedToDoctor(doctorId).subscribe((data)=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
        let newObj=JSON.parse(data.message);
          newObj.forEach(r=>{
            this.patientList.push(r)
          })
          console.log("random shit ",this.patientList);
          localStorage.setItem("patientList",JSON.stringify(this.patientList));
      }
    });
  }

  startSpin1(){
      
      this.spinner.show();
      setTimeout(() => {
        //spinner ends after 2 seconds 
          this.spinner.hide();
          this.router.navigate(['/patientOnboarding/']);
        }, 1000);               
  }
  startSpin2(){
      
    this.spinner.show();
    setTimeout(() => {
      //spinner ends after 2 seconds 
        this.spinner.hide();
        this.router.navigate(['/patientConsent/0']);
      }, 1000);               
}


  logout(){   
    
    this.doctorService.logout();
    this.spinner.show();
    setTimeout(() => {
      //spinner ends after 2 seconds 
        this.spinner.hide();
      }, 1000);              
    
  }

}
