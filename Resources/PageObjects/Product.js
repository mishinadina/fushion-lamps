var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');

var Product = function () {
    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');

    //----------------------------------------------------------------------------------------//
   
    var Product = by.xpath("//*[@id='grid']/div[1]/div/a")
    var AddToQuote = by.xpath('//input[@value="Add To Quote"]')
    var SelectProduct = by.xpath('//select[@name="product_id"]')
    var AddMore = by.xpath("//a[text()='Add More']")
    var ViewYourQuote = by.xpath("//a[text()='View Your Quote']")

    var SortByCategory = by.xpath("//*[@id='productMain']//h4[text()='Sort By']")
    var Image = by.xpath("//div[@id='product__image']//a[contains(href, png)]")
    var Desc = by.xpath("//div[@id='product__details']//h2")
    var Error404 = by.xpath("//h1[text()='404 Not Found']")
    var Logo = by.xpath('//*[@id="logo"]/div[2]/a/img')

    var LastPage = by.xpath('//*[@id="productMain"]/div/div[2]/div[3]/a[3]')


    //-----------------------------------Functions-----------------------------------//


    this.clickProduct = async function () {
        await GUILib.waitforElement(Product)
        await GUILib.scrollToElement(Product)  
        await GUILib.clickObject(Product)  
    }

    this.clickSelectProduct = async function () {
        await GUILib.selectFromDropdown(SelectProduct, '1')
    }

    this.clickAddToQuote = async function () {
        await GUILib.clickObject(AddToQuote)  
    }

    this.clickViewYourQuote = async function () {
        await GUILib.clickObject(ViewYourQuote)  
    }





}



module.exports = new Product;