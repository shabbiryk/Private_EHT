import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Doctor } from '../classes/Doctor';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SHA256, enc } from "crypto-js";


@Component({
  selector: 'app-doctor-login',
  templateUrl: './doctor-login.component.html',
  styleUrls: ['./doctor-login.component.css']
})

export class DoctorLoginComponent implements OnInit {

  private doctor = new Doctor();

  form = new FormGroup({
    doctorId : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required)
  });

  constructor(  private doctorService : DoctorService,
                private router : Router, private alertService:AlertService,
                private spinner :NgxSpinnerService ) { }

  ngOnInit() {
  }

  startSpin() {
    this.spinner.show();
  }

  login(){

    this.doctor.doctorId = this.form.get('doctorId').value;
    const hashedPass = SHA256(this.form.get('password').value).toString(enc.Hex);
    this.doctor.doctorPassword = hashedPass;
    if(this.doctor.doctorPassword==""){
      this.alertService.error('please enter password');return;
    }
    if(this.doctor.doctorId==""){
      this.alertService.error('please enter username');return;
    }
    this.doctorService.checkDoctor(this.doctor).subscribe((data)=>{
      if(!data.action){
        this.spinner.hide();
        this.alertService.error(data.message);
        
      }
      else{
        this.spinner.hide();
        console.log("token : ",data.token);
        localStorage.setItem('doctorId',this.doctor.doctorId);
        localStorage.setItem('token',data.token);
        this.router.navigate(['/doctorHome/'+this.doctor.doctorId]);
        this.alertService.success("Logged in successfully !!!");
      }
      

    })

  }
  get DoctorId(){
    return this.form.get("doctorId");
  }

  get Password(){
    return this.form.get("password");
  }

}
