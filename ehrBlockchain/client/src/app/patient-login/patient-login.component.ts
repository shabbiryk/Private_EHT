import { Router } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { Patient } from '../classes/patient';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.css']
})
export class PatientLoginComponent implements OnInit {

  private patient = new Patient();

  constructor(  private patientService : PatientService,
                private router : Router, private alertService:AlertService,
                private spinner: NgxSpinnerService ) { }

  form = new FormGroup({
    patientId : new FormControl('',Validators.required),
  });

  ngOnInit() {
  }
  startSpin() {
    this.spinner.show();
  }

  login(patientInformation){
    this.patient.patientId = this.PatientId.value;

    this.patientService.checkPatient(this.patient).subscribe((data)=>{
      if(!data.action){
        this.spinner.hide();
        this.alertService.error(data.message);
      }
      else{
        this.spinner.hide();
        localStorage.setItem('p_patientId',this.patient.patientId)
        this.router.navigate(['/patientChoice/']);
      }
    })
  }
  get PatientId(){
    return this.form.get('patientId');
  }

  get Password(){
    return this.form.get('password');
  }

}
