var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Account = require('../../Resources/PageObjects/Account.js');


var EC = protractor.ExpectedConditions;

describe('Verification Company Signage Module', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await GUILib.logIn(browser.params.Username, browser.params.Password);
        await browser.sleep(1000);
        await Home_Page.clickAccountIcon();
		
	});

	//-------------------------------------------------------------------------//

	it('Click "Log Out" button and verify result', async function () {
		await Account.clickLogOut();
    });

    it('Click "Edit" button and verify that there is no DB elements on <Your Addresses> Webpage', async function () {
        await Account.clickEdit();
        await Account.checkNoDBinfo();
    });

    it('Type new value in First name field, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyNewName();
    });

    
   

	afterEach(function () {
		browser.sleep(500);
	});

});
