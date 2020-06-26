var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var Account_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();
    var fs = require('fs');
    var n;
    var y;

    var FirstName = by.xpath('//*[@id="MainContent"]//div[1]/p[1]')
    var LastName = by.xpath('//*[@id="MainContent"]//div[1]/p[2]')
    var Email = by.xpath('//*[@id="MainContent"]//div[1]/p[3]')
    var Company = by.xpath('//*[@id="MainContent"]//div[1]/p[4]')
    var Tel = by.xpath('//*[@id="MainContent"]//div[1]/p[5]')
    var StreetAddress = by.xpath('//*[@id="MainContent"]//div[1]/p[6]')
    var Apt = by.xpath('//*[@id="MainContent"]//div[1]/p[7]')
    var City = by.xpath('//*[@id="MainContent"]//div[1]/p[8]')
    var State = by.xpath('//*[@id="MainContent"]//div[1]/p[9]')
    var Zip = by.xpath('//*[@id="MainContent"]//div[1]/p[10]')

    var FirstNameEdit = by.xpath('//input[contains(@id,"AddressFirstName_")]')
    var LastNameEdit = by.xpath('//input[contains(@id,"AddressLastName_")]')
    var EmailEdit = by.xpath('')
    var CompanyEdit = by.xpath('//input[contains(@id,"AddressCompany_")]')
    var TelEdit = by.xpath('//input[contains(@id,"AddressPhone_")]')
    var StreetAddressEdit = by.xpath('//input[contains(@id,"AddressAddress1_")]')
    var AptEdit = by.xpath('//input[contains(@id,"AddressAddress2_")]')
    var CityEdit = by.xpath('//input[contains(@id,"AddressCity_")]')
    var StateEdit = by.xpath('//select[contains(@id,"AddressProvince_")]')
    var ZipEdit = by.xpath('//input[contains(@id,"AddressZip_")]')
    var CountryEdit = by.xpath('//select[contains(@id,"AddressCountry_")]')

    var UpdateAddress = by.xpath('//*[@value ="Update Address"]')

    var LogOut = by.xpath('//*[@id="customer_logout_link"]')
    var Edit = by.xpath("//a[@href='/account/addresses']")
    var DB = by.xpath('//ul[contains(text(),"id")]')
    var EditAddress = by.xpath('//button[contains(text(),"Edit")]')


    this.clickLogOut = async function () {
        await GUILib.clickObject(LogOut)
        await browser.wait(EC.not(EC.urlContains('account'), 30000))
        await browser.sleep(1500);
        await browser.getCurrentUrl().then(async function (url) {
            expect(url).toContain('checkout')
        })
    }

    this.clickEdit = async function () {
        await GUILib.scrollToElement(Edit)
        await GUILib.clickObject(Edit)
        await browser.wait(EC.urlContains('addresses'), 30000)
    }

    this.checkNoDBinfo = async function () {
        await element.all(DB).count().then(async function (count) {
            expect(count).toBe(0)
        })
    }

    this.verifyNewName = async function () {
       await CF.editName(EditAddress, FirstNameEdit, UpdateAddress, FirstName)
    }



    

}



module.exports = new Account_Form;