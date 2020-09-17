var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');

var AllProducts = function () {
    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');

    //----------------------------------------------------------------------------------------//
    var Product = by.xpath("//*[@class='product filtr-item']")
    var SortByCategory = by.xpath("//*[@id='productMain']//h4[text()='Sort By']")
    var Image = by.xpath("//div[@id='product__image']//a[contains(href, png)]")
    var Desc = by.xpath("//div[@id='product__details']//h2")
    var Error404 = by.xpath("//h1[text()='404 Not Found']")
    var Logo = by.xpath('//*[@id="logo"]/div[2]/a/img')

    var LastPage = by.xpath('//*[@id="productMain"]/div/div[2]/div[3]/a[3]')

    var FilterField = by.xpath("//input[@class='textfield filter__search js-shuffle-search']")
    var ProductName = "LED"
    var ProductElement = by.xpath("//h3[@class='item__title']")


    //-----------------------------------Functions-----------------------------------//


    this.clickAllPages = async function () {
        await GUILib.waitforElement(LastPage)
        await GUILib.getText(LastPage).then(async function (count) {
            await console.log(count)
            for (var n = 1; n < count; n++) {
                await GUILib.waitforElement(SortByCategory)
                var Page = by.xpath('//*[@class="paginate"]/*[text()=' + n + ']');
                await GUILib.scrollToElement(Page)
                await GUILib.clickObject(Page)
                await console.log("Page " + n + " is clicked")
                await CF.clickAllProducts();
            }
        })
    }

    this.verifyFilerProductsByName = async function () {
        var Arr = [];
        var Arr1 = []

        await element.all(ProductElement).count().then(async function (count) {
            await console.log(count)
            for (var n = 1; n <= count; n++) {
                elementText = by.xpath('//*[@id="grid"]/div[' + n + ']/div/a/h3')
                await GUILib.getText(elementText).then(async function (text) {
                    await Arr.push(text)
                })
            }
            await GUILib.typeValue(FilterField, ProductName)
            await browser.sleep(2000)
            await element.all(ProductElement).count().then(async function (count1) {
                await console.log(count1)
                for (var n = 1; n <= count1; n++) {
                    elementText = by.xpath('//*[@id="grid"]/div[' + n + ']/div/a/h3')
                    await GUILib.getText(elementText).then(async function (text) {
                        await Arr1.push(text)
                    })
                }
                await expect(Arr).not.toEqual(Arr1)
            })
        })
    }
}



module.exports = new AllProducts;