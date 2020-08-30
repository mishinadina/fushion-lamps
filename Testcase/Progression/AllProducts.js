var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Test = require('../../Resources/PageObjects/AllProducts.js');


var EC = protractor.ExpectedConditions;

describe('Clicking on All Products', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
        await Home_Page.waitLogo();
        await Home_Page.clickAllProducts();


	});

	//--------------------------------------------------------------------------------------//

	it('Check All Products', async function () {
		await Test.clickAllPages();
	});


    
})