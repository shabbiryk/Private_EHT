import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private spinner : NgxSpinnerService,
              private router : Router) { }

  ngOnInit() {
  }

  startSpin1()
  {
    this.spinner.show();
    setTimeout(() => {
        this.spinner.hide();
        this.router.navigate(['/doctorLogin/']);
      }, 1000);   
  }
  startSpin2()
  {
    this.spinner.show();
    setTimeout(() => {
        this.spinner.hide();
        this.router.navigate(['/patientLogin/']);
      }, 1000);   
  }

}
