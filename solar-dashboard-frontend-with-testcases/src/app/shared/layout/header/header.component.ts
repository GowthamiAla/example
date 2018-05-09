import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HealthJsonApiService } from './health.service';
import { AuthService } from '../../../+auth/auth.service';

declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
  styles: [`.headerLogo { padding-top: 10px;
    padding-right: 2px;}`]
})
export class HeaderComponent implements OnInit {

  public state: any

  constructor(private router: Router, private healthJsonApiService: HealthJsonApiService, private authService: AuthService) {
  }

  ngOnInit() {
  }


  searchMobileActive = false;

  toggleSearchMobile() {
    this.searchMobileActive = !this.searchMobileActive;

    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  homeView() {
    let userRole=localStorage.getItem('userRole');
    if (userRole != 'DCMANAGER') {
    this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    this.router.navigate(['/miscellaneous/search']);

  }
}
