import { by, browser, element } from 'protractor';

export class Authentication {

    initialNavigateTo() {
        return browser.get('/');
    }

    logout(){
        return element(by.css('#logout [routerlink="/login"]'));
    }

   

   
}