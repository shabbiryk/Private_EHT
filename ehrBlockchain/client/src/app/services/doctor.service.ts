import { Ehr } from './../classes/ehr';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subscription, Subscribable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
//import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  
  private baseUrl = "http://localhost:8000/";

  constructor( private http : HttpClient, private router : Router ) { }

  createEhr(ehr : Ehr) : Observable<any>{
    let url = this.baseUrl + "createEhr";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    console.log(ehr);
    return this.http.post(url,JSON.parse(JSON.stringify(ehr)),{headers});
  }

  getPatientsAlignedToDoctor(args:string):Observable<any>{
    let url = this.baseUrl + "getPatientsForDoctor";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    let newObj={"doctorId":args};
    return this.http.post(url,JSON.parse(JSON.stringify(newObj)),{headers});
  }

  createDoctor(args:any):Observable<any>{
    let newObj={"doctorId":"","firstName":"","lastName":"","password":"","patientList":""};
    newObj.doctorId=args.doctorId;
    newObj.firstName=args.doctorFirstName;
    newObj.lastName=args.doctorLastName;
    newObj.password=args.doctorPassword;
    newObj.patientList=JSON.stringify([]);
    let url = this.baseUrl + "createDoctor";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  

  checkDoctor(doctor:any) : Subscribable<any>{
    let url = this.baseUrl + "checkDoctor";
    let headers=new HttpHeaders();
    let newObj={"doctorId":"","password":""}
    newObj.doctorId=doctor.doctorId;
    newObj.password=doctor.doctorPassword;
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  getRoomForChat(args:any) : Subscribable<any>{
    let url = this.baseUrl + "getRoomForChat";
    let headers=new HttpHeaders();
    let newObj={"doctorId":"","patientId":""}
    newObj.doctorId=args.doctorId;
    newObj.patientId=args.patientId;
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  createRoomForChat(args:any) : Subscribable<any>{
    let url = this.baseUrl + "createRoomForChat";
    let headers=new HttpHeaders();
    let newObj={"doctorId":"","patientId":""}
    newObj.doctorId=args.doctorId;
    newObj.patientId=args.patientId;
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  checkUsernamePresence(args:any):Observable<any>{
    let url = this.baseUrl + "checkUsernamePresence";
    let headers=new HttpHeaders();
    let newObj={"id":args}
    headers.set('Content-Type','application/json');
    console.log(newObj);
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  getHistory( args:any) : Observable<any>  {
    let url = this.baseUrl + "getHistoryForPatient";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(args)),{headers});
  }

  

  isLoggedIn(){
    //let jwtHelper = new JwtHelperService();
    let token = localStorage.getItem('token');
    if(!token)
    {
      return false;
    }
    // if(token) {

    //   let expierationDate = jwtHelper.getTokenExpirationDate(token);
    //   let isExpired = jwtHelper.isTokenExpired(token);
    //   return !isExpired;
    // }
    return true;
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('doctorId');
    localStorage.removeItem('isNewPatient');
    localStorage.removeItem('patientId');
    this.router.navigate(['/homepage']);
  }
}