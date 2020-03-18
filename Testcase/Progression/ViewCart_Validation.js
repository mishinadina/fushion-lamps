var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var HomePage = require('../../Resources/PageObjects/HomePage.js');
var ViewCart = require('../../Resources/PageObjects/MiniCart.js');
var CommonFunctions = require('../../Resources/Utility/CommonFunctions.js');

var EC = protractor.ExpectedConditions;

describe('View Cart Window Verification', function () {

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

    it('Type Item Quantity and check this number in MiniCart', async function () {
        await MiniCart.chooseRandomCategory();
        await MiniCart.clickRandomProduct();
        await MiniCart.fillQuantityMiniCart()
    });

    it('Add Items to Cart and check Names in MiniCart', async function () {
        await MiniCart.chooseRandomCategory();
        await MiniCart.verifyProductsMiniCart()
    });

    it('Delete Items using MiniCart Window', async function () {
        await MiniCart.chooseRandomCategory();
        await MiniCart.clickRandomProduct()
        await MiniCart.deleteFromMiniCart();
    });


    afterEach(function () {
        browser.sleep(500);
    });

});