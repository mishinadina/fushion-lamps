var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var CounterDay_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();
    var fs = require('fs');
    var n;
    var y;

    
    var Lunch = by.xpath("//*[@id='Collection']/div/div/div/ul/li[" + n + "]/div/div[5]/a")
    var ProductList = by.xpath('//*[@id="ProductSection-product-template"]/div/div/div[2]')

    var Quantity = by.xpath('//*[@id="counter-day-form"]/div[1]/div/table/tbody/tr[1]/td[4]/input')
    var QuantityLines = by.xpath('//*[@data-label="Quantity"]')
    var QuantityName = by.xpath('//*[@id="counter-day-form"]/div[1]/div/table/tbody/tr[1]/td[4]/input')

    var Logo = by.xpath('//*[@id="shopify-section-header"]/div/header/div/div[1]/div/a/img')

    var Error404 = by.xpath('//*[text()="404 Page Not Found"]')

    var AddToCartBtn = by.xpath('//*[@id="counter-day-form"]/div[2]/div[3]/button[2]')
    var ViewCartBtn = by.xpath('/html/body/div[2]/div/div[2]/div[2]/a')
    var CartNotificationAdded = by.xpath("//*[text()='This item has been added to your cart.']")
    var boolean;

    var Vendors = by.xpath('//*[@id="vendors"]')
    var StartHourOptions = by.xpath("//*[@id='start-hour']")
    var StartMinuteOptions = by.xpath("//*[@id='start-minute']")
    var EndHourOptions = by.xpath("//*[@id='end-hour']")
    var EndMinuteOptions = by.xpath("//*[@id='end-minute']")
    var Calendar = by.xpath("//*[@id='date']")
    var NextMonth = by.xpath("//div[@role='calendar']//div/div[3]/i")
    var DateCalendar = by.xpath("//div[@role='calendar']//div/table/tbody/tr[1]/td[1]")

    var ContinueShopping = by.xpath('/html/body/div[2]/div/div[2]/div[1]/button')

    //----------------------------------------------------------------------------------------//

    this.clickBreakfast = async function (n) {
        var Breakfast = by.xpath("//*[@id='Collection']/div/div/div/ul/li[" + n + "]/div/div[3]/a")
        await GUILib.clickObject(Breakfast)
        await GUILib.waitforElement(QuantityName)
    }

    


}



module.exports = new CounterDay_Form;