var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');
var Search = require('../../Resources/PageObjects/Search.js');


var EC = protractor.ExpectedConditions;

describe('Verify functionality of "Search" Module from Home Page', function () {

    var GUILib = new GUILibrary();


    beforeAll(function () {
    });

    beforeEach(async function () {
        await GUILib.goToURL_nonAngular(browser.params.URL);
        await Home_Page.waitLogo();

    });

    //--------------------------------------------------------------------------------------//

    it('Verify Search by Product Name', async function () {
        await Search.verifySearchByProductName();
    }) 

    it('Verify Search by Series', async function () {
        await Search.verifySearchBySeries();
    })

    it('Verify Search by Description', async function () {
        await Search.verifySearchByDesc();
    })



});

