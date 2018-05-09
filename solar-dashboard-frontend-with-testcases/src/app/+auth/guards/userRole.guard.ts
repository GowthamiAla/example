import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CanActivateChild } from '@angular/router';



@Injectable()
export class userRoleGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const userRole = localStorage.getItem('userRole');
        const roles = route.data['roles'] as Array<string>;
        let checkLoop = true;
        for (let i = 0; i < roles.length; i++) {
            if (checkLoop) {
                if (roles[i] === userRole) {
                    checkLoop = false;
                    return true;
                }
            }
        }
        this.router.navigate(['/login']);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const userRole = localStorage.getItem('userRole');
        const roles = route.data['roles'] as Array<string>;
        let checkLoop = true;
        for (let i = 0; i < roles.length; i++) {
            if (checkLoop) {
                if (roles[i] === userRole) {
                    checkLoop = false;
                    return true;
                }
            }
        }
        this.router.navigate(['/login']);
        return false;
    }
}
