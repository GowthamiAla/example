import { browser, element, by } from 'protractor';

export class loginPage {

  navigateTo() {
    return browser.get('/#/login');
  }

  checkUserLoginPage(){
   return  element(by.css('app-login form header')).getText();
  }

  checkUSerLoggedIn(){
    let loginStatus=browser.executeScript("return window.localStorage.getItem('currentUser');");
  }

  getCreateAccount(){
      return element(by.css('[routerlink="/register"]'));
  }

  getForgotPassword(){
    return element(by.css('[routerlink="/forgot-password"]'));
}

  checkCreateAccountPage(){
      return element(by.css('app-register form header')).getText();
  }
 

  checkForgotPasswordPage(){
    return  element(by.css('app-forgot form header')).getText();
   }


}
