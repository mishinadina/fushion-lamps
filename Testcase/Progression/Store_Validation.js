var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Store = require('../../Resources/PageObjects/Store.js');


var EC = protractor.ExpectedConditions;

describe('Verification of <Store> Module', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await GUILib.logIn(browser.params.Username, browser.params.Password);
        await browser.sleep(1000);
        await Home_Page.clickStoreTab();
		
	});

	//-------------------------------------------------------------------------//

	it('Click on All Products in Store and verify there is no Products without image', async function () {
		await Store.clickFilter();
	});


	afterEach(function () {
		browser.sleep(500);
	});

});