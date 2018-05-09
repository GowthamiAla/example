
import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Location } from '@angular/common';
import { TemplateService } from '../service/template.service';
import { endponitConfig } from '../../../../environments/endpoints';
/*
* This component get all added templates shown in UI and delete a particular Template
*/
declare var $: any;
@Component({
  selector: 'temp-list',
  templateUrl: './template.list.component.html',

})
export class TemplateListComponent {
  headers: Headers;
  TemplateUpdateMessages: string;
  errorMessage;
  sucessMessage;
  public widgetNames;
  public templateWidget = true;

  constructor(private templateService: TemplateService, private route: ActivatedRoute, private http: Http, private router: Router, private zone: NgZone) {
    this.headers = new Headers();
    this.headers.append("Authorization", "Basic " + localStorage.getItem('Authentication'));
    this.headers.append("Content-Type", "application/json");
    
    if (localStorage.getItem('widget') != null) {
      this.widgetNames = localStorage.getItem('widget').split(",");
      this.widgetNames.forEach(element => {
        if (element === 'add-template') {
          this.templateWidget = false;
        }
      });
    }


  }


  options = {
    dom: "Bfrtip",
    ajax: (data, callback, settings) => {

      this.http.get(endponitConfig.TEMPLATES_API_ENDPOINT, { headers: this.headers })
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe((data) => {
          callback({
            aaData: data,
          })
        })
    },
    columns: [
      { data: 'id', responsivePriority: 4 }, { data: 'name', responsivePriority: 1 }, { data: 'type', responsivePriority: 2 }, {
        data: null,
        orderable: false,
        className: "editcenter",
        defaultContent: '<a class="editor_edit"> <i class="fa fa-edit"></i></a> / <a  class="editor_remove"><i class="fa fa-trash-o"></i></a>',
        responsivePriority: 3
      }
    ],
    rowCallback: (row: Node, data: any | Object, index: number) => {

      const self = this;

      $('td', row).unbind('click');
      $('a.editor_edit', row).bind('click', () => {
        self.editTemplate(data);
      });

      $('a.editor_remove', row).bind('click', () => {
        try {
          this.templateService.deleteTemplate(data.id).subscribe(
            data => {
              console.log("Template delete end");
              if (data.error) {
                this.sucessMessage = '';
                this.errorMessage = 'Template Already Assigned to Other Events'
                setTimeout(() => {
                  this.errorMessage = ''
                }, 5000);
              }
              else {
                $('td', row).parents('tr').remove();
                this.errorMessage = '';
                this.sucessMessage = 'Template Deleted Successfully'
                setTimeout(() => {
                  this.sucessMessage = ''
                }, 5000);
              }

            },
            error => {
              console.log("Error")
            });

        } catch (error) {
          console.log("Template delete failed", error);
        }

      });
      return row;
    }
  };



  /*
 * This method navigates you to EditTemplate
 */
  public editTemplate(template: any) {
    let link = ['/admin/template/editTemplate', template.id];
    this.router.navigate(link);
  }

  private extractData(res) {
    let body = res.json();
    if (body) {
      return body.data
    } else {
      return {}
    }
  }

  private handleError(error: any) {
    localStorage.setItem('status', '401')
    // 401 unauthorized response so log user out of client
    window.location.href = '/#/error';
    return Observable.throw(error._body);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.data != undefined) {
        if (params.data === 'ASuccess') {
          this.TemplateUpdateMessages = 'Template  Created Successfully';
          setTimeout(() => { this.TemplateUpdateMessages = '' }, 3000);
        } else if (params.data === 'USuccess') {
          this.TemplateUpdateMessages = 'Template Updated Successfully';
          setTimeout(() => { this.TemplateUpdateMessages = '' }, 3000);
        }
        else if (params.data === 'DSuccess') {
          this.TemplateUpdateMessages = 'Template  Deleted Successfully';
          setTimeout(() => { this.TemplateUpdateMessages = '' }, 3000);
        }
      }
    })
  }

}
