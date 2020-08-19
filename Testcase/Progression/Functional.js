var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Account = require('../../Resources/PageObjects/Account.js');
var Store = require('../../Resources/PageObjects/Store.js');
var BusinessCards = require('../../Resources/PageObjects/BusinessCards.js');
var Cart = require('../../Resources/PageObjects/Cart.js');


describe('Testing Use Case Scenarios', function () {

    var GUILib = new GUILibrary();


    beforeAll(function () {
    });

    beforeEach(async function () {
        await GUILib.goToURL_nonAngular(browser.params.URL);
    });

    //-------------------------------------------------------------------------//

    it('Log as DM and add Random Product to Cart', async function () {
        await GUILib.logIn(browser.params.Username, browser.params.Password);
        await browser.sleep(1000);
        await Home_Page.clickStoreTab();
        await Store.addRandomItemToCart();
    });

    it('Log as BM and add Random Product to Cart', async function () {
        await GUILib.logIn(browser.params.UsernameBM, browser.params.PasswordBM);
        await browser.sleep(1000);
        await Home_Page.clickStoreTab();
        await Store.addRandomItemToCart();
    });

    // it('Log as DM, add Random Product to Cart and complete order', async function () {
    //     await GUILib.logIn(browser.params.Username, browser.params.Password);
    //     await browser.sleep(1000);
    //     await Home_Page.clickStoreTab();
    //     await Store.addRandomItemToCart();
    //     await Cart.completeCheckout();
    // });

    // it('Log as BM and add Random Product to Cart and complete order', async function () {
    //     await GUILib.logIn(browser.params.UsernameBM, browser.params.PasswordBM);
    //     await browser.sleep(1000);
    //     await Home_Page.clickStoreTab();
    //     await Store.addRandomItemToCart();
    //     await Cart.completeCheckout();
    // });

    // it('Log as BM, order Business Card, log as DM and approve the request ', async function () {
    //     await GUILib.logIn(browser.params.UsernameBM, browser.params.PasswordBM);
    //     await browser.sleep(1000);
    //     await Home_Page.clickBusinessCardsBox();
    //     await BusinessCards.changeNameTelAddCart();
    //     await Cart.completeCheckout();
    //     await GUILib.goToURL_nonAngular(browser.params.URL);   
    //     await GUILib.logIn(browser.params.Username, browser.params.Password);
    //     await Home_Page.clickAccountIcon();
    //     await Account.verifyTableApproval();
    // });

    // it('Log as BM, order Uniform, log as DM and approve the request ', async function () {
    //     await GUILib.logIn(browser.params.UsernameBM, browser.params.PasswordBM);
    //     await browser.sleep(1000);
    //     await Home_Page.clickStoreTab();
    //     await Store.addRandomItemToCart();
    //     await Cart.completeCheckout();
    //     await GUILib.goToURL_nonAngular(browser.params.URL);   
    //     await GUILib.logIn(browser.params.Username, browser.params.Password);
    //     await Home_Page.clickAccountIcon();
    //     await Account.verifyTableApproval(); 
    // });

})