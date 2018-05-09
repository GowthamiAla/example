import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing"
import { Router, ActivatedRoute } from "@angular/router";
import { TemplateModule } from '../template.module';
import { TemplateListComponent } from './template.list.component';
import { Observable } from 'rxjs/Observable';
import { TemplateService } from '../../services/template.service';
import { AppModule } from '../../../app.module';

describe('List template Component', () => {
    let component: TemplateListComponent;
    let fixture: ComponentFixture<TemplateListComponent>;

    beforeEach((() => {


        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, TemplateModule],
            declarations: [],
            providers: [
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TemplateListComponent);
        component = fixture.componentInstance;
    });

    

        it('should create a component', () => {
        expect(component).toBeTruthy();
    });

   

     it('On Update Template icon Should navigate to Update Template page', () => {
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        let template = {
            "id": 22
        }
        component.editTemplate(template);
        expect(navigateSpy).toHaveBeenCalledWith(['/admin/template/editTemplate', template.id]);

    });



})

