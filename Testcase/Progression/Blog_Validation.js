var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var HomePage = require('../../Resources/PageObjects/HomePage.js');
var Blog = require('../../Resources/PageObjects/DiscoveryBlog.js');
var CommonFunctions = require('../../Resources/Utility/CommonFunctions.js');

var EC = protractor.ExpectedConditions;

describe('Mini Cart Window Verification', function () {

    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();
    



    beforeAll(function () {
    });

    beforeEach(async function () {
        await GUILib.goToURL_nonAngular(browser.params.URL);
        await browser.sleep(1000);
        await HomePage.clickSignUpClose();
        await HomePage.clickCookiesPopUp();
        await HomePage.clickDiscoverBlog();
    });

    //-----------------------------------------TCs-----------------------------------------//

    it('Test', async function () {
        await Blog.clickAllImages();
    });



    afterEach(function () {
        browser.sleep(500);
    });

});