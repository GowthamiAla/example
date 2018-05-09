import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, ViewContainerRef, Input, ChangeDetectorRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ILoad } from '../models/load';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
// import *as $ from 'jquery';
import { endponitConfig } from '../../../../environments/endpoints';
import { dcMnagerService } from '../../dc_manager.service';
declare var $: any;
@Component({
  selector: 'dcmanager-loads-list',
  templateUrl: './loads.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
  .select2-selection__choice__remove {
    line-height: 1 !important
  }

  .popup-header,
  .popup-body,
  .popup-footer {
    padding: 15px;
    text-align: center;
  }

  .popup-header {
    font-weight: bold;
    font-size: 18px;
    border-bottom: 1px solid #ccc;
  }

  .geofieldInput {
    padding-left: 0px !important;
  }

  .geoButtonSubmit {
    padding: 10px
  }

  @media screen and (max-width: 768px) {
    .geoSubmitButton {
      float: right;
    }
    .geoButtonSubmit {
      padding: 0px 15px 10px 0px !important;
    }
    .geoInput {
      padding: 0px !important;
    }
  }

  .ng2-popup-overlay {
    display: flex;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.2);
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: none;
  }
  `]
})

export class dcLoadsComponent implements OnInit, AfterViewInit {

  public loadnumprefix = '';

  message: string;
  public activePageTitle: string;
  public error: String;
  public errorMessage: String;
  public loadListView: any;
  public geoMilesData: any;

  public loadsHeader: Headers;
  public loadDeleteSuccess;
  public loadDeleteFailure;

  public geoMIlesUpdated;
  public geoMilesFailure;
  public formValidate;
  public geoValue: any;
  // for filter multiple events input values handling
  public emailNotifySelectedValues: Array<string> = [];
  public NotifySuccessMessage;
  public NotifyFailureMessage;


  public userList: any;
  public userlistSuccess: any;
  public userListFailure: any;
  public getLoadserrorResponse;
  public loadErrorData;
  public userEmail = localStorage.getItem('currentUser');
  complexForm: FormGroup;
  geofencemiles: AbstractControl;
  geofenceEmail: AbstractControl;


  @ViewChild('loadNotifyPopup') public loadNotifyPopup: ModalDirective;

  // load view popup
  @ViewChild('loadviewPopup') public loadviewPopup: ModalDirective;


  options = {
    dom: 'Bfrtip',
    buttons: [
      {
          text: '<i class="fa fa-refresh"></i> Refresh',
          className: 'btn bg-color-blueLight  txt-color-white btn-sm dataTableCustomButtonMargin',
          action: function (e, dt, node, config) {
              if ($.fn.DataTable.isDataTable('#DataTable table')) {
                  var table = $('#DataTable table').DataTable();
                  table.ajax.reload();
              }
          }
      }
  ],
    ajax: (data, callback, settings) => {
      this.http.get(endponitConfig.LOAD_API_ENDPOINT + 'getLoadsBasedOnDcManager/' + this.userEmail + '/', { headers: this.loadsHeader })
        .map(this.extractData)
        .catch(error => {
          // In a real world app, we might use a remote logging infrastructure
          // We'd also dig deeper into the error to get a better message
          const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          console.error(errMsg); // log to console instead
          if (error.status == 404) {
            error = error.json();
            this.getLoadserrorResponse = error.exception;
            this.loadErrorData = true;
          } else {
            // this.navigateToLogin( this.errorMessage)
            localStorage.setItem('status', '401')
            // 401 unauthorized response so log user out of client
            window.location.href = '/#/error';
            return Observable.throw(errMsg);
          }
        })
        .subscribe((jsondata) => {
          callback({
            aaData: jsondata,
          })
        })
    },


    columns: [
      {
        data: 'apptNbr',
        responsivePriority: 1
      },
      {
        data: 'destLocNbr.locAddrName',
        responsivePriority: 2
      },
      {
        data: 'driver.firstName',
        responsivePriority: 3
      },
      {
        data: 'vndNbr.vendorName',
        responsivePriority: 5
      },
      {
        data: 'apptStatNbr.status',
        responsivePriority: 6
      },
      {
        data: 'apptStatNbr',
        className: 'editcenter',
        responsivePriority: 2,
        render: (data, type, row) => {
          return `<a class=" editor_view" ><i class="fa fa-eye" ></i></a>/
            <a class=" editor_notify" ><i class="fa fa-envelope-o"></i></a>`
        }
      }
    ],


    rowCallback: (row: Node, data: any | Object, index: number) => {

      const self = this;
      $('td', row).unbind('click');

      $('a.editor_view', row).bind('click', () => {
        self.gotoViewLoadDetails(data);
      });
      $('a.editor_notify', row).bind('click', () => {
        self.gotoNotifyLoadDetails(data);
      });
      return row;
    },
  };
  private extractData(res) {
    const body = res.json();
    if (body) {
      return body.data
    } else {
      return {}
    }
  }

  public showChildModal(): void {
    this.loadviewPopup.show();
  }

  constructor(private http: Http, private cdr: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef, private fb: FormBuilder, private dcService: dcMnagerService, private router: Router) {
    this.viewContainerRef = viewContainerRef;
    this.activePageTitle = 'Loads';

    this.loadsHeader = new Headers();
    this.loadsHeader.append('Content-Type', 'application/json');
    this.loadsHeader.append('Authorization', localStorage.getItem('Authentication'));

    this.complexForm = fb.group({
      'geofencemiles': [null, Validators.compose([Validators.required, Validators.pattern('^(15[0]|1[0-4][0-9]|[0-9][0-9]|[5-9])$')])],
      'geofenceEmail': [null,
        Validators.compose([Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')])]
    })
    this.geofencemiles = this.complexForm.controls['geofencemiles'];
    this.geofenceEmail = this.complexForm.controls['geofenceEmail'];
  }



  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }


  ngOnInit() {
    this.getUsersList();
  }

  geoMilesSubmit(loadnumber, geoMilesValue) {
    if (geoMilesValue && this.complexForm.valid) {
      this.dcService.setGeoMiles(loadnumber, geoMilesValue).then(response => {
        if (response.data != null) {
          $('#DataTable table').DataTable().ajax.reload();
          this.geoMIlesUpdated = 'Geofence miles updated successfully'
          setTimeout(() => {
            this.geoMIlesUpdated = ''
          }, 2000);
        } else {
          this.geoMilesFailure = response.error.message
          setTimeout(() => {
            this.geoMilesFailure = ''
          }, 3000);
        }
      })
        .catch(error => {
          this.geoMilesFailure = 'Failed to update geofence miles'
          setTimeout(() => {
            this.geoMilesFailure = ''
          }, 2000);
          this.error = error
        });
    } else {
      this.formValidate = true;
    }
  }



  /**
   * View Load
   */

 public gotoViewLoadDetails(viewObj: any) {
   this.loadListView = viewObj;
   this.geoValue = viewObj.geomiles
   this.loadviewPopup.show();
 }

  public gotoNotifyLoadDetails(viewObj: any) {
    $('#notifyEmailMultiSelect').val('').trigger('change');
    this.loadListView = viewObj;
    this.loadNotifyPopup.show();
  }


  getUsersList() {
    this.dcService.getUserList().then(response => {
      if (response.data != null) {
        this.userList = response.data;
      } else {
        this.userListFailure = response.error.message
        setTimeout(() => {
          this.geoMilesFailure = ''
        }, 3000);
      }
    })
      .catch(error => {
        this.geoMilesFailure = 'Failed to update geofence miles'
        setTimeout(() => {
          this.geoMilesFailure = ''
        }, 2000);
        this.error = error
      });
  }


  ngAfterViewInit() {
    $('#notifyEmailMultiSelect').on('change', (eventValues) => {
      this.emailNotifySelectedValues = $(eventValues.target).val();
      if (this.emailNotifySelectedValues === null) {
        this.emailNotifySelectedValues = [];
      }
    });
  }



  notifyEmail(loadObject) {
    if (this.emailNotifySelectedValues.length) {
      let objEmail;
      for (const emails of this.emailNotifySelectedValues) {
        if (objEmail) {
          objEmail = objEmail + ',' + emails;
        } else {
          objEmail = emails;
        }
      }

      const postObject = {
        'loadNum': loadObject.apptNbr,
        'driver': loadObject.driver.firstName,
        'location': loadObject.destLocNbr.locAddrName
      }

      this.dcService.setEmailNotifications(objEmail, postObject).then(response => {
        if (response.data != null) {
          $('#notifyEmailMultiSelect').val('').trigger('change');
          this.NotifySuccessMessage = response.data;
          setTimeout(() => {
            this.NotifySuccessMessage = '';
          }, 3000)
        } else {
          this.NotifyFailureMessage = response.error.message
          setTimeout(() => {
            this.NotifyFailureMessage = '';
            this.NotifySuccessMessage = '';
          }, 3000);
        }
      })
        .catch(error => {
          this.geoMilesFailure = 'Failed to update geofence miles'
          setTimeout(() => {
            this.geoMilesFailure = ''
          }, 2000);
          this.error = error
        });
    } else {
      this.NotifyFailureMessage = 'Please select email participants';
      setTimeout(() => {
        this.NotifyFailureMessage = '';
      }, 3000);
    }
  }


}
