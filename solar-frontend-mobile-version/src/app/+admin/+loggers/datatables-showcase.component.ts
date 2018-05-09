import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'sa-datatables-admin',
  templateUrl: './datatables-showcase.component.html',
})
export class DatatablesShowcaseComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
