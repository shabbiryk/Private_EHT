import { Router } from '@angular/router';
import { AlertService } from './../services/alert.service';
import { DoctorService } from './../services/doctor.service';
import { Doctor } from '../classes/Doctor';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';  
import { NgxSpinnerService } from "ngx-spinner";
import { SHA256, enc } from "crypto-js";
import { windowCount } from 'rxjs/operators';


@Component({
  selector: 'app-doctor-registration',
  templateUrl: './doctor-registration.component.html',
  styleUrls: ['./doctor-registration.component.css']
})

export class DoctorRegistrationComponent implements OnInit {
  
  private doctor = new Doctor();

  form = new FormGroup({
    doctorFirstName : new FormControl('',Validators.required),
    doctorLastName : new FormControl('',Validators.required),
    doctorId : new FormControl('',Validators.required),
    doctorPassword : new FormControl('',Validators.required),
    doctorRegNumber : new FormControl('',Validators.required)
  });

  constructor(  private docotorService : DoctorService,
                private alertService : AlertService,
                private router : Router,
                private spinner: NgxSpinnerService ) { }

  ngOnInit() {
  }
  
  startSpin(){
  this.spinner.show(); 
  }


  checkUsername(){
    let username=this.form.get('doctorId').value;
    this.docotorService.checkUsernamePresence(username).subscribe((data)=>{
      console.log(data);
      if(!data.action){
        this.spinner.hide();
        this.alertService.error(data.message);
      }
      else{
        this.spinner.hide();
      this.alertService.info(data.message);
      }
    })
  }

  saveDoctor(doctorInformation){
    this.doctor.doctorFirstName = this.form.get("doctorFirstName").value;
    this.doctor.doctorLastName = this.form.get("doctorLastName").value;
    this.doctor.doctorId = this.form.get("doctorId").value;
    this.doctor.doctorPassword = this.form.get("doctorPassword").value;
    this.doctor.doctorRegNumber = this.form.get("doctorRegNumber").value;
    const hashedPass = SHA256(this.doctor.doctorPassword).toString(enc.Hex);
    this.doctor.doctorPassword = hashedPass;
    //console.log(this.doctor.doctorPassword);
    this.docotorService.createDoctor(this.doctor).subscribe(
      data => {
        if(!data.action){
          //console.log("data : ",JSON.stringify(data));
          this.spinner.hide();
          this.alertService.error(data.message);
        }
        else{
        this.spinner.hide();
        localStorage.setItem('token',data.token);
        localStorage.setItem("doctorId",this.doctor.doctorId);
        this.router.navigate(['/doctorHome/'+this.doctor.doctorId]);
        this.alertService.success("doctor registered successfully !!!");
        }

      }
    )
  }

}
