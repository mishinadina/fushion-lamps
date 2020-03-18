var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var HomePage = require('../../Resources/PageObjects/HomePage.js');
var ViewCart = require('../../Resources/PageObjects/ViewCart.js');
var CommonFunctions = require('../../Resources/Utility/CommonFunctions.js');

var EC = protractor.ExpectedConditions;

describe('View Cart Page Verification', function () {

    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();
    

    beforeAll(function () {
    });

    beforeEach(async function () {
        await GUILib.goToURL_nonAngular(browser.params.URL);
        await browser.sleep(1000);
        await HomePage.clickSignUpClose();
        await HomePage.clickCookiesPopUp();
    });

    //-----------------------------------------TCs-----------------------------------------//

    it('Verify Product in Cart', async function () {
        await ViewCart.chooseRandomCategory();
        await ViewCart.verifyProductsCart();
    });

    afterEach(function () {
        browser.sleep(500);
    });

});