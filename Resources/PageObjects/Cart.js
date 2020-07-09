var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var Cart_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();
    var fs = require('fs');
    var n;
    var y;


    var QuantityName = by.xpath('//*[@id="counter-day-form"]/div[1]/div/table/tbody/tr[1]/td[4]/input')
    var QuantityNameCart = by.xpath('//*[@class="cart__itemDetails-td  text-left"]')
    var Checkout = by.xpath("//*[@value='Check out']")
    var ContinueShipping = by.xpath("//button[@id='continue_button']")
    var ContinuePayment = by.xpath("//*[@class='edit_checkout']//button")
    var CompleteOrder = by.xpath("//*[@class='shown-if-js']//button")
    var ConfirmationStatus = by.xpath("//*[text()='Your order is confirmed']")

    var FirstName = by.xpath('//*[@placeholder="First name"]')
    var LastName = by.xpath('//*[@placeholder="Last name"]')
    var StreetAddress = by.xpath('//*[@placeholder="Address"]')
    var City = by.xpath('//*[@placeholder="City"]')
    var Zip = by.xpath('//*[@placeholder="ZIP code"]')

    this.getQuantityItemsBundle = async function () {
        await element.all(QuantityLines).count().then(async function (lines) {
            return lines;
        })
    }

    this.getQuantityItemsBundleCart = async function () {
        await element.all(QuantityNameCart).count().then(async function (linesCart) {
            return linesCart;
        })
    }

    this.completeCheckout = async function () {
        await GUILib.clickObject(Checkout)
        await GUILib.waitforElement(FirstName)
        await GUILib.typeValue(FirstName, 'Test')
        await GUILib.typeValue(LastName, 'Test')
        await GUILib.typeValue(StreetAddress, 'Test')
        await GUILib.typeValue(City, 'Test')
        await GUILib.scrollToElement(ContinueShipping)
        await GUILib.typeValue(Zip, '76010')
        await GUILib.clickObject(ContinueShipping)
        await GUILib.clickObject(ContinuePayment)
        await GUILib.clickObject(CompleteOrder)
        await GUILib.waitforElement(ConfirmationStatus)
    }





}



module.exports = new Cart_Form;