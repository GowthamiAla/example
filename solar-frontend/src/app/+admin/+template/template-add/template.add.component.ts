import { Component, OnInit } from '@angular/core';
import { Template } from '../model/template';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TemplateService } from '../service/template.service';

declare var $: any;

/*
 This component adds the Template 
*/
@Component({
  selector: 'tmp-add',
  templateUrl: './template.add.component.html',

})
export class TemplateAddComponent {
  public templateAddSuccess;
  public templateAddFailure;

  template: Template = new Template("", "", "");
  public templateForm: FormGroup;
  public tname: AbstractControl;
  public ttype: AbstractControl;
  public otpTextFormat: string;
  public addUserTextFormat: string;
  public deletUserTextFormat: string;
  public sendErrorTextFormat: string;
  constructor(private fb: FormBuilder, private templateService: TemplateService, private router: Router, private location: Location) {
    this.templateForm = fb.group({
      tname: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z, " "]+'), Validators.minLength(5), Validators.maxLength(25)])],
      ttype: [null, Validators.compose([Validators.required])]
    })
    this.otpTextFormat = 'OTP to change your password is ${OTP}';
    this.addUserTextFormat = 'New user with name ${userName} and email ${email} is registered at $T{yyyyMMdd}';
    this.deletUserTextFormat = 'User with name ${userName} and email ${email} is deleted.';
    this.sendErrorTextFormat = 'Error occured at ${error}';
  }

  /*
  * This method adds the template
  */
  onTemplateTypeChange(value) {
    this.template.type = value;
    console.log(this.template.type);
  }

  templateContentStatus: boolean = false;
  public addTemplate(value) {
    try {
      let defaultContent = "<p><br></p>";
      this.template.content = JSON.parse(localStorage.getItem("content"));
      console.log("Content: " + this.template.content);
      if (this.template.content != null && this.template.content.length != 0 && this.template.content != undefined && this.template.content != "") {
        this.template.name = value.tname;
        this.template.type = value.ttype;
        this.templateContentStatus = false;
        this.templateService.addTemplate(this.template).subscribe(
          data => {
            if (data.error === null) {
              localStorage.setItem("content", JSON.stringify(""));
              let link = ['/admin/template/list'];
              this.templateAddSuccess = 'Template Created Successfully';
              setTimeout(() => {
                this.templateAddSuccess = ''
                this.router.navigate(link);
              }, 2000);


            } else {
              this.templateAddFailure = data.error.message
              setTimeout(() => {
                this.templateAddFailure = ''
              }, 2000);

            }
          },
          error => {
            console.log("Error : " + error);
          });
      } else {
        if (this.template.content == null || this.template.content.length == 0 || this.template.content == undefined || this.template.content == defaultContent) {
          this.templateContentStatus = true;
        }
      }
    } catch (error) {
      console.debug("Template add failed", error);
    }

  }
  /*
    * This method takes back to previous page
    */
  public goBack() {
    let link = ['/admin/template/list'];
    this.router.navigate(link);
  }

}
