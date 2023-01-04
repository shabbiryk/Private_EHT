import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-choose-chat',
  templateUrl: './choose-chat.component.html',
  styleUrls: ['./choose-chat.component.css']
})
export class ChooseChatComponent implements OnInit {

  constructor(private doctorService:DoctorService,private alertService:AlertService) { }

  patientList:any;

  ngOnInit(): void {
    this.patientList=[];
    this.getPatientsAlignedToDoctor();
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
      }
    });
  }

}
