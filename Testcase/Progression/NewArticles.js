var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var NewArticles = require('../../Resources/PageObjects/NewArticles.js');


var EC = protractor.ExpectedConditions;

describe('New Articles Module', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
        await Home_Page.waitLogo();
        await Home_Page.clickNewArticles();
        await GUILib.waitUrl('https://fusion-lamps.com/resources/news-articles/')

	});

	//--------------------------------------------------------------------------------------//

	it('Click on all Articles ', async function () {
		await NewArticles.clickAllArticles();
	});
	



   
})