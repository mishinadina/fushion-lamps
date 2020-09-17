var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Quote = require('../../Resources/PageObjects/Quote.js');


var EC = protractor.ExpectedConditions;

describe('Cart Module', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
        await Home_Page.waitLogo();
        await Home_Page.clickCart();
        await GUILib.waitUrl('https://fusion-lamps.com/view-quote')

	});

	//--------------------------------------------------------------------------------------//

	it('Verify Shop Products button', async function () {
		await Quote.verifyShopProductsButton();
	});

	it('Verify Shop Products button', async function () {
		await Quote.verifyShopProductsButton();
	});
	



   
})