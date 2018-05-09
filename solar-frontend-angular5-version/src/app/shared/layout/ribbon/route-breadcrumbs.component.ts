import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";

@Component({
  selector: 'sa-route-breadcrumbs',
  template: `
        <ol class="breadcrumb">
           <li *ngFor="let item of items" (click)="breadcrumbsNavigation(item)" ><a>{{item}}</a></li>
        </ol>
  `,
  styles: []
})
export class RouteBreadcrumbsComponent implements OnInit, OnDestroy {

  public items: Array<string> = [];
  private sub

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.extract(this.router.routerState.root)
    this.sub = this.router.events
      .filter(e => e instanceof NavigationEnd)
      .subscribe(v => {
        this.items = [];
        this.extract(this.router.routerState.root)
      });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }


  extract(route){
    let pageTitle = route.data.value['pageTitle'];
    if(pageTitle && this.items.indexOf(pageTitle) == -1){
      this.items.push(route.data.value['pageTitle'])
    }
    if(route.children){
      route.children.forEach(it=>{
        this.extract(it)
      })
    }
  }

  breadcrumbsNavigation(path) {
    let item = path.toLowerCase()
    if (item.indexOf(' ') >= 0 || item == 'analytics'|| item =='admin'||item =='dashboard') { }
    else {
      let link = ['/' + item];
      this.router.navigate(link);
    }
  }


}
