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

    this.compareQuantity = async function () {
     
    }





}



module.exports = new Cart_Form;