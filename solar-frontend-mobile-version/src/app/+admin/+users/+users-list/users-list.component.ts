import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service'
import { endponitConfig } from '../../../../environments/endpoints';
import { Router, ActivatedRoute } from '@angular/router';



import { Http, Response, Headers } from '@angular/http';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var $: any;

@Component({
  selector: 'datatables-users-list',
  templateUrl: './users-list.component.html',
  styles: []
})
export class UsersListComponent implements OnInit {
  public users;
  private headers: Headers;
  public userWidget = true;

  constructor(private userService: UserService, private route: ActivatedRoute, private http: Http, private router: Router) {
    this.headers = new Headers();
    this.headers.append("Authorization", "Basic " + localStorage.getItem('Authentication'));
    this.headers.append("Content-Type", "application/json");

    if (localStorage.getItem('widget') != null) {
      localStorage.getItem('widget').split(",").forEach(element => {
        if (element === 'add-user') {
          this.userWidget = false;
        }
      });
    }
    
  }

  userlistMessage: string;
  ngOnInit() {
    this.route.params.subscribe(params => {

      if (params.data != undefined) {
        if (params.data === 'ASuccess') {
          this.userlistMessage = 'User Created Successfully';
          setTimeout(() => { this.userlistMessage = '' }, 3000);
        } else if (params.data === 'USuccess') {
          this.userlistMessage = 'User Updated Successfully';
          setTimeout(() => { this.userlistMessage = '' }, 3000);
        }
        else if (params.data === 'DSuccess') {

        }
      }
    })

  }
  options = {
    dom: "Bfrtip",
    ajax: (data, callback, settings) => {
      this.http.get(endponitConfig.USER_API_ENDPOINT + 'getAllUsers', { headers: this.headers })
        .map(this.extractData)
        .catch(error => {
          // In a real world app, we might use a remote logging infrastructure
          // We'd also dig deeper into the error to get a better message
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          console.error(errMsg); // log to console instead

          // this.navigateToLogin( this.errorMessage)
          localStorage.setItem('status', '401')
          // 401 unauthorized response so log user out of client
          window.location.href = '/#/error';
          return Observable.throw(errMsg);
        })
        .subscribe((data) => {
          callback({
            aaData: data,
          })
        })
    },
    columns: [
      { data: 'id', responsivePriority: 5 }, { data: 'name', responsivePriority: 3 }, { data: 'email', responsivePriority: 1 }, { data: 'phone', responsivePriority: 4 }, {
        data: null,
        orderable: false,
        className: "editcenter",
        //  defaultContent: '<a  class="editor_edit">Edit</a>'
        defaultContent: '<a class="editor_edit"> <i class="fa fa-edit"></i></a> / <a  class="editor_remove"><i class="fa fa-trash-o"></i></a>',
        responsivePriority: 2
      }
    ],
    rowCallback: (row: Node, data: any | Object, index: number) => {

      const self = this;
      // Unbind first in order to avoid any duplicate handler
      // (see https://github.com/l-lin/angular-datatables/issues/87)
      $('td', row).unbind('click');

      $('a.editor_edit', row).bind('click', () => {
        self.editUser(data);
      });

      $('a.editor_remove', row).bind('click', () => {
        if (data.id == Number(localStorage.getItem('userData'))) {
          window.alert("Logged in User can not be deleted")
        } else {
          this.userService.deleteUser(data.id).subscribe(
            data => {

              if (data.error == null) {
                $('td', row).parents('tr').remove();
                console.log("Success")
                this.userlistMessage = 'User Deleted Successfully';
                setTimeout(() => { this.userlistMessage = '' }, 3000);
              } else {
                this.userlistMessage = data.error.message;
                setTimeout(() => { this.userlistMessage = '' }, 3000);
              }


            },
            error => {
              console.log("Error")
            });
        }
      });
      return row;
    },
  };





  // Edit a User record
  public editUser(user: any) {
    let link = ['/admin/users/editUser', user.id];
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
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
