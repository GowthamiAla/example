
import { forgotPassword } from './forgot.po';
import { browser, by, element } from 'protractor';
import { async } from '@angular/core/testing';
import { global } from '../../global';
describe('Forgot Password Page ', () => {
    let page: forgotPassword;
    let hostEndPoint = "http://localhost:4200";
    beforeEach(() => {
        page = new forgotPassword();
    });

    it('User Should be in forgot password page', () => {
        page.navigateTo();
        expect<any>(page.checkForgotPasswordPage()).toEqual('Forgot Password');
    })

    it('validating the password credentials and nagivate to otp page', () => {

        element(by.name('email')).sendKeys(global.ADMIN_EMAIL);
        element(by.name('phone')).sendKeys(global.ADMIN_PHONE);
        element(by.buttonText('Confirm with OTP')).click();
        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/otp');

        expect<any>(page.CheckOtpPage()).toEqual('User Registration Confirmation with OTP');
        //to get back to previous page
        browser.navigate().back();
    })

    it('When click on create account should navigate to create account page', () => {
        page.getCreateAccount().click();
        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/register');
        expect<any>(page.checkCreateAccountPage()).toEqual('User Registration');
        //to get back to previous page
        browser.navigate().back();
    })


})