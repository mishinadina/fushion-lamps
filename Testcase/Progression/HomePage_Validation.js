var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');


var EC = protractor.ExpectedConditions;

describe('Clicking on Home Page buttons', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await GUILib.logIn(browser.params.Username, browser.params.Password);
		await browser.sleep(1000);
		
	});

	//-----------------------------------------First Navigation Tabs TCs--------------------------//

	it('Test', async function () {
		await Home_Page.logOut();
	});

	it('Test', async function () {
		await Home_Page.logOut();
	});

	it('Test', async function () {
		await Home_Page.logOut();
	});

	it('Test', async function () {
		await Home_Page.logOut();
	});

	it('Test', async function () {
		await Home_Page.logOut();
	});

	it('Test', async function () {
		await Home_Page.logOut();
	});

	it('Test', async function () {
		await Home_Page.logOut();
	});

	it('Test', async function () {
		await Home_Page.logOut();
	});

	




	afterEach(function () {
		browser.sleep(500);
	});

});