var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var Branch_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();
    var fs = require('fs');
    var n;
    var y;

    var path = require('path'),
    remote = require('selenium-webdriver/remote');


    var PropertyOwned = by.xpath('//*[@id="property-owned"]')
    var LandlordOwned = by.xpath('//*[@id="landlord-owned"]')

    var OwnerName = by.xpath('//*[@placeholder="Owner Name"]')
    var OwnerEmailPhoneNumber = by.xpath('//*[@placeholder="Owner Email or phone number"]')

    var AddToCart = by.xpath('//*[@class="btn product-form__cart-submit"]')
    var ViewCartBtn = by.xpath('/html/body/div[2]/div/div[2]/div[2]/a')
    var MakeModel = by.xpath('//*[@id="inputMake"]')
    var Year = by.xpath('//*[@id="inputYear"]')

    var ChooseFile1 = by.xpath('//*[@id="vehicle_front"]')
    var ChooseFile2 = by.xpath('//*[@id="vehicle_front2"]')
    var ChooseFile3 = by.xpath('//*[@id="vehicle_front3"]')
    var ChooseFile4 = by.xpath('//*[@id="vehicle_front4"]')


    //----------------------------------------------------------------------------------------//

    this.fillPropertyOwned = async function () {
        await GUILib.clickObject(PropertyOwned)
        await GUILib.typeValue(OwnerName, 'Test')
        await GUILib.typeValue(OwnerEmailPhoneNumber, 'Test')
        await GUILib.clickObject(AddToCart)
        var boolean;
        try {
            await GUILib.waitforElement(ViewCartBtn)
            await element(ViewCartBtn).click()
            boolean = true
        }
        catch (e) {
            boolean = false
        }
        expect(boolean).toBe(true)
    }

    this.fillLandlordOwned = async function () {
        await GUILib.clickObject(LandlordOwned)
        await GUILib.typeValue(OwnerName, 'Test')
        await GUILib.typeValue(OwnerEmailPhoneNumber, 'Test')
        await GUILib.clickObject(AddToCart)
        var boolean;
        try {
            await GUILib.waitforElement(ViewCartBtn)
            await element(ViewCartBtn).click()
            boolean = true
        }
        catch (e) {
            boolean = false
        }
        expect(boolean).toBe(true)
    }

    this.checkEmailTelFormat = async function () {
        await GUILib.clickObject(LandlordOwned)
        await GUILib.typeValue(OwnerName, 'Test')
        await GUILib.getAttribute(OwnerEmailPhoneNumber, 'type').then(async function (type) {
            expect(['tel', 'email']).toContain(type)
        })
    }

    this.verifyOwnerContactsFieldMandatory = async function () {
        await GUILib.clickObject(LandlordOwned)
        await GUILib.typeValue(OwnerName, 'Test')
        await GUILib.getAttribute(OwnerEmailPhoneNumber, 'class').then(async function (result) {
            expect(result).toContain('required')
        })
    }

    this.verifyMakeModelMandatory = async function () {
        await GUILib.getAttribute(MakeModel, 'required').then(async function (result) {
            expect(result).toContain('required')
        })
    }

    this.verifyYearMandatory = async function () {
        await GUILib.getAttribute(Year, 'required').then(async function (result) {
            expect(result).toContain('required')
        })
    }

    this.verifyChooseFile1 = async function () {
        await GUILib.getAttribute(ChooseFile1, 'required').then(async function (result) {
            expect(result).toContain('true')
        })
    }

    this.verifyChooseFile2 = async function () {
        await GUILib.getAttribute(ChooseFile2, 'required').then(async function (result) {
            expect(result).toContain('true')
        })
    }

    this.verifyChooseFile3 = async function () {
        await GUILib.getAttribute(ChooseFile3, 'required').then(async function (result) {
            expect(result).toContain('true')
        })
    }

    this.verifyChooseFile4 = async function () {
        await GUILib.getAttribute(ChooseFile4, 'required').then(async function (result) {
            expect(result).toContain('true')
        })
    }

    this.chooseFile = async function () {
        await browser.setFileDetector(new remote.FileDetector());
        var fileToUpload = '../Testdata/test.txt';
        var absolutePath = path.join(__dirname, fileToUpload);
        await browser.findElement(ChooseFile1).sendKeys(absolutePath);
        await console.log('Document was upload');
        await browser.sleep(5000);
    }











}



module.exports = new Branch_Form;