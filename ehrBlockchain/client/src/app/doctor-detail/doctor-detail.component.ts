import { Component, OnInit, Input } from '@angular/core';

export interface doctor{
  doctorId:string;
  firstName:string;
  lastName:string;
  password:string;
  patientList:string;
};

@Component({
  selector: 'app-doctor-detail',
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.css']
})
export class DoctorDetailComponent implements OnInit {

  @Input()
  private doctor:doctor;
  constructor() { }
  

  ngOnInit(): void {
  }

}
