import { Component, EventEmitter, Directive, ElementRef, Input, OnInit, Output, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import { WidgetService } from "../service/widget.service";
import { Widget } from "../model/widget";
//import { ActivitiesComponent } from '../../../shared/layout/header/activities/activities.component';
//import { ActivitiesService } from '../../../shared/layout/header/activities/activities.service';
declare var $: any;
/*
*  This component updates the widget
*/

@Component({
  selector: 'widget-edit',
  templateUrl: './widget.edit.component.html',
  providers: []
})
export class WidgetEditComponent implements OnInit {
  @Input() widget: Widget;
  public widgetID: number;
  public widgetError;

  public widgetUserRolesOptions: Array<userRoles> = [];

  constructor(private el: ElementRef, private widgetService: WidgetService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.getAllUserRoles();
  }

  /*
        * This method get all user roles
        */
  public getAllUserRoles() {
    this.widgetService.getAllRoles().subscribe(data => {
      if (data.error == null) {
        this.widgetUserRolesOptions = data.data;
        this.intializeWidgetUserRole();
      }
    }, error => {

    })
  }

  public intializeWidgetUserRole() {
    this.route.params.forEach((params: Params) => {
      console.info("Getting widget deails by Id started");
      if (params['widgetId'] !== undefined) {
        let widgetId: string = +params['widgetId'] + "";
        let widgetID: number = parseInt(widgetId);
        this.widgetID = widgetID;
        this.widgetService.getWidgetebyId(widgetID).then(widget => {
          this.widget = widget.data;
          let dummyData = [];
          this.widget.role.forEach(element => {
            dummyData.push(element.name)
            $('#widgetUserRoleMultiple').val(dummyData).trigger('change');
          })
          // this.cdr.detectChanges();
        });
        console.info("Getting widget details by Id ended");
      } else {
      }
    });
  }


  public widgetRolesSelections: Array<string> = [];
  ngAfterViewInit() {
    $('#widgetUserRoleMultiple').on('change', (eventValues) => {
      this.widgetRolesSelections = $(eventValues.target).val();
      if (this.widgetRolesSelections === null) {
        this.widgetRolesSelections = [];
      }
      console.log(this.widgetRolesSelections);
    });
  }

  ngOnInit() { }
  onWidgetTypeChange(value) {
  }

  /*
  * This method updates the widget
  */

  widgetContentStatus: boolean = false;
  public updateWidget(widgetName, widgetRoles) {
    let roleData = new Array();
    if (widgetRoles) {
      widgetRoles.forEach(element => {
        this.widgetUserRolesOptions.forEach(user => {
          if (user.name == element) {
            roleData.push({ 'name': user.name, 'id': user.id })
          }
        })
      });
    }
    try {
      //  this.widget.name = widgetName;
      let widgetData = {
        "name": widgetName,
        "content": "",
        "role": roleData
      }
      this.widgetContentStatus = false;
      this.widgetService.updateWidget(widgetData, this.widgetID).subscribe(
        data => {
          if (data.error == null) {
            this.widgetError = '';
            let link = ['/admin/widget/list', { data: "USuccess" }];
            this.router.navigate(link);
          }
          else {
            this.widgetError = data.error.message;
            setTimeout(() => {
              this.widgetError = '';
            }, 5000);
          }
        },
        error => {
          console.log("Error : " + error);
        });

    } catch (error) {
      console.debug("widget edit failed", error);
    }
  }

  public goBack() {
    let link = ['/admin/widget/list'];
    this.router.navigate(link);
  }


}




@Directive({
  selector: '[customSummernotes]'
})
export class SummernoteDirective implements OnInit {

  @Input() customSummernotes = {};
  @Output() changes = new EventEmitter()

  constructor(private el: ElementRef) {

  }

  ngOnInit() {
    System.import('script-loader!summernote/dist/summernote.min.js').then(() => {
      this.render()
    })
  }

  render() {
    $(this.el.nativeElement).summernote(Object.assign(this.customSummernotes, {
      tabsize: 2,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['link', 'picture']],
        ['view', ['fullscreen', 'codeview']],   // remove codeview button 
        ['help', ['help']]
      ],
      callbacks: {
        onChange: (we, contents, $editable) => {
          localStorage.setItem("content", JSON.stringify(we));
          this.changes.emit(contents)
        }
      }
    }))

  }

}
export class userRoles {
  constructor(
    public id: number,
    public name: string
  ) {
  }

}