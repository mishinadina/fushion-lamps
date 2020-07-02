var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Account = require('../../Resources/PageObjects/Account.js');


var EC = protractor.ExpectedConditions;

describe('Verification of <My Account> Module', function () {

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

    it('Type new value in FIRST NAME field, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyNewName(1);
    });

    it('Click "Add a New Address" button, type new value in FIRST NAME field, click "Add Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyNewName(2);
    });

    it('Type new value in LAST NAME field, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyLastName(1);
    });

    it('Click "Add a New Address" button, type new value in LAST NAME field, click "Add Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyLastName(2);
    });

    it('??? Type new value in EMAIL field, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyEmail();
    });

    it('Type new value in COMPANY field, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyCompany(1);
    });

    it('Click "Add a New Address" button, type new value in COMPANY field, click "Add Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyCompany(2);
    });

    it('Type new value in ADDRESS field, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyAddress();
    });

    it('Type new value in APARTMENT field, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyApt();
    });

    it('Type new value in CITY field, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyCity();
    });

    it('Choose Random STATE from dropdown, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyState();
    });

    it('Type new value in POSTAL/ZIP CODE field, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyZip();
    });

    it('Choose Random COUNTRY from dropdown, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyCountry();
    });

    it('Type new value in PHONE field, click "Update Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyPhone();
    });

     it('Open <Edit Adress> Module, click "Cancel" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyCancelBtn();
    });

     it('Open <Edit Adress> Module, click "Return to Account Details" link and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyReturnAccountDetailsLink();
    });

    it('Open <Edit Adress> Module, click "Add a New Address" button and verify result', async function () {
        await Account.clickEdit();
        await Account.verifyAddNewAddressBtn();
    });



	afterEach(function () {
		browser.sleep(500);
	});

});
