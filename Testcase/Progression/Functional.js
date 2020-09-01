var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Account = require('../../Resources/PageObjects/MyAccount.js');
var Product = require('../../Resources/PageObjects/Product.js');
var Quote = require('../../Resources/PageObjects/Quote.js');
var Expectations = require('../../Resources/PageObjects/Expectations.js');


var EC = protractor.ExpectedConditions;

describe('Functional Scenarios', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
        await Home_Page.waitLogo();
	});

	//--------------------------------------------------------------------------------------//

	it('Saving Product to "Saved Items" list', async function () {
        await Home_Page.clickAccount();
        await Account.LogInPos();
        await Home_Page.clickAllProducts();
        await Product.clickProduct();
        //await Product.clickSelectProduct();
        await Product.clickAddToQuote();
        await Product.clickViewYourQuote();
        await Quote.clickSaveProductLater();
        await Quote.verifySaveProductLater();
        await Home_Page.clickAccount();
        await Account.clickSavedItems();
        await Account.expectSavedProducts()
    });

    it('Saving Template to "Your Templates" list', async function () {
        await Home_Page.clickAccount();
        await Account.LogInPos();
        await Home_Page.clickAllProducts();
        await Product.clickProduct();
        //await Product.clickSelectProduct();
        await Product.clickAddToQuote();
        await Product.clickViewYourQuote();
        await Quote.clickCreateTemplate();
        await Quote.fillTemplatesFields();
        await Quote.clickSaveTemplateBtn();
        await Quote.verifySaveTemplate();
        await Quote.clickViewAllTemplatesBtn();
        await Quote.verifyYourTemplates();
    });
      
})