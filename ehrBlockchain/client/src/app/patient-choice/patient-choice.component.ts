import { Router } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { Patient } from '../classes/patient';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-patient-choice',
  templateUrl: './patient-choice.component.html',
  styleUrls: ['./patient-choice.component.css']
})
export class PatientChoiceComponent implements OnInit {

  constructor(private patientService : PatientService,
    private router : Router, private alertService:AlertService,
    private spinner: NgxSpinnerService) { }

  form = new FormGroup({
    password : new FormControl('',Validators.required),
    otp : new FormControl('',Validators.required),
  });

  otpRecieved:boolean;

  ngOnInit(): void {
    this.otpRecieved=false;
  }

  generateOtp(){
    this.spinner.show();
    let patientId=localStorage.getItem('p_patientId');
    this.patientService.generateOtp(patientId).subscribe((data)=>{
      if(!data.action){     
        this.spinner.hide();   
        this.alertService.error(data.message);
      }else{
        this.spinner.hide();
        this.otpRecieved=true;
      }
    });
  }

  login() {
    this.spinner.show();
    let patientId=localStorage.getItem('p_patientId');
    let password=this.form.get('password').value;
    let newObj={"patientId":patientId,"password":password};
    this.patientService.checkPatientPassword(JSON.stringify(newObj)).subscribe((data)=>{
      if(!data.action){
        this.spinner.hide();
        this.alertService.error(data.message);
      }else{
        this.spinner.hide();
        localStorage.setItem("patient_token",data.token);
        this.router.navigate(['/patientHome/'+patientId]);                
      }
    })

  }

  checkOtp(){
    let otp=this.form.get('otp').value;
    let patientId=localStorage.getItem('p_patientId');
    let newObj={"otp":otp,"patientId":patientId};
    console.log("new obj : ",newObj);
    this.patientService.checkOtp(JSON.stringify(newObj)).subscribe((data)=>{
      if(!data.action){
        this.spinner.hide();
        this.alertService.error(data.message);
      }else{
        this.spinner.hide();
        localStorage.setItem("patient_token",data.token);
        this.router.navigate(['/patientHome/'+patientId]);    
        this.alertService.success("Logged in successfully !!!");
      }
    })

  }

}
