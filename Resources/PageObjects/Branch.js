var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var Branch_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();
    var fs = require('fs');
    var n;
    var option;
    var boolean;
    var y;

    var path = require('path'),
        remote = require('selenium-webdriver/remote');


    var PropertyOwned = by.xpath('//*[@id="property-owned"]')
    var LandlordOwned = by.xpath('//*[@id="landlord-owned"]')

    var OwnerName = by.xpath('//*[@placeholder="Owner Name"]')
    var OwnerEmailPhoneNumber = by.xpath('//*[@placeholder="Owner Email or phone number"]')

    var AddToCart = by.xpath('//*[@class="btn product-form__cart-submit"]')
    var ViewCartBtn = by.xpath('//*[@value="Check out"]')
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
        try {
            await GUILib.waitforElement(ViewCartBtn)
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

    this.checkYearFormat = async function () {
        await GUILib.getAttribute(Year, 'type').then(async function (result) {
            expect(result).not.toContain('text')
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

    this.chooseFile = async function (n) {
        switch (n) {
            case 1:
                option = ChooseFile1;
                break;
            case 2:
                option = ChooseFile2;
                break;
            case 3:
                option = ChooseFile3;
                break;
            case 4:
                option = ChooseFile4;
                break;
        }
        await browser.setFileDetector(new remote.FileDetector());
        var fileToUpload = '../Testdata/test.txt';
        var absolutePath = path.join(__dirname, fileToUpload);
        await browser.findElement(option).sendKeys(absolutePath);
        await console.log('Document was upload');
        try {
            await element(AddToCart).click()
            await GUILib.waitforElement(ViewCartBtn)
            boolean = true
        }
        catch (e) {
            boolean = false
        }
        expect(boolean).toBe(true)
    }

    this.chooseBigFile = async function (n) {
        switch (n) {
            case 1:
                option = ChooseFile1;
                break;
            case 2:
                option = ChooseFile2;
                break;
            case 3:
                option = ChooseFile3;
                break;
            case 4:
                option = ChooseFile4;
                break;
        }
        await browser.setFileDetector(new remote.FileDetector());
        var fileToUploadBig = '../Testdata/test30MB.pdf';
        var absolutePathBig = path.join(__dirname, fileToUploadBig);
        await browser.findElement(ChooseFile1).sendKeys(absolutePathBig);
        await console.log('Document was upload');
        var fileToUpload = '../Testdata/test.txt';
        var absolutePath = path.join(__dirname, fileToUpload);
        await browser.findElement(ChooseFile2).sendKeys(absolutePath);
        await console.log('Document was upload');
        await browser.findElement(ChooseFile3).sendKeys(absolutePath);
        await console.log('Document was upload');
        await browser.findElement(ChooseFile4).sendKeys(absolutePath);
        await console.log('Document was upload');
        try {
            await element(AddToCart).click()
            await GUILib.waitforElement(ViewCartBtn)
            boolean = true
        }
        catch (e) {
            boolean = false
        }
        expect(boolean).toBe(false)
    }

    this.chooseBigFileforAllSides = async function (n) {
        await browser.setFileDetector(new remote.FileDetector());
        var fileToUploadBig = '../Testdata/test30MB.pdf';
        var absolutePathBig = path.join(__dirname, fileToUploadBig);
        await browser.findElement(ChooseFile1).sendKeys(absolutePathBig);
        await console.log('Document was upload');
        await browser.findElement(ChooseFile2).sendKeys(absolutePathBig);
        await console.log('Document was upload');
        await browser.findElement(ChooseFile3).sendKeys(absolutePathBig);
        await console.log('Document was upload');
        await browser.findElement(ChooseFile4).sendKeys(absolutePathBig);
        await console.log('Document was upload');
        await element(AddToCart).click()
        await browser.sleep(15000);
        await browser.getCurrentUrl().then(async function (url) {
         expect(url).nottoContain('vehicle-signage')
        })
    }











}



    module.exports = new Branch_Form;