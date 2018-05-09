
import { registerPage } from './register.po';
import { browser, by, element } from 'protractor';
import { async } from '@angular/core/testing';
import { global } from '../../global';


describe('Forgot Password Page ', () => {
    let page: registerPage;

    beforeEach(() => {
        page = new registerPage();
    });

    it('User Should be in user registration page', () => {
        page.navigateTo();
        expect<any>(page.checkregisterPage()).toEqual('User Registration');
    })

    it('When user click on Sign In should navigate to sign in page', () => {

        page.getLoginPage().click();
        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/login');

        expect<any>(page.checkUserLoginPage()).toEqual('Sign In');
        //to get back to previous page
        browser.navigate().back();
    })


    it('validating the user registeration credentials and nagivate to otp page', () => {
        element(by.name('name')).sendKeys(global.NEW_REGISTER_NAME);
        element(by.name('email')).sendKeys(global.NEW_REGISTER_EMAIL);
        element(by.name('phone')).sendKeys(global.NEW_REGISTER_PHONE);

        element(by.buttonText('Register')).click();

        // for valid case it should naviagte to otp 
        // for testing we are mocking with registered credentials and expecting 
        // with already register response  uncomment below code for new case testing

        /* const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/otp');

       expect<any>(page.CheckOtpPage()).toEqual('User Registration Confirmation with OTP'); */


        /* below is for negative case */
        expect<any>(element(by.css('fieldset .icon-color-bad')).getText()).toEqual('User already exists');

    })


})