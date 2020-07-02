var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Cart = require('../../Resources/PageObjects/Cart.js');
var CounterDay = require('../../Resources/PageObjects/CounterDay.js');


var EC = protractor.ExpectedConditions;

describe('Verification <Cart> Module', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await GUILib.logIn(browser.params.Username, browser.params.Password);
        await browser.sleep(1000);
        await Home_Page.clickEventCounterTab();
		
	});

	//-------------------------------------------------------------------------//

	it('Add Bundle to the Cart', async function () {
        await CounterDay.clickBreakfast(1);
		await CounterDay.fillBundleInfo();
        
    });
    
     
	afterEach(function () {
		browser.sleep(500);
	});

});