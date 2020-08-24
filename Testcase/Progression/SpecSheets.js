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

	it('Click All Spec Sheets', async function () {
		await SpecSheets.clickAllSpecSheets();
	});


    
})