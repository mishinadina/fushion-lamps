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

    it('Check iput type for "Year" field', async function () {
		await Branch.checkYearFormat();
    }); 
        
    it('Verify that all "Choose File" options are mandatory', async function () {
        await Branch.verifyChooseFile1();
        await Branch.verifyChooseFile2();
        await Branch.verifyChooseFile3();
		await Branch.verifyChooseFile4();
    });  
    
    it('Upload document Vehicle Front', async function () {
        await Branch.chooseFile(1);
    });  
    
    it('Upload document  Left Side', async function () {
        await Branch.chooseFile(2);
    });  
    
    it('Upload document Right Side', async function () {
        await Branch.chooseFile(3);
    });  
    
    it('Upload document Vehicle Back', async function () {
        await Branch.chooseFile(4);
    }); 
    
    it('Upload one document bigger than 20 MB', async function () {
        await Branch.chooseBigFile(1);
    });  
    
    it('Upload document bigger than 20 MB for all Choose file options', async function () {
        await Branch.chooseBigFileforAllSides(1);
	});  



	afterEach(function () {
		browser.sleep(500);
	});

});