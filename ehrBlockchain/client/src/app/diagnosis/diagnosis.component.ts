import { AlertService } from './../services/alert.service';
import { DoctorService } from './../services/doctor.service';
import { User } from './../classes/user';
import { Utils } from './../classes/utils';
import { Symptoms } from './../classes/symptoms';
import { Ehr } from './../classes/ehr';
import { BloodTest } from './../classes/blood-test';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {

  private patientId : string;
  private doctorId : string;


  // patient data variables

  paymentMethods=['Cash','Cheque'];
  paymentDones=['Yes','No'];
  bloodTest=new BloodTest(30,30,30,30,30,30);
  symptoms=new Symptoms(true,65,true,true,80);
  utils=new Utils("2020-12-30",3000,true,"default");
  TrueValue=true;
  FalseValue=false;
  paymentMethodHasError=true;
  validatepaymentMethod(value)
  {
    if(value=== 'default')
    {
      this.paymentMethodHasError=true;
    }
    else{
      this.paymentMethodHasError=false;
    }
  }

  docReview = "";
  medicines = "";
  aop = "";

  form = new FormGroup({
    docReview : new FormControl(['']),
    medicines : new FormControl(['']),
    aop : new FormControl([''])
  });
 
  
  constructor(  private doctorService : DoctorService,
                private alertService : AlertService,
                private spinner: NgxSpinnerService ) { }

  ngOnInit() {
    this.patientId = localStorage.getItem("patientId");
    this.doctorId = localStorage.getItem("doctorId");
  }

  startSpin(){
    this.spinner.show(); 
    this.recordData();
    }
  recordData(){
    this.docReview = this.form.get("docReview").value;
    this.medicines = this.form.get("medicines").value;
    this.aop = this.form.get("aop").value;

    let ehr=new Ehr(
      this.doctorId,
      this.patientId,
      "",
      this.symptoms,
      this.aop,
      this.bloodTest,
      this.medicines,
      this.utils,
      this.docReview
    )
    this.doctorService.createEhr(ehr).subscribe( 
      data=>{
        if(!data.action){
          this.spinner.hide();
          this.alertService.error(data.message);
        }
        else{
          this.spinner.hide();
          // localStorage.setItem('doctorId',this.doctor.doctorId);
          // this.router.navigate(['/doctorHome/'+this.doctor.doctorId]);
          this.alertService.success(data.message);
        }
      });
  }

}
