import { DoctorService } from '../services/doctor.service';
import { AlertService } from './../services/alert.service';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-patient-consent',
  templateUrl: './patient-consent.component.html',
  styleUrls: ['./patient-consent.component.css']
})
export class PatientConsentComponent implements OnInit {

  private flag = false;
  
  public patientId: string;
  public doctorId : string;

  form = new FormGroup({
    patientId : new FormControl('',Validators.required),
    code : new FormControl('',Validators.required)
  });
  constructor(  private doctorService : DoctorService,
                private location : Location,
                private patientService : PatientService, 
                private router : Router,
                private alertService : AlertService,
                private spinner :NgxSpinnerService,
                // private rout :RouterStateSnapshot
                private rout: ActivatedRoute
                ) { }
    

  ngOnInit() {
    this.patientId=this.rout.snapshot.url[1].path;
    this.doctorId = localStorage.getItem("doctorId");
  }

  checkPatientId():number
  {
    let username=this.form.get("patientId").value;
    let patientList=JSON.parse(localStorage.getItem("patientList"));
    for(let i in patientList)
    {
      if(patientList[i]==username)
      {
        return 1;
      }
    }
    return 0;
  
  } 


  sendVerificationCodeNewPatient()
  {
    this.spinner.show();
    this.patientId = this.form.get("patientId").value;
    
    let checkVal=this.checkPatientId();
    
    if(checkVal==1)
    {
      this.alertService.error("Patient Already an old patient!");
      this.flag=false;
      localStorage.setItem("isNewPatient","false");
    }
    else if(checkVal==0)
    {
      let args={"patientId":this.patientId,"doctorId": this.doctorId}; 
      this.patientService.sendOtpToPatient(args).subscribe(data=>{
        if(!data.action){
          this.spinner.hide();
          this.alertService.error(data.message);
        }
        else{
          this.spinner.hide();
          this.flag=true;
          localStorage.setItem("isNewPatient","true");
        }
      }); 
    }
  
    
  }

  sendVerificationCode(){
    
    this.spinner.show();
    let args={"patientId": this.patientId,"doctorId": this.doctorId};
    
    console.log("this is args ",args);
    localStorage.setItem("isNewPatient","false");
    this.patientService.sendOtpToPatient(args).subscribe(data=>{
      if(!data.action){
        this.spinner.hide();
        this.alertService.error(data.message);
      }
      else{
        this.spinner.hide();
        this.flag=true;
        
      }
    });

  
}

  verifyCode(){
    
    let otp = this.form.get("code").value;
    let args = {"patientId": this.patientId,"otp":otp};
    this.spinner.show();
    this.patientService.checkOtp(JSON.stringify(args)).subscribe(
      res => {
        if(res){
          this.alertService.success("Patient consent verified successfully !!!");
          localStorage.setItem("patientId",this.patientId);
          this.patientService.addPatientToDoctorList(this.patientId).subscribe(data=>{
            if(!data.action){
              this.alertService.error(data.message)
            }
            else{
              localStorage.setItem("consentedPatient",this.patientId);
                this.patientService.updateDoctorForPatient(this.patientId).subscribe(data=>{
                  this.spinner.hide();                  
                  if(!data.action){
                    this.alertService.error(data.message)
                  }
                  else{
                    this.router.navigate([`/doctorOption/${this.doctorId}/${this.patientId}`]);
                  }
                });
            }
          })
        }
        else{
          this.spinner.hide();
          this.alertService.error('some error in obtaining otp');
        }
      }
    );
  }
  goBack(){
    this.location.back();
  }

}
