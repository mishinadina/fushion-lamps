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

    // it('Add Products in Cart', async function () {
    //     await console.log('Test case: Add Products in Cart')
    //     await ViewCart.chooseRandomCategory();
    //     await ViewCart.verifyProductsCart();
    // });

    // it('Delete Products from Cart', async function () {
    //     await console.log('Test case: Delete Products from Cart')
    //     await ViewCart.chooseRandomCategory();
    //     await ViewCart.deleteProductsCart();
    // });

    // it('Check Number of Item in Cart Icon after deleting Product from Cart', async function () {
    //     await console.log('Test case: Check Number of Item in Cart Icon after deleting Product from Cart')
    //     await ViewCart.chooseRandomCategory();
    //     await ViewCart.chooseRandomCategory();
    //     await ViewCart.deleteProductsCartCheckIcon();
    // });

    // it('Check Name of deleting Item in Green Alert', async function () {
    //     await console.log('Test case: Check Name of deleting Item in Green Alert')
    //     await ViewCart.chooseRandomCategory();
    //     await ViewCart.checkGreenAlertNameProduct();
    // });

    // it('Click Undo Button from Green Alert', async function () {
    //     await console.log('Test case: Click Undo Button from Green Alert')
    //     await ViewCart.chooseRandomCategory();
    //     await ViewCart.clickUndoGreenAlert();
    // });

    // xit('Check Number of Items in Cart Icon after clicking Undo Button from Green Alert', async function () {
    //     await console.log('Test case: Check Number of Items in Cart Icon after clicking Undo Button from Green Alert')
    //     await ViewCart.chooseRandomCategory();
    //     await ViewCart.clickUndoCheckIcon();
    // });

    // it('Clicking on Plus and Minus buttons', async function () {
    //     await console.log('Test case: Clicking on Plus and Minus buttons')
    //     await ViewCart.chooseRandomCategory();
    //     await ViewCart.clickPlusMinus();
    // });

    it('Check Number of Items in Cart Icon after clicking Update Cart Button', async function () {
        await console.log('Test case: Check Number of Items in Cart Icon after clicking Update Cart Button')
        await ViewCart.chooseRandomCategory();
        await ViewCart.clickUpdateCartBtn();
    });

    // it('Click on Continue Shopping Button', async function () {
    //     await console.log('Test case: Click on Continue Shopping Button')
    //     await ViewCart.chooseRandomCategory();
    //     await ViewCart.clickContinueShoppingBtn();
    // });

    // it('Click on Continue Shipping & Checkout Button', async function () {
    //     await console.log('Test case: Click on Continue Shipping & Checkout Button')
    //     await ViewCart.chooseRandomCategory();
    //     await ViewCart.clickShippingCheckoutBtn();
    // });

 



  


    afterEach(function () {
        browser.sleep(500);
    });

});