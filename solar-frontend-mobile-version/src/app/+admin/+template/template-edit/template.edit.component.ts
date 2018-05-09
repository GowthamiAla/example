import { Component, EventEmitter, Directive, ElementRef, Input, OnInit, Output, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import { TemplateService } from "../service/template.service";
import { Template } from "../model/template";
//import { ActivitiesComponent } from '../../../shared/layout/header/activities/activities.component';
//import { ActivitiesService } from '../../../shared/layout/header/activities/activities.service';
declare var $: any;
/*
*  This component updates the Template
*/


@Component({
  selector: 'temp-list',
  templateUrl: './template.edit.component.html',
  providers: []
})
export class TemplateEditComponent implements OnInit {
  @Input()  template: Template;
   templateForm: FormGroup;
   tname: AbstractControl;
   ttype: AbstractControl;
   templateID: number;
  public otpTextFormat:string;
  public addUserTextFormat:string;
  public deletUserTextFormat:string;
  public sendErrorTextFormat:string;
  constructor(private el: ElementRef, private fb: FormBuilder, private templateService: TemplateService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.templateForm = fb.group({
      tname: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+'), Validators.minLength(5), Validators.maxLength(25)])],
      ttype: [null, Validators.compose([Validators.required])]
      
    });

    this.otpTextFormat='OTP to change your password is ${OTP}';
    this.addUserTextFormat='New user with name ${userName} and email ${email} is registered at $T{yyyyMMdd}';
    this.deletUserTextFormat='User with name ${userName} and email ${email} is deleted.';
    this.sendErrorTextFormat='Error occured at ${error}';
  }

  
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      console.info("Getting template deails by Id started");
      if (params['templateId'] !== undefined) {
        let templateId: string = +params['templateId'] + "";
        let templateID: number = parseInt(templateId);
        this.templateID = templateID;
        this.templateService.getTemplatebyId(templateID).then(template => {
          this.template = template.data;
          localStorage.setItem("content", JSON.stringify(this.template.content));
         // this.cdr.detectChanges();
        });
        console.info("Getting template details by Id ended");
      } else {
      }
    });

  }
  onTemplateTypeChange(value){
     this.template.type=value
    console.log(this.template.type);
  }

  /*
  * This method updates the Template
  */
  
  templateContentStatus:boolean=false;
  public updateTemplate() {
    
    try {
      let defaultContent = "<p><br></p>";
      this.template.content = JSON.parse(localStorage.getItem("content"));
      if (this.template.content != null && this.template.content.length != 0 && this.template.content != undefined && this.template.content != defaultContent) {
          this.templateContentStatus=false;
        this.templateService.updateTemplate(this.template, this.templateID).subscribe(
          data => {
            localStorage.setItem("content", JSON.stringify(""));
            let link = ['/admin/template/list', { data: "USuccess" }];
            this.router.navigate(link);

          },
          error => {
            console.log("Error : " + error);
          });
      } else {
        if (this.template.content == null || this.template.content.length == 0 || this.template.content == undefined || this.template.content == defaultContent) {
          this.templateContentStatus=true;
        }
      }
      
    } catch (error) {
      console.debug("Template edit failed", error);
    }
  }

   public goBack() {
    let link = ['/admin/template/list'];
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
