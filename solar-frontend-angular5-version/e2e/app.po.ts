import { browser, element, by } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitle() {
    return element(by.css('app-root header .logoName')).getText();
  }

  getLogo(){
    return element(by.css('app-root header img')).getAttribute('src');
  }


  checkUSerLoggedIn(){
    let loginStatus=browser.executeScript("return window.localStorage.getItem('currentUser');");

  }


}
