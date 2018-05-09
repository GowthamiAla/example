import { Component, OnInit } from '@angular/core';
import { FadeZoomInTop } from "../../animations/fade-zoom-in-top.decorator";
import { Router } from '@angular/router';
@FadeZoomInTop()
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styles: []
})
export class MainLayoutComponent  {
  public userRole;
  constructor(private router: Router) {
  
  }

  ngOnInit() {
     
  }

}
