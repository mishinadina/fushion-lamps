var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var BusinessCards = require('../../Resources/PageObjects/BusinessCards.js');


var EC = protractor.ExpectedConditions;

describe('Verification Business Cards Module', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await GUILib.logIn(browser.params.Username, browser.params.Password);
        await browser.sleep(1000);
        await Home_Page.clickBusinessCardsBox();
		
	});

	//-------------------------------------------------------------------------//

	it('Choose name from dropdown and verify that this NAME appears in Business Card sample', async function () {
		await BusinessCards.verifyNames();
    });

    it('Choose name from dropdown and verify that new EMAIL appears in Business Card sample', async function () {
		await BusinessCards.verifyEmails();
    });

    it('Choose Company Name from dropdown and verify that new COMPANY NAME appears in Business Card sample', async function () {
		await BusinessCards.verifyCompanyNames();
    });

    it('Choose Title from dropdown and verify that new TITLE appears in Business Card sample', async function () {
		await BusinessCards.verifyCompanyTitle();
    });

    it('Type Name and verify that new Name appears in Business Card sample', async function () {
		await BusinessCards.verifyNameInput();
    });

    it('Type Street Address and verify that new Street Address appears in Business Card sample', async function () {
		await BusinessCards.verifyStreetAddress();
    });

    it('Choose State from dropdown and verify that new State appears in Business Card sample', async function () {
		await BusinessCards.verifyState();
    });

    it('Choose State from dropdown and verify that new State appears in Business Card sample', async function () {
		await BusinessCards.verifyZipCodeNumeric();
    });

    it('Type Phone number and verify that new PHONE NUMBER appears in Business Card sample', async function () {
		await BusinessCards.verifyPhoneNumeric();
    });

    it('Type Telephone Extesion and verify that new EXTESION appears in Business Card sample', async function () {
		await BusinessCards.verifyTelExNumeric();
    });

    it('Type Fax number and verify that new FAX appears in Business Card sample', async function () {
		await BusinessCards.verifyFaxNumeric();
    });

    it('Type Cell number and verify that new CELL appears in Business Card sample', async function () {
		await BusinessCards.verifyCell();
    });

    it('Type Email and verify that new EMAIL appears in Business Card sample', async function () {
		await BusinessCards.verifyEmailInput();
    });

    it('Change the name and add Business Card order to Cart', async function () {
		await BusinessCards.changeNameTelAddCart();
    });
    
    
    
	afterEach(function () {
		browser.sleep(500);
	});

});

