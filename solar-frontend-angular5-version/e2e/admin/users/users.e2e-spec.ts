
import { browser, by, element, protractor } from 'protractor';
import { async } from '@angular/core/testing';
import { Authentication } from '../../authentication.po';
import { userPage } from './users.po';
import { global } from '../../global';
import { setTimeout } from 'timers';
import { expand } from 'rxjs/operator/expand';


describe('Users Module', () => {
    let EC = protractor.ExpectedConditions;
    let authentictionPage: Authentication;
    let userpage: userPage;
    beforeEach(() => {
        authentictionPage = new Authentication();
        userpage = new userPage();
    });

    it('User should be on login page', () => {

        authentictionPage.initialNavigateTo();
        browser.waitForAngular();
        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/login');
    })

    it('User should enter valid admin login credentials', () => {
        element(by.name('email')).sendKeys(global.ADMIN_EMAIL);
        element(by.name('password')).sendKeys(global.ADMIN_PASSWORD);

        element(by.buttonText('Sign in')).click();
        browser.waitForAngular();
        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/dashboard/analytics');

    })


    it('When user click on admin in side menu,Should navigate to admin page', () => {
        userpage.getAdminUser().click();
        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/admin/users');
    })

    it('Check user datatable is loaded', () => {
        let tableHeaders = userpage.getDataTableHeaders();
        expect<any>(tableHeaders).toEqual(["User ID", "User Name", "Mail Id", "Phone No", "Role", "Edit/Delete"]);
    })

    it('Check data table loaded with user list ', () => {

        let view: any = userpage.getTableEmptyRow().isPresent().then((result) => {
            //if result present in datatable
            if (!result) {
                let rowData = userpage.getFirstRowData();
                expect<any>(rowData).toBeDefined();
            } else {
                //if no results in datatable
                let emptyRowData = userpage.getEmptyRowData();
                expect<any>(emptyRowData).toEqual('No data available in table');
            }
        })
    })

    it('When click on add user button should navigate to add user page', () => {

        userpage.addUserButton().click();
        browser.waitForAngular();
        let url = browser.getCurrentUrl();
        expect(url).toMatch('/#/admin/users/adduser');

    })

    it('when click on cancel button in add user details page should navigate to list user page', () => {
        element(by.buttonText('Cancel')).click();
        browser.waitForAngular();
        let url = browser.getCurrentUrl();
        expect(url).toMatch('/#/admin/users');
    })

    describe('User add module', () => {

        it('should navigate to add user page', () => {
            userpage.addUserButton().click();
            browser.waitForAngular();
            let url = browser.getCurrentUrl();
            expect(url).toMatch('/#/admin/users/adduser');
        })
        it('should add user input details', () => {
            element(by.name('username')).sendKeys(global.USER_ADD_USERNAME);
            element(by.name('email')).sendKeys(global.USER_ADD_EMAIL);
            element(by.name('phone')).sendKeys(global.USER_ADD_PHONE);
            element(by.cssContainingText('option', global.USER_ADD_ROLE)).click();
        })

        it('Validating the Add button to add user details', () => {
            expect(element(by.buttonText('Add')).getAttribute('disabled')).toBeNull();
            element(by.buttonText('Add')).getAttribute('disabled').then((result) => {
                element(by.buttonText('Add')).click();
                //if (result === null) {
                browser.waitForAngular();
                const url = browser.getCurrentUrl();
                expect(url).not.toContain('/adduser/');

                // element(by.id('errorMessages')).isDisplayed().then((result) => {
                //     console.log(result)
                //     if (result) {
                //         browser.ignoreSynchronization = true;
                //         const errorRespData = element(by.css('section.text-center')).getText().then((text) => {
                //             return text;
                //         });
                //         //. if true error message will be displayed error message from service response
                //         expect<any>(errorRespData).toBeDefined();
                //         browser.ignoreSynchronization = false;
                //     } 
                // })
                // } else {
                //     describe('In valid add user credentials', () => { })

                // }

            })
        })



        it('Websocket notification should trigger if user added successfully', () => {
            element(by.id('divSmallBoxes')).isDisplayed().then((result) => {
                const notificationText = element(by.css('.SmallBox p')).getText();
                expect(notificationText).toMatch('is registered');
            })
        })
    })

    describe('User update module', () => {
        it('On click edit button should naviagate to edit page', () => {
            userpage.navigateToUsersPage().click();
            browser.waitForAngular();
            let view: any = userpage.getTableEmptyRow().isPresent().then((result) => {
                //if users present in datatable
                userpage.getEditUserButton().click();
                browser.waitForAngular();
                const url = browser.getCurrentUrl();
                expect(url).toMatch('/#/admin/users/editUser/');
            })
        })

        it('Should Update user details', () => {
            element(by.name('username')).clear().then(() => {
                element(by.name('username')).sendKeys(global.UPDATE_ADD_USERNAME);
            })
            element(by.name('phone')).clear().then(() => {
                element(by.name('phone')).sendKeys(global.UPDATE_ADD_PHONE);
            })

            element(by.cssContainingText('option', global.UPDATE_ADD_ROLE)).click();
        })

        it('Validating the Update button to Update user details', () => {
            expect(element(by.buttonText('Update')).getAttribute('disabled')).toBeNull();
            element(by.buttonText('Update')).getAttribute('disabled').then((result) => {
                element(by.buttonText('Update')).click();
                browser.waitForAngular();
                const url = browser.getCurrentUrl();
                expect(url).toMatch('/#/admin/users');
            })
        })
    })

    describe('User delete module', () => {
        it('On click delete icon in row should delete user', () => {
            userpage.navigateToUsersPage().click();
            browser.waitForAngular();
            let view: any = userpage.getTableEmptyRow().isPresent().then((result) => {
                //if users present in datatable

                userpage.getPagination().click();
                browser.waitForAngular();
                userpage.getDeleteUserButton().click();
                expect(element(by.css('section.text-center')).getText()).toBeDefined();
            })

        })

        it('Websocket notification should trigger if user deleted successfully', () => {
            element(by.id('divSmallBoxes')).isDisplayed().then((result) => {
                const notificationText = element(by.css('.SmallBox p')).getText();
                expect(notificationText).toMatch('is deleted');
                browser.waitForAngular();
            })
        })

        
        it('User table pagination check', () => {
            let paginations = userpage.getPaginations();
            expect<any>(Object.keys(paginations).length).toBeGreaterThan(2);
        })


        it('Search,When user enters key should find list of users based on key', () => {
            (userpage.getSearchInput()).sendKeys(global.UPDATE_ADD_USERNAME);
            let rowData = userpage.getFirstRowData();
            expect<any>(rowData).toMatch(global.UPDATE_ADD_USERNAME);

        })
    })


    // element(by.css('section.text-center')).isDisplayed().then((result) => {

    //     if (result) {
    //         browser.ignoreSynchronization = true;
    //         // const errorRespData = element(by.css('section.text-center')).getText().then((text) => {
    //         //     return text;
    //         // });

    //         //if true error message will be displayed error message from service response
    //         ///   expect<any>(errorRespData).toBeDefined();
    //         browser.ignoreSynchronization = false;
    //     } else {

    //         browser.waitForAngular();
    //         let url = browser.getCurrentUrl();
    //         expect(url).toMatch('/#/admin/users');
    //     }

    // })


    it('When user click on logout should navigate to logout', () => {
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(authentictionPage.logout()), 12000);
        authentictionPage.logout().click();
        browser.waitForAngular();
    })
})