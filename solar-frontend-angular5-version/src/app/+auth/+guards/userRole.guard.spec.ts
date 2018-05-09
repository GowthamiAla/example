import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import { Router, RouterStateSnapshot, Route, UrlSegment, Params, Data, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { userRoleGuard } from './userRole.guard';



describe('User Role Guard:', () => {
    let mockSnapshot: any = jasmine.createSpyObj<RouterStateSnapshot>("RouterStateSnapshot", ['toString']);
    let userguard: userRoleGuard;

    let MockrouteData: any = { data: { roles: ['ADMIN', 'DCMANAGER', 'USER'] } }

    let router = {
        navigate: jasmine.createSpy('navigate')
    };

    // async beforeEach
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, CommonModule, HttpModule],
            providers: [userRoleGuard,
                { provide: Router, useValue: router },
                { provide: RouterStateSnapshot, useValue: mockSnapshot },
                { provide: ActivatedRoute, useValue: MockrouteData }
            ]
        })
            .compileComponents(); // compile template and css
    }));


    // synchronous beforeEach
    beforeEach(() => {
        userguard = TestBed.get(userRoleGuard);
    });

  
        it('canActivate:If User logged in as Admin return true', () => {
            localStorage.setItem('userRole', 'ADMIN');
            expect(userguard.canActivate(MockrouteData, mockSnapshot)).toBe(true);
        })

        it('canActivateChild:If User logged in as Admin return true', () => {
            expect(userguard.canActivateChild(MockrouteData, mockSnapshot)).toBe(true);
        })

        it('canActivate:If User logged in as DC manager return true', () => {
            localStorage.setItem('userRole', 'DCMANAGER');
            expect(userguard.canActivate(MockrouteData, mockSnapshot)).toBe(true);
        })

        it('canActivateChild:If User logged in as DC manager return true', () => {
            expect(userguard.canActivateChild(MockrouteData, mockSnapshot)).toBe(true);
        })

        it('canActivate:If User logged in as DC manager return true', () => {
            localStorage.setItem('userRole', 'USER');
            expect(userguard.canActivate(MockrouteData, mockSnapshot)).toBe(true);
        })

        it('canActivateChild:If User logged in as DC manager return true', () => {
            expect(userguard.canActivateChild(MockrouteData, mockSnapshot)).toBe(true);
        })

        it('canActivate:If User logged in as anonymous return false', () => {
            localStorage.removeItem('userRole');
            expect(userguard.canActivate(MockrouteData, mockSnapshot)).toBe(false);
        })

        it('canActivateChild:If User logged in as anonymous return false', () => {
            expect(userguard.canActivateChild(MockrouteData, mockSnapshot)).toBe(false);
        })
})





