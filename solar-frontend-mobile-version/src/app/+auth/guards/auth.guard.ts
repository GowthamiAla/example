import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CanActivateChild } from '@angular/router'
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser') && Number(localStorage.getItem('status')) != 401) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;

        // let roles = route.data["roles"] as Array<string>;
        // console.log(roles)
        // console.log(roles[0])
        // if (roles[0] == 'USER' && roles[1] == 'ADMIN') {
        //     return true;
        // }
        // else if (roles[0] == 'ADMIN') {
        //     return true;
        // }
        // return (roles == null || roles.indexOf("the-logged-user-role") != -1);


    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page
        this.router.navigate(['/error']);
        return false;
    }
}
