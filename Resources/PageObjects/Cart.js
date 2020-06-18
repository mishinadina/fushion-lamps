var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var Cart_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();
    var fs = require('fs');
    var n;
    var y;


    var Lunch = by.xpath("//*[@id='Collection']/div/div/div/ul/li[" + n + "]/div/div[5]/a")
    
    this.clickLunch = async function (n) {
        var BBQ = by.xpath("//*[@id='Collection']/div/div/div/ul/li[" + n + "]/div/div[4]/a")
        await GUILib.clickObject(BBQ)
        await GUILib.waitforElement(QuantityName)
    }

    

}



module.exports = new Cart_Form;