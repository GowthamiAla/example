import { by, browser, element, promise } from 'protractor';

export class userPage {

    getAdminUser() {
        return element(by.css('li [title="Admin"]'))
    }

    navigateToUsersPage(){
        return element(by.css('a[routerlink="/admin/users"]'));
    }

    getDataTableHeaders() {
        var headers = element.all(by.css('table.dataTable thead th')).map((elm) => {
            return elm.getText();
        });
        return headers
    }
    getDatatableBody() {
        return element(by.css('table.dataTable tbody'));
    }

    getTableRows() {
        return this.getDatatableBody().all(by.tagName('tr'));
    }

    getTableEmptyRow() {
        return this.getDatatableBody().all(by.tagName('tr .dataTables_empty'));
    }

    getEmptyRowData(): promise.Promise<string> {
        return this.getTableEmptyRow().get(0).getText();
    }

    getFirstRowData(): promise.Promise<string> {
        return this.getTableRows().get(0).all(by.tagName('td')).get(1).getText();
    }

    getEditUserButton() {
        return this.getTableRows().get(0).all(by.css('td .editor_edit'));
    }
    getPagination(){
        return element.all(by.css('.pagination li')).get(5).all(by.css('a'));
    }

    getDeleteUserButton() {
        return this.getTableRows().get(0).all(by.css('td .editor_remove'));
    }

    
    addUserButton() {
        return element(by.css('[routerlink="/admin/users/adduser"]'));
    }


    getPaginations() {
        var paginations = element.all(by.css('.pagination li')).map((elm) => {
            return elm.element(by.css('a')).getText();
        });
        return paginations
    }

    getSearchInput() {
      return  element(by.css('[type="search"]'));
    }
    
   


}