import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router, ActivatedRoute } from "@angular/router";
import { TemplateModule } from '../template.module';
import { TemplateEditComponent } from './template.edit.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { TemplateService } from '../service/template.service';
import { AppModule } from '../../../app.module';


describe('Edit template Component', () => {
    let component: TemplateEditComponent;
    let fixture: ComponentFixture<TemplateEditComponent>;
    let routerMock;
    let routerSpy: any;
    beforeEach((() => {

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, TemplateModule],
            declarations: [],
            providers: [
                { provide: ActivatedRoute, useValue: { 'params': Observable.of({ 'templateId': 1 }) } },
                { provide: TemplateService, useClass: templateServicedatastub },


            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TemplateEditComponent);
        component = fixture.componentInstance;
    });

    beforeEach(inject([TemplateService], (injectService: TemplateService) => {
        // location = _location;
        // router = _router;
    }));

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    it('On ngOnInit get the Template details', ((done) => {
        fixture = TestBed.createComponent(TemplateEditComponent);
        component = fixture.componentInstance;
        let templateServicedatastub = fixture.debugElement.injector.get(TemplateService);
        const spyTemplateData = spyOn(templateServicedatastub, 'getTemplatebyId').and.returnValue(Promise.resolve(mockUpdateTemplateResponse));
        fixture.detectChanges();
        setTimeout(() => {
            expect(component.template).toEqual(mockUpdateTemplateResponse.data);
            done();
        }, 2000)
    }));


    it('Update Template form is invalid when page loaded', () => {
        expect(component.templateForm.valid).toBeFalsy();
    });

    it('Update Template Name field validity', () => {
        let errors = {};
        let tname = component.templateForm.controls['tname'];
        expect(tname.valid).toBeFalsy();
        // name field is required
        errors = tname.errors || {};
        expect(errors['required']).toBeTruthy();


        // Set name to something correct
        tname.setValue("sample");
        errors = tname.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
    })

    it('Update Template Type field validity', () => {
        let errors = {};
        let ttype = component.templateForm.controls['ttype'];
        expect(ttype.valid).toBeFalsy();
        // type field is required
        errors = ttype.errors || {};
        expect(errors['required']).toBeTruthy();

    })

    it('Checking Update Template Form Validity', () => {

        component.templateForm.controls['tname'].setValue('sample');
        component.templateForm.controls['ttype'].setValue('example');

        expect(component.templateForm.valid).toBeTruthy();
    })

    it('Submit the Edit template details sucessfully and templates list called', (done) => {


        component.template = mockPostUpdateTemplate;

        localStorage.setItem('content', JSON.stringify("<p>hi solar</p>"))

        let templateServicedatastub = fixture.debugElement.injector.get(TemplateService);
        const spyUpdateTemplateData = spyOn(templateServicedatastub, 'updateTemplate').and.returnValue(Observable.of(mockUpdateTemplateResponse));
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.updateTemplate();

        setTimeout(() => {
            expect(component.templateUpdateResponse).toBe(mockUpdateTemplateResponse);
        }, 1000)
        setTimeout(() => {
            expect(navigateSpy).toHaveBeenCalledWith(['/admin/template/list']);
            done();
        }, 3500)

    })

    it('Back button go back to template page', () => {
        fixture = TestBed.createComponent(TemplateEditComponent);
        component = fixture.componentInstance;

        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.goBack();
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/template/list']);
    });



})

let mockUpdateTemplateResponse = {
    "data": {
        "id": 1,
        "name": "Email - New load",
        "type": "EMAIL",
        "content": "<p>New load ${loadNum} is created</p>"
    },
    "error": null,
    "code": 0
}

let mockPostUpdateTemplate = {
    "id": 1,
    "name": "Email - New load",
    "type": "EMAIL",
    "content": "<p>New load ${loadNum} is created</p>"
}



class templateServicedatastub {
    public updateTemplate(mockPostUpdateTemplate) {
        return Observable.of(mockUpdateTemplateResponse);
    }
    public getTemplatebyId(templateId) {
        return Promise.resolve(mockUpdateTemplateResponse);
    }
}
