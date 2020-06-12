var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');


var EC = protractor.ExpectedConditions;

describe('Clicking on Home Page buttons', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await GUILib.logIn(browser.params.Username, browser.params.Password);
		await browser.sleep(1000);
		
	});

	//-----------------------------------------First Navigation Tabs TCs--------------------------//

	// it('Click Event - Counter Tab', async function () {
	// 	await Home_Page.clickEventCounterTab();
	// });

	// it('Click Branch - Company Signage', async function () {
	// 	await Home_Page.clickBranchCompanySignage();
	// });

	// it('Click Branch - Vehicle Signage', async function () {
	// 	await Home_Page.clickBranchVehicleSignage();
	// });

	// it('Click Employee - Business Cards', async function () {
	// 	await Home_Page.clickEmployeeBusinessCards();
	// });

	// it('Click Employee - Uniforms', async function () {
	// 	await Home_Page.clickEmployeeUniforms();
	// });

	// it('Click Store Tab', async function () {
	// 	await Home_Page.clickStoreTab();
	// });

	// it('Click Contact Us Tab', async function () {
	// 	await Home_Page.clickContactUsTab();
	// });

	// it('Click Road Map Tab', async function () {
	// 	await Home_Page.clickRoadMap();
	// });

	// it('Click Log Out Tab', async function () {
	// 	await Home_Page.clickLogOutTab();
	// });

	// it('Click Search Icon', async function () {
	// 	await Home_Page.clickSearchIcon();
	// });

	// it('Click Account Icon', async function () {
	// 	await Home_Page.clickAccountIcon();
	// });

	// it('Click Cart Icon', async function () {
	// 	await Home_Page.clickCartIcon();
	// });

	// it('Click Branch Box', async function () {
	// 	await Home_Page.clickBranchBox();
	// });

	// it('Click Business Cards Box', async function () {
	// 	await Home_Page.clickBusinessCardsBox();
	// });

	// it('Click Get Custom Quote Box', async function () {
	// 	await Home_Page.clickContactUsBox();
	// });

	// it('Click Apparel Box', async function () {
	// 	await Home_Page.clickApparelBox();
	// });

	// it('Click Uniforms Box', async function () {
	// 	await Home_Page.clickUniformsBox();
	// });

	// it('Click Vehicle Signage Box', async function () {
	// 	await Home_Page.clickVehicleSignageBox();
	// });

	// it('Click Counter Box', async function () {
	// 	await Home_Page.clickCounterBox();
	// });

	// it('Click Company Signage Box', async function () {
	// 	await Home_Page.clickCompanySignageBox();
	// });

	it('Click Hot Sellers', async function () {
		await Home_Page.clickHotSellers();
	});

	


	

	


	afterEach(function () {
		browser.sleep(500);
	});

});