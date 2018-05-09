
import { by, browser, element, promise } from 'protractor';
import * as moment from 'moment';

export class CalendarPage {

    naviateToCalendar() {
        return element(by.css('[routerlink = "/calendar"]'));
    }

    getTodayDate() {
        return element(by.css('td.fc-day.fc-today'));
    }

    getTodayDateValue() {
        return this.getTodayDate().getAttribute("data-date");
    }

    gePastDay() {
        let pastDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        return element(by.css('.fc-bg [data-date="' + pastDate + '"]'));

    }

    getFutureDay() {
        let futureDate = moment().add(1, 'days').format('YYYY-MM-DD');
        return element(by.css('.fc-bg [data-date="' + futureDate + '"]'));

    }

    getEventModalPopup() {
        return element(by.css('.addEvent h4.modal-title')).getText();
    }
    closeEventModalPopup() {
        return element(by.css('.addEvent button.close'));
    }

    calendarPrevButton() {
        return element(by.css('.Custom-calendar-buttons .btn .fa-chevron-left'));
    }
    calendarNextButton() {
        return element(by.css('.Custom-calendar-buttons .btn .fa-chevron-right'));
    }
    calendarheaderTitle() {
        return element(by.css('#calendar .fc-header-title')).getText();
    }

    FilterSettingsButton() {
        return element(by.css('.widget-toolbar .dropdown'));
    }

    filterModalTitle() {
        return element(by.css('.FilterDropDownAnimation header')).getText();
    }
    filterModalCloseButton() {
        return element(by.css('.FilterDropDownAnimation button.btn-warning'));
    }
    filterModalSubmitButton() {
        return element(by.css('.FilterDropDownAnimation button.btn-success'));
    }
    //  return elm.element(by.css('span span')).getText();
    getcreateEventPriorities(selectedPriorityIndex) {
        return element.all(by.css('#add-event-form div.btn-select-tick div')).get(selectedPriorityIndex).all(by.css('span span'));
    }

    getCreateEventModalNextPage(){
        return element(by.css('.addEvent .form-actions .next a'))
    }

    getAddEventButton(){
        return element(by.cssContainingText('.addEvent .form-actions .next a','Add Event'))
    }

   checkEventCreated(){
    return element.all(by.css('.fc-content-skeleton .fc-event-container .fc-event')).isPresent();
   }

   updateEvent(){
    return element.all(by.css('.fc-content-skeleton .fc-event-container .fc-event'));
   }

   getUpdateEventModalNextPage(){
    return element(by.css('.updateEvent .form-actions .next a'))
}

getupdateEventButton(){
    return element(by.cssContainingText('.updateEvent .form-actions .next a','Update Event'))
}

getUpdateModalPopup() {
    return element(by.css('.updateEvent h4.modal-title')).getText();
}

}