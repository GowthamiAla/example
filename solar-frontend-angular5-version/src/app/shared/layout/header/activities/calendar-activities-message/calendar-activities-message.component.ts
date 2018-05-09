import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: '[calendarActivitiesMessages]',
  templateUrl: './calendar-activities-message.component.html',
})
export class calendarActivitiesMessageComponent implements OnInit {

  @Input()  events: any;
  constructor()
  {

  }

  ngOnInit() {
  }

}
