import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';
import { async } from '@angular/core/testing';

describe('Solar Framework', () => {
  let page: AppPage;
  let hostEndPoint = "http://localhost:4200";
  beforeEach(() => {
    page = new AppPage();
  });

  describe('On application starts', () => {

    it('User Should be on login page and it should contain project logo and project title', () => {

      page.navigateTo();

      expect<any>(page.getLogo()).toEqual(hostEndPoint + '/assets/img/solar.png');
      expect<any>(page.getTitle()).toEqual('Solar');
      expect( page.checkUSerLoggedIn()).toBeUndefined();

      expect<any>(element(by.css('app-login form header')).getText()).toEqual('Sign In');
    });

  });



});
