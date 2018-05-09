import { Component, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>

  <div class="loading"></div>

  `
})
export class AppComponent {
  public title = 'app works!';

  public constructor(private viewContainerRef: ViewContainerRef) { }

}
