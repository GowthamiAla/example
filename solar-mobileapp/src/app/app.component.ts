import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

// declare var navigator: any;
@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>
  <div bsModal #showOfflineAlert="bs-modal" data-backdrop="static" class="modal fade"
  tabindex="-1" [config]="{'backdrop':'static', 'keyboard': false}" role="dialog" aria-labelledby="myLargeModalLabel" style="top:35%">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title"><strong>Internet Connection Error</strong></h4>
      </div>
      <div class="modal-body ">
         Check your internet connection and try again
      </div>
      <div class="modal-footer padding-10" style="text-align:center">
        <button class="btn btn-default" type="button" (click)="onCancel()">Cancel</button>
        <button class="btn btn-primary" type="button" (click)="connectivityListners()" >Retry</button>
        </div>
    </div>
  </div>
</div>`
})
export class AppComponent {
    public title = 'app works!';
    public checkonline: boolean;

    @ViewChild('showOfflineAlert') public showOfflineAlert: ModalDirective;
    public showChildModal() {
        this.showOfflineAlert.show();
    }


    public constructor(private viewContainerRef: ViewContainerRef) {
        this.connectivityListners();
    }

    connectivityListners() {
        document.addEventListener('offline', this.offlineFunction.bind(this), false);
        document.addEventListener('online', this.onlineFunction.bind(this), false);
    }


    offlineFunction() {
        this.checkonline = false;
        this.showOffileAlert();
    }

    onlineFunction() {
        this.checkonline = true;
        this.showOfflineAlert.hide();
    }

    showOffileAlert() {
        if (!this.checkonline) {
            this.showOfflineAlert.show();
        }
    }

    onCancel() {
        navigator['app'].exitApp();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {

    }

}
