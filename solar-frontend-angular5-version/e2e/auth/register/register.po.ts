import { browser, element, by } from 'protractor';

export class registerPage {

    navigateTo() {
        return browser.get('/#/register');
    }

    checkregisterPage() {
        return element(by.css('app-register form header')).getText();
    }

    checkUserLoginPage() {
        return element(by.css('app-login form header')).getText();
    }

    CheckOtpPage() {
        return element(by.css('app-otp form header')).getText();
    }

    getLoginPage(){
        return element(by.css('[routerlink="/login"]'));
    }

    
}