var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var HomePage = require('../../Resources/PageObjects/HomePage.js');
var Checkout = require('../../Resources/PageObjects/Checkout.js');
var CommonFunctions = require('../../Resources/Utility/CommonFunctions.js');

var EC = protractor.ExpectedConditions;

describe('Checkout Page Verification', function () {

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

    it('Check that Mandatory Form Fields are mandatory', async function () {
        await console.log('Test case: Check that Mandatory Form Fields are mandatory')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.checkFirstNameRequired();
      
    });

   
    afterEach(function () {
        browser.sleep(500);
    });

});
