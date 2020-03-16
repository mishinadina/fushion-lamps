var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var HomePage = require('../../Resources/PageObjects/HomePage.js');
var Product = require('../../Resources/PageObjects/Product.js');

var EC = protractor.ExpectedConditions;

describe('Product page Verification', function () {

    var GUILib = new GUILibrary();


    beforeAll(function () {
    });

    beforeEach(async function () {
        await GUILib.goToURL_nonAngular(browser.params.URL);
        await browser.sleep(1000);
        await HomePage.clickSignUpClose();
        await HomePage.clickCookiesPopUp();
        await HomePage.clickShopAll();

    });

    //-----------------------------------------TCs-----------------------------------------//

    it('Check Product Menu', async function () {
        await Product.clickRandomProduct();
    });

    it('Add More Items by Clicking Plus Sign', async function () {
        await Product.chooseRandomCategory();
        await Product.clickRandomProduct();
        await Product.addMoreQuantity();
    });

    it('Add Less Items by Clicking Minus Sign', async function () {
        await Product.clickRandomProduct();
        await Product.addLessQuantity();
    });

    it('Fill Quantity and Check Number in Minicart', async function () {
        await Product.clickRandomProduct();
        await Product.fillQuantityMiniCart();
    });

    it('Fill Quantity and Check Number in Cart', async function () {
        await Product.clickRandomProduct();
        await Product.fillQuantityCart();
    });

    it('Click Reviews Rating Stars', async function () {
        await Product.clickRandomProduct();
        await Product.clickReviewsRating();
    });

    it('Check if Your Review is Required Field', async function () {
        await Product.clickRandomProduct();
        await Product.checkReviewRequired();
    });

    it('Check if Name is Required Field', async function () {
        await Product.clickRandomProduct();
        await Product.checkNameRequired();
    });

    it('Check if Your Review is Required Field', async function () {
        await Product.clickRandomProduct();
        await Product.checkEmailRequired();
    });

    it('Check Text in Green Notice after adding Item to the Cart', async function () {
        await Product.clickRandomProduct();
        await Product.checkGreenAlertText();
    });

    it('Check Results after clicking on "View Cart" Button in Green Notice after adding Item to the Cart', async function () {
        await Product.clickRandomProduct();
        await Product.checkGreenAlertCart();
    });

    it('Check Results after clicking Arrow Next in Carousel of Recommended Products', async function () {
        await Product.clickRandomProduct();
        await Product.clickArrowNextCarousel();
    });

    it('Check Results after clicking Arrow Previous in Carousel of Recommended Products', async function () {
        await Product.clickRandomProduct();
        await Product.clickArrowPrevCarousel();
    });

    it('Click on All Items in Carousel of Recommended Products', async function () {
        await Product.clickRandomProduct();
        await Product.clickRandomItemCarousel();
    });

    




    afterEach(function () {
        browser.sleep(500);
    });

});