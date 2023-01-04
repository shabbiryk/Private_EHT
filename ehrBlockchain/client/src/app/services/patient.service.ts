import { Ehr } from './../classes/ehr';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subscribable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ObserveOnMessage } from 'rxjs/internal/operators/observeOn';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class PatientService {


  constructor(  private http : HttpClient,
                private router: Router ) { }

  setPatientPassword(args:any): Observable<any> {
    let url = this.baseUrl + "setPatientPassword";
    let headers=new HttpHeaders();
    let newObj={"patientId":"","password":""}
    newObj.patientId=args.patientId;
    newObj.password=args.password
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  checkUsernamePresence(args:any):Observable<any>{
    let url = this.baseUrl + "checkUsernamePresence";
    let headers=new HttpHeaders();
    let newObj={"id":args}
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  updateDoctorForPatient(patientId:any){
    let url = this.baseUrl + "updateDoctorForPatient";
    let headers=new HttpHeaders();
    let newObj={"patientId":"","doctorId":""}
    newObj.patientId=patientId;
    newObj.doctorId=localStorage.getItem('doctorId');
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  getDoctor(doctorIdPassed:string){
    let patientId=localStorage.getItem('p_patientId');
    let url = this.baseUrl + "getDoctor";
    let headers=new HttpHeaders();
    let newObj={"patientId":"","doctorId":""}
    newObj.patientId=patientId;
    newObj.doctorId=doctorIdPassed;
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  getPatientDoctorHistory(){
    let patientId=localStorage.getItem('p_patientId');
    let url = this.baseUrl + "getPatientDoctorHistory";
    let headers=new HttpHeaders();
    let newObj={"patientId":"","doctorId":""}
    newObj.patientId=patientId;
    newObj.doctorId=localStorage.getItem('doctorId');
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  addPatientToDoctorList(patientId:any){
    let url = this.baseUrl + "addPatientToDoctorList";
    let headers=new HttpHeaders();
    let newObj={"patientId":"","doctorId":""}
    newObj.patientId=patientId;
    newObj.doctorId=localStorage.getItem('doctorId');
    console.log(newObj);
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

 


  checkPatient(patient:any) : Subscribable<any>{
    let url = this.baseUrl + "checkPatient";
    let headers=new HttpHeaders();
    let newObj={"patientId":"","doctorId":""}
    newObj.patientId=patient.patientId;
    newObj.doctorId=localStorage.getItem('doctorId');
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }
  private baseUrl = "http://localhost:8000/";

  

  createPatient(args:any):Observable<any>{
    let newObj={"patientId":"","firstName":"","lastName":"","doctorId":"","emailId":"","ehrList":""};
    newObj.patientId=args.patientId;
    newObj.firstName=args.patientFirstName;
    newObj.lastName=args.patientLastName;
    newObj.doctorId=args.doctorId;
    newObj.emailId=args.emailId;
    newObj.ehrList=JSON.stringify([]);
    console.log(newObj);
    let url = this.baseUrl + "createPatient";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(newObj)))
  }

  sendOtpToPatient(args:any):Observable<any>{
    let url = this.baseUrl + "sendOtpToPatient";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(args)),{headers:headers});
}

    checkPatientPassword(args:string):Observable<any>{
    let url = this.baseUrl + "checkPatientPassword";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(args),{headers:headers});
    }

  generateOtp(patientId:string):Observable<any>{
    let url = this.baseUrl + "generateOtp";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    let args={"patientId":patientId};
    console.log(args);
    return this.http.post(url,JSON.parse(JSON.stringify(args)),{headers:headers});
  }

  checkOtp(args:any):Observable<any>{
    let url = this.baseUrl + "checkOtp";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    console.log(args);
    return this.http.post(url,JSON.parse(args),{headers});
  }

  getHistory( args:any) : Observable<any>  {
    let url = this.baseUrl + "getHistoryForPatientByPatient";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(args)),{headers});
  }


  patientHasPassword(args:any):Observable<any>{
    let url = this.baseUrl + "patientHasPassword";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    let newObj={"patientId":args.patientId}
    return this.http.post(url,JSON.parse(JSON.stringify(args)),{headers:headers});
  }

  isLoggedIn(){
    
    let token = localStorage.getItem('patient_token');
    if(!token)
    {
      return false;
    }
    return true;
  }

  logout(){
    localStorage.removeItem('patient_token');
    this.router.navigate(['/homepage']);
  }

}