import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { TemplateModule } from '../template.module';
import { TemplateAddComponent } from './template.add.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { TemplateService } from '../service/template.service';
import { AppModule } from '../../../app.module';

describe('Add Template Component', () => {
    let component: TemplateAddComponent;
    let fixture: ComponentFixture<TemplateAddComponent>;

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, TemplateModule],
            declarations: [],
            providers: [
                { provide: TemplateService, useClass: templateServicedatastub },

            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TemplateAddComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([TemplateService], (injectService: TemplateService) => {
        // location = _location;
        // router = _router;
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    it('Add Template form is invalid when page loaded', () => {
        expect(component.templateForm.valid).toBeFalsy();
    });



    it('Add Template Name field validity', () => {
        let errors = {};
        let tname = component.templateForm.controls['tname'];
        expect(tname.valid).toBeFalsy();

        // USername field is required
        errors = tname.errors || {};
        expect(errors['required']).toBeTruthy();


        // Set USername to something correct
        tname.setValue("notifications");
        errors = tname.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
        expect(tname.valid).toBeTruthy();
    })


    it('Add Template Type field validity', () => {
        let errors = {};
        let ttype = component.templateForm.controls['ttype'];
        expect(ttype.valid).toBeFalsy();

        // Template Type field is required
        errors = ttype.errors || {};
        expect(errors['required']).toBeTruthy();

    })


    it('Checking Add Template Form Validity', () => {
        component.templateForm.controls['tname'].setValue('notifications');
        component.templateForm.controls['ttype'].setValue('text content');

        expect(component.templateForm.valid).toBeTruthy();
    })

    it('Submit the  Add Template details sucessfully', (done) => {

        component.templateForm.controls['tname'].setValue('notifications');
        component.templateForm.controls['ttype'].setValue('text content');

        expect(component.templateForm.valid).toBeTruthy();

            let template = {
            "name": "Test",
            "type" : "Email",
            "content" : false
        }
        localStorage.setItem('content',JSON.stringify("<p>hi solar</p>"))

       let templateServicedatastub = fixture.debugElement.injector.get(TemplateService);
        const spy = spyOn(templateServicedatastub, 'addTemplate').and.returnValue(Observable.of(mockAddTemplateResponse));
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.addTemplate(template);
        setTimeout(() => {
            expect(component.addTemplateResponse.data.name).toBe(component.template.name);
        }, 1000)
        setTimeout(() => {
            expect(navigateSpy).toHaveBeenCalledWith(['/admin/template/list']);
            done();
        }, 4500)

    })
   
    it('Button cancel go back to users page', () => {
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.goBack();
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/template/list']);

    })

})
let mockAddTemplateResponse = {
    "data": {
        "tname": "notifications",
        "ttype": "Email",
        "content": "websocket notifications"
    },
    "error": null,
    "code": 0
}

class templateServicedatastub {

    public addTemplate(value) {
        return Observable.of(mockAddTemplateResponse);
    }
}