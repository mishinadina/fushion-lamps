var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var SpecSheets = require('../../Resources/PageObjects/SpecSheets.js');


var EC = protractor.ExpectedConditions;

describe('Clicking on Spec Sheets', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await Home_Page.waitLogo();
		await Home_Page.clickSpecSheets();


	});

	//--------------------------------------------------------------------------------------//

	it('Check All Spec Sheets - Part 1', async function () {
		if (browser.browserName == 'chrome') {
		await SpecSheets.clickAllSpecSheets(1);
		}
	});

	it('Check All Spec Sheets - Part 2', async function () {
		if (browser.browserName == 'chrome') {
		await SpecSheets.clickAllSpecSheets(2);
		}
	});

	it('Verify "Filer Spec Sheets by Name" feature', async function () {
		await SpecSheets.verifyFilterSpecSheetsByName();
	});



})