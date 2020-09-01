var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Account = require('../../Resources/PageObjects/MyAccount.js');


var EC = protractor.ExpectedConditions;

describe('Account Module', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
        await Home_Page.waitLogo();
        await Home_Page.clickAccount();
        await GUILib.waitUrl('https://fusion-lamps.com/my-account/')


	});

	//--------------------------------------------------------------------------------------//

	it('Log In - Positive', async function () {
		await Account.LogInPos();
    });
    
    it('Log In - Negative', async function () {
		await Account.LogInNeg();
    });
    
    it('Click on "Register" link', async function () {
		await Account.Register();
    });
    
    it('Click on "Forgot Password?" link', async function () {
		await Account.ForgotPassword();
    });
    
    it('Click on "Sign Out" tab', async function () {
        await Account.LogInPos();
		await Account.clickSignOut();
    });

    it('Click on "My Account" tab', async function () {
		await Account.clickMyAccount();
	});
    
    it('Click on "My Orders" tab', async function () {
		await Account.clickMyOrders();
    });
    
    it('Click on "Saved Items" tab', async function () {
		await Account.clickSavedItems();
    });
    
    it('Click on "My Templates" tab', async function () {
		await Account.clickMyTemplates();
    });
    
    it('Click on "My Templates" tab', async function () {
		await Account.clickMyTemplates();
	});





    
})