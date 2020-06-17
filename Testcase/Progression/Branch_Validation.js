var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Branch = require('../../Resources/PageObjects/Branch.js');


var EC = protractor.ExpectedConditions;

describe('Verification Company Signage Module', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await GUILib.logIn(browser.params.Username, browser.params.Password);
        await browser.sleep(1000);
        await Home_Page.clickBranchCompanySignage();
		
	});

	//-------------------------------------------------------------------------//

	it('Company Signage for Property Owned', async function () {
		await Branch.fillPropertyOwned();
    });
    
    it('Company Signage for Landlord Owned', async function () {
		await Branch.fillLandlordOwned();
    });    
    
    it('Verify that Email or Tel Format is required for "Owner Email or Phone Number" field', async function () {
		await Branch.checkEmailTelFormat();
    });  
    
    it('Verify that "Owner Email or Phone Number" field is mandatory', async function () {
		await Branch.verifyOwnerContactsFieldMandatory();
	});  

	afterEach(function () {
		browser.sleep(500);
	});

});

describe('Verification Vehicle Branch Module', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await GUILib.logIn(browser.params.Username, browser.params.Password);
        await browser.sleep(1000);
        await Home_Page.clickVehicleSignageBox();
		
	});

	//-------------------------------------------------------------------------//
    
    it('Verify that "Make/Model" field is mandatory', async function () {
		await Branch.verifyMakeModelMandatory();
    });  
    
    it('Verify that "Year" field is mandatory', async function () {
		await Branch.verifyYearMandatory();
    });  
        
    it('Verify that all "Choose File" options are mandatory', async function () {
        await Branch.verifyChooseFile1();
        await Branch.verifyChooseFile2();
        await Branch.verifyChooseFile3();
		await Branch.verifyChooseFile4();
    });  
    
    it('Upload document', async function () {
        await Branch.chooseFile();
	});  


	afterEach(function () {
		browser.sleep(500);
	});

});