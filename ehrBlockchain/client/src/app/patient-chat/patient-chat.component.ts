import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import io from 'socket.io-client';
import { Url } from 'url';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-patient-chat',
  templateUrl: './patient-chat.component.html',
  styleUrls: ['./patient-chat.component.css']
})
export class PatientChatComponent implements OnInit,AfterViewChecked  {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  msgGroup=new FormGroup({
    message:new FormControl()
  })

  constructor(private route: ActivatedRoute,private alertService:AlertService,private doctorService:DoctorService) { }
  socket:any;
  room:string;
  noMsg:Boolean;
  msgList:any;
  ngOnInit(): void {
    this.scrollToBottom();
    this.noMsg=false;
    let patientId=localStorage.getItem('p_patientId');
    let doctorId=this.route.snapshot.url[1].path;
    this.msgList=[];
    this.doctorService.getRoomForChat({doctorId,patientId}).subscribe(data=>{
      if(!data.action){
        this.alertService.error(data.message);
        if(data.message=="no room found"){
          this.doctorService.createRoomForChat({doctorId,patientId}).subscribe(data=>{
            if(!data.action){
              this.alertService.error(data.message);
            }
            else{
              this.room=data.message;
              this.socket=io('http://localhost:3001');
              this.socket.emit('patack',data.message);
              this.socket.on('patackback',val=>{
                console.log(val);
              });

              this.socket.on('patdbupdate',(msg)=>{
                if(typeof msg =="string"){
                  this.noMsg=true;
                }
                else{
                  this.msgList.push(...msg);
                }
              })
              this.socket.on('received',(data)=>{
                this.noMsg=false;
                console.log(data);
                this.msgList.push(data.content);
              })
            }
          })
        }
      }
      else{
        this.room=data.message;
        this.socket=io('http://localhost:3001');
        this.socket.emit('patack',data.message);
        this.socket.on('patackback',(val)=>{
            console.log(val);
        });

        this.socket.on('patdbupdate',(msg)=>{
          if(typeof msg =="string"){
            this.noMsg=true;
          }
          else{
            this.msgList.push(...msg);
          }
        })
        this.socket.on('received',(data)=>{
          console.log(data);
          this.noMsg=false;
          this.msgList.push(data.content);          
        })
      }
    })

  }

  sendMsg(){
    let message=this.msgGroup.get('message').value;
    if(message=="")return;
    this.msgGroup.get('message').setValue("");
    this.socket.emit("chat message",{room:this.room,content:{message,from:"patient",time:Date.now()}});
  }
  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 
scrollToBottom(): void {
  try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  } catch(err) { }                 
}

}
