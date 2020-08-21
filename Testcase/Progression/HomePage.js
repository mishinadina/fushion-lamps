var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');


var EC = protractor.ExpectedConditions;

describe('Clicking on Home Page buttons', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await Home_Page.waitLogo();


	});

	//--------------------------------------------------------------------------------------//

	it('Click Logo', async function () {
		await Home_Page.clickLogo();
	});

	it('Click Account', async function () {
		await Home_Page.clickAccount();
	});

	it('Click Cart', async function () {
		await Home_Page.clickCart();
	});

	it('Click Home Tab', async function () {
		await Home_Page.clickHome();
	});

	//--------------------------------------------------------------------------------//

	it('Click Our Barands - TamCo', async function () {
		await Home_Page.clickTamCoLink();
	});

	//--------------------------------------------------------------------------------//

	it('Click About Us', async function () {
		await Home_Page.clickAboutUs();
	});

	it('Click All Products', async function () {
		await Home_Page.clickAllProducts();
	});

	it('Click Spec Sheets', async function () {
		await Home_Page.clickSpecSheets();
	});

	it('Click Where To Buy', async function () {
		await Home_Page.clickWhereToBuy();
	});

	it('Click New Articles', async function () {
		await Home_Page.clickNewArticles();
	});

	it('Click Contact Us', async function () {
		await Home_Page.clickContactUs();
	});

	//--------------------------------------------------------------------------------//

	it('Click Led Lamps', async function () {
		await Home_Page.clickLedLamps();
	});

	it('Click Led Tubes', async function () {
		await Home_Page.clickLedTubes();
	});

	it('Click Fluorescent Tubes', async function () {
		await Home_Page.clickFluorescentTubes();
	});

	it('Click Compact Fluorescent', async function () {
		await Home_Page.clickCompactFluorescent();
	});

	it('Click Incandescent', async function () {
		await Home_Page.clickIncandescent();
	});

	it('Click Halogen', async function () {
		await Home_Page.clickHalogen();
	});

	it('Click HID Lamps', async function () {
		await Home_Page.clickHidLamps();
	});

	it('Click Ballast & Acc', async function () {
		await Home_Page.clickBallastAcc();
	});

	//--------------------------------------------------------------------------------//

	it('Verify Tel Link opens Tel application', async function () {
		await Home_Page.clickTel();
	});

	//--------------------------------------------------------------------------------//

	it('Click Footer Led Lamps', async function () {
		await Home_Page.clickFooterLedLamps();
	});

	it('Click Footer Led Tubes', async function () {
		await Home_Page.clickFooterLedTubes();
	});

	it('Click Footer Fluorescent Tubes', async function () {
		await Home_Page.clickFooterFluorescentTubes();
	});

	it('Click Footer Compact Fluorescent', async function () {
		await Home_Page.clickFooterCompactFluorescent();
	});

	it('Click FooterIncandescent', async function () {
		await Home_Page.clickFooterIncandescent();
	});

	it('Click Footer Halogen', async function () {
		await Home_Page.clickFooterHalogen();
	});

	it('Click Footer HID Lamps', async function () {
		await Home_Page.clickFooterHidLamps();
	});

	it('Click Footer Ballast & Acc', async function () {
		await Home_Page.clickFooterBallastAcc();
	});

	//--------------------------------------------------------------------------------//

	it('Click Footer Home Tab', async function () {
		await Home_Page.clickFooterHome();
	});

	it('Click Footer About Us', async function () {
		await Home_Page.clickFooterAboutUs();
	});

	it('Click Footer All Products', async function () {
		await Home_Page.clickFooterAllProducts();
	});

	it('Click Footer Spec Sheets', async function () {
		await Home_Page.clickFooterSpecSheets();
	});

	it('Click Footer Where To Buy', async function () {
		await Home_Page.clickFooterWhereToBuy();
	});

	it('Click Footer New Articles', async function () {
		await Home_Page.clickFooterNewArticles();
	});

	it('Click Footer Contact Us', async function () {
		await Home_Page.clickFooterContactUs();
	});

	//--------------------------------------------------------------------------------//

	it('Click Facebook icon', async function () {
		await Home_Page.clickFacebook();
	});

	// it('Click Linkedin icon', async function () {
	// 	await Home_Page.clickLinkedin();
	// });

	//--------------------------------------------------------------------------------//

	it('Click Footer Tamco Group Link', async function () {
		await Home_Page.clickFooterTamcoGroupLink();
	});

	it('Click Footer Terms Conditions', async function () {
		await Home_Page.clickFooterTermsConditions();
	});

	it('Click Footer Privacy Policy', async function () {
		await Home_Page.clickFooterPrivacyPolicy();
	});

	it('Click Footer Eighty Three Creative', async function () {
		await Home_Page.clickFooterEightyThreeCreative();
	});

	afterEach(function () {
		browser.sleep(500);
	});

});