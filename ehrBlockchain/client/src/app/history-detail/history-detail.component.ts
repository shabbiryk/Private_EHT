import { Ehr } from './../classes/ehr';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.css']
})
export class HistoryDetailComponent implements OnInit {


  @Input()
  private record : Ehr;
  constructor( ) { 
 
  }

  ngOnInit() {
  }

}
