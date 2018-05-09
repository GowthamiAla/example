import { Component, OnInit } from '@angular/core';
import { LayoutService } from "../../layout.service";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
declare var $: any;

@Component({
    selector: 'sa-collapse-menu',
    templateUrl: './collapse-menu.component.html'
})
export class CollapseMenuComponent {
    public enableBackButton: boolean = false;
    constructor(private layoutService: LayoutService, private location: Location, private router: Router) {
        //finding the current route to enable the back button
        this.router.events.subscribe(event => {

            let currentPath = this.location.path();
            if (currentPath != '/maps') {
                this.enableBackButton = true;
            } else {
                this.enableBackButton = false;
            }
        });
    }

    backButton() {
        this.location.back();

    }
    onToggle() {
        this.layoutService.onCollapseMenu()
    }
}
