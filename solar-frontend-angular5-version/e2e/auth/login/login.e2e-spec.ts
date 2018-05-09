
import { loginPage } from './login.po';
import { browser, by, element, protractor } from 'protractor';
import { async } from '@angular/core/testing';
import { global } from '../../global';
import { Authentication } from '../../authentication.po';

describe('Login Page ', () => {

    let page: loginPage;
    let authenticationPage: Authentication;
    let EC = protractor.ExpectedConditions;
    let hostEndPoint = "http://localhost:4200";

    beforeEach(() => {
        page = new loginPage();
        authenticationPage = new Authentication();
    });

    it('User Should be in login page', () => {

        page.navigateTo();

        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/login');

        expect<any>(page.checkUserLoginPage()).toEqual('Sign In');
    })

    it('When click on create account should navigate to create account page', () => {
        page.getCreateAccount().click();
        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/register');
        expect<any>(page.checkCreateAccountPage()).toEqual('User Registration');
        //to get back to previous page
        browser.navigate().back();
    })


    it('When click on forgot password should navigate to forgot password page', () => {

        page.getForgotPassword().click();

        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/forgot-password');

        expect<any>(page.checkForgotPasswordPage()).toEqual('Forgot Password');
        //to get back to previous page
        browser.navigate().back();
    })


    it('validating the admin credentials and nagivate to dashboard', () => {

        element(by.name('email')).sendKeys(global.ADMIN_EMAIL);
        element(by.name('password')).sendKeys(global.ADMIN_PASSWORD);

        element(by.buttonText('Sign in')).click();
        browser.waitForAngular();
        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('#/dashboard/analytics');

    })

    it('When user click on logout should navigate to logout', () => {
        browser.wait(EC.visibilityOf(authenticationPage.logout()), 2000);
        authenticationPage.logout().click();
        element(by.buttonText('Yes')).click();
    })

})