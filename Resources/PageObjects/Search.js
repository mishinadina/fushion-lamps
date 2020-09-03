var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');

var Search = function () {
    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');

    //----------------------------------------------------------------------------------------//

    var SearchField = by.xpath("//input[@class='mySearch']")
    var Magnifier = by.xpath("//button[@type='submit']")
    var SearchWindow = by.xpath("//div[@id='quickResults']")
    var ProductName = "CLED5.5A19850ND"
    var SearchResultsName = by.xpath("//h3[text()='"+ProductName+"']")
    var ProductSeries = "A19 OMNI Dimming"
    var SearchResultsSeries = by.xpath("//small[text()='"+ProductSeries+"']")
    var ProductDesc = "LED Lamp"
    var SearchResultsDesc = by.xpath("//small[text()='"+ProductDesc+"']")

    //-----------------------------------Functions-----------------------------------//

    this.verifySearchByProductName = async function () {
        await GUILib.typeValue(SearchField, ProductName)
        await GUILib.waitforElement(SearchWindow)
        await browser.sleep(2000)
        await element(SearchResultsName).isPresent().then(async function (result) {
            expect(result).toBe(true);
        })
    }

    this.verifySearchBySeries = async function () {
        await GUILib.typeValue(SearchField, ProductName)
        await GUILib.waitforElement(SearchWindow)
        await browser.sleep(2000)
        await element.all(SearchResultsSeries).count().then(async function (count) {
            await expect(count).toBeGreaterThan(0);
        })
    }

    this.verifySearchByDesc = async function () {
        await GUILib.typeValue(SearchField, ProductName)
        await GUILib.waitforElement(SearchWindow)
        await browser.sleep(2000)
        await element.all(SearchResultsDesc).count().then(async function (count) {
            await expect(count).toBeGreaterThan(0);
        })
    }









}



module.exports = new Search;