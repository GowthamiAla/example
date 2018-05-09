import { Component, OnInit } from '@angular/core';
import { FadeZoomInTop } from "../../animations/fade-zoom-in-top.decorator";
import { LayoutService } from '../layout.service';
import { Subscription } from 'rxjs/Rx';

@FadeZoomInTop()
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styles: []
})
export class MainLayoutComponent implements OnInit {

  store: any;
  private sub: Subscription;

  constructor(private layoutService: LayoutService) { }

  ngOnInit() {
    this.layoutService.setCustomTheme();
  }

}
