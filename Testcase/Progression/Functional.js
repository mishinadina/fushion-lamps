var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Account = require('../../Resources/PageObjects/Account.js');
var Store = require('../../Resources/PageObjects/Store.js');


describe('Testing Use Case Scenarios', function () {

    var GUILib = new GUILibrary();


    beforeAll(function () {
    });

    beforeEach(async function () {
        await GUILib.goToURL_nonAngular(browser.params.URL);
        await GUILib.logIn(browser.params.Username, browser.params.Password);
        await browser.sleep(1000);
    });

    //-------------------------------------------------------------------------//

    it('Buy Item', async function () {
        await Home_Page.clickStoreTab();
        await Store.addRandomItemToCart();
    });

})