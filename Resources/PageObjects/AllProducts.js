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


    //-----------------------------------Functions-----------------------------------//


    this.clickAllPages = async function () {
        await GUILib.waitforElement(LastPage)
        await GUILib.getText(LastPage).then(async function (count) {
            await console.log(count) 
                for (var n = 1; n < count; n++) {   
                    await GUILib.waitforElement(SortByCategory)
                    var Page = by.xpath('//*[@class="paginate"]/*[text()='+n+']');
                    await GUILib.scrollToElement(Page)
                    await GUILib.clickObject(Page)
                    await console.log("Page " + n + " is clicked")     
                    await CF.clickAllProducts();           
                }
        })
    }
}



module.exports = new AllProducts;