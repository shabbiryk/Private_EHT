import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-choose-patient-chat',
  templateUrl: './choose-patient-chat.component.html',
  styleUrls: ['./choose-patient-chat.component.css']
})
export class ChoosePatientChatComponent implements OnInit {

  constructor(private patientService:PatientService, private alertService:AlertService) { }

  doctorList:any;
  ngOnInit(): void {
    this.doctorList=[];
    this.getDoctorsForPatient();
  }

  getDoctorsForPatient(){
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
          if(!this.doctorList.includes(r.doctorId))
            {
            this.doctorList.push(r.doctorId);
            }
        })
      }
    })
  }



}
