import { AlertService } from './../services/alert.service';
import { Patient } from './../classes/patient';
import { Router } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { User } from './../classes/user';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';  
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-patient-onboarding',
  templateUrl: './patient-onboarding.component.html',
  styleUrls: ['./patient-onboarding.component.css']
})
export class PatientOnboardingComponent implements OnInit {

  title = "forms";
  private patient = new Patient();  
  doctorId="";
  
  form = new FormGroup({
    patientFirstName : new FormControl('',Validators.required),
    patientLastName : new FormControl('',Validators.required),
    patientId : new FormControl('',Validators.required),
    emailId : new FormControl('',Validators.required),
  })

  constructor(  private patientService : PatientService,
                private router : Router,
                private alertService : AlertService,
                private spinner :  NgxSpinnerService) { }

  ngOnInit() {
    this.doctorId=localStorage.getItem('doctorId');
    
  }

  startSpin()
  {
    this.spinner.show();

  }

  checkUsername(){
    console.log('here');
    let username=this.form.get('patientId').value;
    this.patientService.checkUsernamePresence(username).subscribe((data)=>{
      console.log(data);
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
      this.alertService.info(data.message);
      }
    })
  }

  savePatient(patientInormation){
    this.patient.patientFirstName = this.form.get("patientFirstName").value;
    this.patient.patientLastName = this.form.get("patientLastName").value;
    this.patient.patientId = this.form.get("patientId").value;
    this.patient.doctorId = localStorage.getItem('doctorId');
    this.patient.emailId=this.form.get('emailId').value;

    console.log("name : "+JSON.stringify(this.patient));
    //service to send this data
    this.patientService.createPatient(this.patient).subscribe(
      data => {
        if(!data.action){
          this.spinner.hide();
          this.alertService.error(data.message);
        }
        else{
        this.patientService.addPatientToDoctorList(this.patient.patientId).subscribe(res=>{
            this.spinner.hide();
            if(!res.action){
            this.alertService.error('error in adding patient to doctor list');return;
          }
          else{
            let thisPlaceDoctor=localStorage.getItem('doctorId');
            this.router.navigate(['/doctorHome/'+thisPlaceDoctor])
            this.alertService.success("patient registered successfully !!!");
          }
        })
        
        }

      }
    )
  }

}
