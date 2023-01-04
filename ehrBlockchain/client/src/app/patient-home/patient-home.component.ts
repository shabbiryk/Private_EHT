import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { Patient } from '../classes/patient';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Ehr } from '../classes/ehr';
import {Doctor} from '../classes/Doctor';

export interface doctor{
  doctorId:string;
  firstName:string;
  lastName:string;
  password:string;
  patientList:string;
};

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.css']
})

export class PatientHomeComponent implements OnInit {

  noPassword:boolean=true;
  patientId: string;
  records:Ehr[];
  show: boolean[];
  showDoctorBool: boolean[];
  doctorArr:string[];
  doctorDetailsList:doctor[];
  isHistoryActive : boolean = true;
  isMyDoctorsActive : boolean = false;

  constructor(  private patientService : PatientService,
                private router : Router, 
                private alertService:AlertService,
                private spinner: NgxSpinnerService) { }

  form = new FormGroup({
    password : new FormControl('',Validators.required),
  });


  ngOnInit() {
    this.patientId = localStorage.getItem("p_patientId");
    this.hasPassword();
    this.getHistoryForPatient();
    // this.getDoctorDetails();
    this.doctorDetailsList=[];
    this.records = [];
    this.show = [];
    this.showDoctorBool=[];
    this.doctorArr=[];
    this.getPatientDoctorHistory();
  }

  getDoctorDetails(doctorId:string){
    
    this.patientService.getDoctor(doctorId).subscribe(data=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{

        console.log("this is the doctor list ",JSON.parse(data.message));
        this.doctorDetailsList.push(JSON.parse(data.message));
      }
    })
  }

  hasPassword(){
    let patientId=this.patientId;
    this.patientService.patientHasPassword({patientId}).subscribe((data)=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
        this.noPassword=false;
      }

    });
  }

  getHistoryForPatient(){
    let args={"patientId":this.patientId};
    this.patientService.getHistory(args).subscribe(
      res=>{
        if(!res.action){
          this.alertService.info("no consultations yet");
        }
        else{
            let arr= res.message;
            arr.forEach(r=>{
            this.records.push(r);
            this.show.push(false);
          });
          console.log("records : ",this.records);
        } 
      }
    );
  }

  getPatientDoctorHistory(){
    this.patientService.getPatientDoctorHistory().subscribe(data=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
        let arr=JSON.parse(data.message);
        arr.sort((a,b)=>{
            return -a.time.low+b.time.low;
        })
        arr.forEach(r=>{
          if(!this.doctorArr.includes(r.doctorId))
            {
            this.doctorArr.push(r.doctorId);
            this.getDoctorDetails(r.doctorId);
            this.showDoctorBool.push(false);
            }
        })
      }
    })
  }

  setPassword(){
    let patientId=this.patientId;
    let password=this.form.get('password').value;
    this.patientService.setPatientPassword({patientId,password}).subscribe((data)=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
        this.alertService.success("password set successfully");
        this.noPassword=false;
      }
    });
  }

  activateHistory(){
    this.isHistoryActive = true;
    this.isMyDoctorsActive = false;
  }

  activateMyDoctors(){
    this.isHistoryActive = false;
    this.isMyDoctorsActive = true;
    let uniqueDoctorArr=[...new Set(this.doctorArr)]
    this.doctorArr=uniqueDoctorArr;
  }

  showRecord(recordNumber){
    this.show[recordNumber]=true;
  }

  hideRecord(recordNumber){
    this.show[recordNumber]=false;
  }

  showDoctor(recordNumber){
  
    this.showDoctorBool[recordNumber]=true;
  }

  hideDoctor(recordNumber){
    this.showDoctorBool[recordNumber]=false;
  }

  logout(){
    this.patientService.logout();
  }

}
