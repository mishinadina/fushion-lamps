var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var HomePage = require('../../Resources/PageObjects/HomePage.js');
var ShopAll = require('../../Resources/PageObjects/ShopAll.js');

var EC = protractor.ExpectedConditions;

describe('Shop All page Verification', function () {

    var GUILib = new GUILibrary();



    beforeAll(function () {
    });

    beforeEach(async function () {
        await GUILib.goToURL_nonAngular(browser.params.URL);
        await browser.sleep(1000);
        await HomePage.clickSignUpClose();
        await HomePage.clickCookiesPopUp();
    });

    //-----------------------------------------TCs-----------------------------------------//

    it('Click All Products', async function () {
        await ShopAll.chooseRandomCategory();
        await ShopAll.clickAllProducts();
    });

    it('Add All Products to Cart', async function () {
        await ShopAll.chooseRandomCategory();
        await ShopAll.addAllProducts();
    });

    it('Verify Product in Cart', async function () {
        await ShopAll.chooseRandomCategory();
        await ShopAll.verifyProductsCart();
    });


    afterEach(function () {
        browser.sleep(500);
    });

});