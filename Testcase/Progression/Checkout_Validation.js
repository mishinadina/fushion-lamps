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

    it('Check Subscription Box', async function () {
        await console.log('Test case: Check Subscription Boxn')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.checkSubscriptionBox();
    });

    it('Click on Edit Button', async function () {
        await console.log('Test case: Click on Edit Button')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.clickEditLink();
    });

    it('Click on Terms & Conditions Link', async function () {
        await console.log('Test case: Click on Terms & Conditions Link')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.clickTermsLink();
    });

    it('Check the list of Products in Summary module', async function () {
        await console.log('Test case: Check the list of Products in Summary module')
        await Checkout.chooseRandomCategory();
        await Checkout.checkProductListSummary();
    });

    it('Check the link of Product in Summary module', async function () {
        await console.log('Test case: Check the list of Products in Summary module')
        await Checkout.chooseRandomCategory();
        await Checkout.checkProductLinkSummary();
    });

    it('Check box Ship to a Different Address', async function () {
        await console.log('Test case: Check box Ship to a Different Address')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.clickShipDifferentAddress();
    });

    it('Check Alert while incorrect input of ZIP Field of Billing Details Form', async function () {
        await console.log('Test case: Check Alert while incorrect input of ZIP Field of Billing Details Form')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.checkZipAlert();
    });

    it('Check Alert while incorrect input of Phone Field of Billing Details Form', async function () {
        await console.log('Test case: Check Alert while incorrect input of Phone Field of Billing Details Form')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.checkPhoneAlert();
    });

    it('Check Alert while incorrect input of Email Field of Billing Details Form', async function () {
        await console.log('Test case: Check Alert while incorrect input of Email Field of Billing Details Form')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.checkEmailAlert();
    });

    it('Check Terms & Conditions Alert while stay this box unchecked', async function () {
        await console.log('Test case: Check Terms & Conditions Alert while stay this box unchecked')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.checkTermsConditionsAlert();
    });

    it('Fill Billing Form with correct inputs', async function () {
        await console.log('Test case: Fill Billing Form with correct inputs')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.fillBillingForm();
    });

    it('Fill Shipping Form with correct inputs', async function () {
        await console.log('Test case: Fill Shipping Form with correct inputs')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.fillShippingForm();
    });

    it('Check Alert while incorrect input of ZIP Field of Shipping Details Form', async function () {
        await console.log('Test case: Check Alert while incorrect input of ZIP Field of Shipping Details Form')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.checkZipAlertShippingForm();
    });

    xit('Check Link to Product on Order Pay Webpage', async function () {
        await console.log('Test case: Check Link to Product on Order Pay Webpage')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.checkLinkOrderPayForm();
    });

    it('Check Credit Card Pay Form', async function () {
        await console.log('Test case: Check Credit Card Pay Form')
        await Checkout.chooseRandomCategory();
        await Checkout.clickShippingCheckoutBtn();
        await Checkout.checkCreditCardPayForm();
    });









    afterEach(function () {
        browser.sleep(500);
    });

});
