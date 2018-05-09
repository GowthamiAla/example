import { browser, element, by } from 'protractor';

export class forgotPassword {
  navigateTo() {
    return browser.get('/#/forgot-password');
  }

  checkForgotPasswordPage() {
    return element(by.css('app-forgot form header')).getText();
  }


  CheckOtpPage() {
    return element(by.css('app-otp form header')).getText();
  }

  getCreateAccount() {
    return element(by.css('[routerlink="/register"]'));
  }

  checkCreateAccountPage() {
    return element(by.css('app-register form header')).getText();
  }


}
