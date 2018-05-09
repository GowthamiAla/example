
import { browser, by, element } from 'protractor';
import { Authentication } from '../authentication.po';
import { global } from '../global';
import { CalendarPage } from './calendar.po';
import { calendar } from 'ngx-bootstrap/chronos/moment/calendar';
import * as moment from 'moment';

describe('Calendar module', () => {
    let authentictionPage: Authentication;
    let calendarPage: CalendarPage;

    beforeEach(() => {
        authentictionPage = new Authentication();
        calendarPage = new CalendarPage();
    })


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

    it('When user click on Calendar in side menu,Should navigate to Calendar page', () => {
        calendarPage.naviateToCalendar().click();
        const url = browser.getCurrentUrl();
        expect<any>(url).toMatch('/#/calendar');

    })

    it('Check today is present in calendar and highlighted', () => {
        expect<any>(calendarPage.getTodayDateValue()).toBe(moment().format('YYYY-MM-DD'));
    })

    it('calendar subheader backbutton to navigate previous dates', () => {
        calendarPage.calendarPrevButton().click();
        var prevMonthTitle = moment().subtract(1, 'months').format('MMMM YYYY');
        expect<any>(calendarPage.calendarheaderTitle()).toBe(prevMonthTitle);
    })

    it('calendar subheader backbutton to navigate previous dates', () => {
        calendarPage.calendarNextButton().click();
        var currentMonthTitle = moment().format('MMMM YYYY');
        expect<any>(calendarPage.calendarheaderTitle()).toBe(currentMonthTitle);
    })

    it('When user click on today date should open a modal to add event', () => {
        //  browser.pause();
        browser.waitForAngular();
        calendarPage.getTodayDate().click();
        expect<any>(calendarPage.getEventModalPopup()).toEqual('Create Event');
    })
    it('closing the today add event popup', () => {
        calendarPage.closeEventModalPopup().click();
        browser.waitForAngular();
        expect<any>(calendarPage.getEventModalPopup()).toBe('');
    })

    it('When User click on setings button dropdown filter should open', () => {
        calendarPage.FilterSettingsButton().click();
        expect<any>(calendarPage.filterModalTitle()).toBe('Filter');
    })
    it('When User click on cancel button Filter modal should close', () => {
        calendarPage.filterModalCloseButton().click();
        expect<any>(calendarPage.filterModalTitle()).toBe('');
    })

    it('Changing the calendar view to week view', () => {
        calendarPage.FilterSettingsButton().click();
        element(by.css('option[value="agendaWeek"]')).click();
        calendarPage.filterModalSubmitButton().click();
    })

    it('Changing the calendar view to day view', () => {
        calendarPage.FilterSettingsButton().click();
        element(by.cssContainingText('.FilterDropDownAnimation option', 'Day')).click();
        calendarPage.filterModalSubmitButton().click();
    })

    it('Changing the calendar view to List Month Events view', () => {
        calendarPage.FilterSettingsButton().click();
        element(by.cssContainingText('.FilterDropDownAnimation option', 'List Month Events')).click();
        calendarPage.filterModalSubmitButton().click();
    })

    it('Changing the calendar view to List Week Events  view', () => {
        calendarPage.FilterSettingsButton().click();
        element(by.cssContainingText('.FilterDropDownAnimation option', 'List Week Events')).click();
        calendarPage.filterModalSubmitButton().click();
    })

    it('Changing the calendar view to month view', () => {
        calendarPage.FilterSettingsButton().click();
        element(by.css('option[value="month"]')).click();
        calendarPage.filterModalSubmitButton().click();
    })

    it('When user click on past date should not open an add event modal', () => {
        calendarPage.gePastDay().click();
        expect<any>(calendarPage.getEventModalPopup()).toBe('');
    })

    it('When user click on future date should open an add event modal', () => {
        calendarPage.getFutureDay().click();
        expect<any>(calendarPage.getEventModalPopup()).toBe('Create Event');
    })

    it('closing the future date add event popup', () => {
        calendarPage.closeEventModalPopup().click();
        expect<any>(calendarPage.getEventModalPopup()).toBe('');
        browser.waitForAngular();
    })



    it('Adding an Event in calendar', () => {
        //  console.log(global.CALENDAR_EVENT_CREATE_DATE)
        browser.waitForAngular();
        calendarPage.getFutureDay().click();
        browser.waitForAngular();
        expect<any>(calendarPage.getEventModalPopup()).toBe('Create Event');
        element(by.cssContainingText('[name="createEventType"] option', global.CALENDAR_CREATE_SELECT_EVENT_TYPE)).click();
        element(by.name('createEventTitle')).sendKeys(global.CALENDAR_CREATE_EVENT_TITLE);
        element(by.name('createEventDescription')).sendKeys(global.CALENDAR_CREATE_EVENT_DESCRIPTION);
        calendarPage.getcreateEventPriorities(global.CALENDAR_CREATE_SELECT_PRIORITY).click();
        calendarPage.getCreateEventModalNextPage().click();
        calendarPage.getCreateEventModalNextPage().click();
        calendarPage.getAddEventButton().click();
        let todayDate = calendarPage.getTodayDateValue();
        expect(calendarPage.checkEventCreated()).toBeTruthy();
    })

    it('Update event in calendar', () => {
        browser.waitForAngular();
        calendarPage.updateEvent().click();
        browser.waitForAngular();
        expect<any>(calendarPage.getUpdateModalPopup()).toBe('Update Event');
        calendarPage.getUpdateEventModalNextPage().click();
        calendarPage.getUpdateEventModalNextPage().click();
        calendarPage.getupdateEventButton().click();
        expect<any>(calendarPage.getUpdateModalPopup()).toBe('');
    })
})