var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');


var EC = protractor.ExpectedConditions;

describe('Clicking on Home Page buttons', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await browser.sleep(1000);
		await Home_Page.clickSignUpClose();
		await Home_Page.clickCookiesPopUp();
		
	});

	//-----------------------------------------First Navigation Tabs TCs--------------------------//


	it('Click Facebook', async function () {
		await Home_Page.clickFacebook();
	});

	it('Click Instagram', async function () {
		await Home_Page.clickInstagram();
	});

	it('Click Twitter', async function () {
		await Home_Page.clickTwitter();
	});

	it('Click Shop All', async function () {
		await Home_Page.clickShopAll();
	});

	it('Click Skin DD Body', async function () {
		await Home_Page.clickSkinBody();
	});

	it('Click Skin Footer Body', async function () {
		await Home_Page.clickBodyFooter();
	});

	it('Click Skin DD Face', async function () {
		await Home_Page.clickSkinFace();
	});

	it('Click Skin Footer Face', async function () {
		await Home_Page.clickFaceFooter();
	});

	it('Click Skin DD Aloe', async function () {
		await Home_Page.clickSkinAloe();
	});

	it('Click Skin Footer Aloe', async function () {
		await Home_Page.clickAloeFooter();
	});

	it('Click Sun DD Sprays & Lotions', async function () {
		await Home_Page.clickSunSprays();
	});

	it('Click Sun Footer Sprays & Lotions', async function () {
		await Home_Page.clickSpraysFooter();
	});

	it('Click Sun DD AfterSun', async function () {
		await Home_Page.clickSunAfterSun();
	});

	it('Click Sun Footer AfterSun', async function () {
		await Home_Page.clickAfterSunFooter();
	});

	it('Click Sun DD Tanning', async function () {
		await Home_Page.clickSunTanning();
	});

	it('Click Sun Footer Tanning', async function () {
		await Home_Page.clickTanningFooter();
	});

	it('Click Health DD AloeJuice', async function () {
		await Home_Page.clickHealthAloeJuice();
	});

	it('Click Health Footer AloeJuice', async function () {
		await Home_Page.clickAloeJuiceFooter();
	});

	it('Click Household DD Cleaning', async function () {
		await Home_Page.clickHouseholdCleaning();
	});

	it('Click Household Footer Cleaning', async function () {
		await Home_Page.clickCleaningFooter();
	});

	it('Click Discover DD AboutUs', async function () {
		await Home_Page.clickDiscoverAboutUs();
	});

	it('Click Discover DD Ingredients', async function () {
		await Home_Page.clickDiscoverIngredients();
	});

	it('Click Discover DD Blog', async function () {
		await Home_Page.clickDiscoverBlog();
	});

	it('Click Facebook Footer', async function () {
		await Home_Page.clickFacebookFooter();
	});

	it('Click Twitter Footer', async function () {
		await Home_Page.clickTwitterFooter();
	});

	it('Click Instagram Footer', async function () {
		await Home_Page.clickInstagramFooter();
	});

	it('Click Google Address', async function () {
		await Home_Page.clickGoogleAddress();
	});

	it('Check Phone Link', async function () {
		await Home_Page.checkPhoneLink();
	});

	it('Click ETC Link', async function () {
		await Home_Page.clickETCLink();
	});

	it('Click Footer FOTE Link', async function () {
		await Home_Page.clickFooterLink();
	});

	it('Click FOTE Logo Link', async function () {
		await Home_Page.clickLogo();
	});

	it('Click Privacy Policy', async function () {
		await Home_Page.clickPrivacyPolicy();
	});

	it('Click Terms & Conditions', async function () {
		await Home_Page.clickTermsConditions();
	});

	it('Check Arrow "Next" in Carousel', async function () {
		await Home_Page.clickArrowNext();
	});

	it('Check Arrow "Prev" in Carousel', async function () {
		await Home_Page.clickArrowPrev();
	});

	it('Click Shop Button #1', async function () {
		await Home_Page.clickShopBtn1();
	});

	it('Click Shop Button #2', async function () {
		await Home_Page.clickShopBtn2();
	});

	it('Click Read More Button', async function () {
		await Home_Page.clickReadMoreBtn();
	});

	it('Click Learn More Button #1', async function () {
		await Home_Page.clickLearnMoreBtn1();
	});

	it('Click Learn More Button #2', async function () {
		await Home_Page.clickLearnMoreBtn2();
	});

	it('Click Shop Button #3', async function () {
		await Home_Page.clickShopBtn3();
	});

	it('Click Arrow Next Carousel', async function () {
		await Home_Page.clickArrowNextCarousel();
	});

	it('Click Arrow Prev Carousel', async function () {
		await Home_Page.clickArrowPrevCarousel();
	});



	





	





	







	

	


	afterEach(function () {
		browser.sleep(500);
	});

});