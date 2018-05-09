import { Component, EventEmitter, Directive, ElementRef, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TemplateService } from '../service/template.service';
import { Template } from '../model/template';

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
  public templateUpdateSuccess;
  public templateUpdateFailure;
  @Input() template: Template;
  templateForm: FormGroup;
  tname: AbstractControl;
  ttype: AbstractControl;
  templateID: number;
  public otpTextFormat: string;
  public addUserTextFormat: string;
  public deletUserTextFormat: string;
  public sendErrorTextFormat: string;
  templateContentStatus = false;
  public serviceErrorResponse;
  public serviceErrorData;

  constructor(private el: ElementRef, private fb: FormBuilder,
    private templateService: TemplateService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    // Validators.pattern('[a-zA-Z, " "]+'),
    this.templateForm = fb.group({
      tname: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z-," "]+'),
      Validators.minLength(5), Validators.maxLength(25)])],
      ttype: [null, Validators.compose([Validators.required])]

    });

    this.otpTextFormat = 'OTP to change your password is ${OTP}';
    this.addUserTextFormat = 'New user with name ${userName} and email ${email} is registered at $T{yyyyMMdd}';
    this.deletUserTextFormat = 'User with name ${userName} and email ${email} is deleted.';
    this.sendErrorTextFormat = 'Error occured at ${error}';
  }


  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['templateId'] !== undefined) {
        const templateId: string = +params['templateId'] + '';
        const templateID: number = parseInt(templateId, 10);
        this.templateID = templateID;
        this.templateService.getTemplatebyId(templateID).then(template => {
          this.template = template.data;
          localStorage.setItem('content', JSON.stringify(this.template.content));
          // this.cdr.detectChanges();
        });
      } else {
      }
    });

  }
  onTemplateTypeChange(value) {
    this.template.type = value;
  }

  /*
  * This method updates the Template
  */


  public updateTemplate() {

    try {
      const defaultContent = '<p><br></p>';
      this.template.content = JSON.parse(localStorage.getItem('content'));
      if (this.template.content !== null && this.template.content.length !== 0 &&
        this.template.content !== undefined && this.template.content !== defaultContent) {
        this.templateContentStatus = false;
        this.templateService.updateTemplate(this.template, this.templateID).subscribe(
          data => {
            if (data.error === null) {
              localStorage.setItem('content', JSON.stringify(''));
              const link = ['/admin/template/list'];
              this.templateUpdateSuccess = 'Template Updated Successfully'
              setTimeout(() => {
                this.templateUpdateSuccess = ''
                this.router.navigate(link);
              }, 2000);
            } else {
              this.templateUpdateFailure = data.error.message;
              setTimeout(() => {
                this.templateUpdateFailure = ''
              }, 2000);
            }

          },
          error => {
            this.serviceErrorResponse = error.exception;
            this.serviceErrorData = true;
          });
      } else {
        if (this.template.content == null || this.template.content.length === 0 ||
          this.template.content === undefined || this.template.content === defaultContent) {
          this.templateContentStatus = true;
        }
      }

    } catch (error) {
      console.log('Template edit failed', error);
    }
  }

  public goBack() {
    const link = ['/admin/template/list'];
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
          localStorage.setItem('content', JSON.stringify(we));
          this.changes.emit(contents)
        }
      }
    }))

  }

}
