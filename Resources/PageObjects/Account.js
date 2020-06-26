var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var Account_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();
    var fs = require('fs');
    var n;
    var y;


    var LogOut = by.xpath('//*[@id="customer_logout_link"]')


    this.clickLogOut = async function () {
        await GUILib.clickObject(LogOut)
        await browser.wait(EC.not(EC.urlContains('account'),30000))
        await browser.sleep(1500);
        await browser.getCurrentUrl().then(async function (url) {
            expect(url).toContain('checkout')
        })
        
    }





}



module.exports = new Account_Form;