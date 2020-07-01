var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var Account_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();
    var fs = require('fs');
    var n;
    var y;
    var text1 = "Test"
    var text2 = "Test New"

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

    var FirstNameNew = by.xpath('//*[@id="MainContent"]//li[2]/div[1]/p[1]')
    var LastNameNew = by.xpath('//*[@id="MainContent"]//li[2]/div[1]/p[2]')
    var EmailNew = by.xpath('//*[@id="MainContent"]//li[2]/div[1]/p[3]')
    var CompanyNew = by.xpath('//*[@id="MainContent"]//li[2]/div[1]/p[4]')
    var TelNew = by.xpath('//*[@id="MainContent"]//li[2]/div[1]/p[5]')
    var StreetAddressNew = by.xpath('//*[@id="MainContent"]//li[2]/div[1]/p[6]')
    var AptNew = by.xpath('//*[@id="MainContent"]//li[2]/div[1]/p[7]')
    var CityNew = by.xpath('//*[@id="MainContent"]//li[2]/div[1]/p[8]')
    var StateNew = by.xpath('//*[@id="MainContent"]//li[2]/div[1]/p[9]')
    var ZipNew = by.xpath('//*[@id="MainContent"]//li[2]/div[1]/p[10]')

    var FirstNameEdit = by.xpath('//input[contains(@id,"AddressFirstName_")]')
    var LastNameEdit = by.xpath('//input[contains(@id,"AddressLastName_")]')
    var CompanyEdit = by.xpath('//input[contains(@id,"AddressCompany_")]')
    var TelEdit = by.xpath('//input[contains(@id,"AddressPhone_")]')
    var StreetAddressEdit = by.xpath('//input[contains(@id,"AddressAddress1_")]')
    var AptEdit = by.xpath('//input[contains(@id,"AddressAddress2_")]')
    var CityEdit = by.xpath('//input[contains(@id,"AddressCity_")]')
    var StateEdit = by.xpath('//select[contains(@id,"AddressProvince_")]')
    var StateEditOption = by.xpath('//select[contains(@id,"AddressProvince_")]/option')
    var ZipEdit = by.xpath('//input[contains(@id,"AddressZip_")]')
    var CountryEdit = by.xpath('//select[contains(@id,"AddressCountry_")]')
    var CountryEditOption = by.xpath('//select[contains(@id,"AddressCountry_")]/option')

    var FirstNameEditNew = by.xpath('//input[contains(@id,"AddressFirstNameNew")]')
    var LastNameEditNew = by.xpath('//input[contains(@id,"AddressLastNameNew")]')
    var CompanyEditNew = by.xpath('//input[contains(@id,"AddressCompanyNew")]')
    var TelEditNew = by.xpath('//input[contains(@id,"AddressPhoneNew")]')
    var StreetAddressEditNew = by.xpath('//input[contains(@id,"AddressAddress1New")]')
    var AptEditNew = by.xpath('//input[contains(@id,"AddressAddress2New")]')
    var CityEditNew = by.xpath('//input[contains(@id,"AddressCityNew")]')
    var StateEditNew = by.xpath('//select[contains(@id,"AddressProvinceNew")]')
    var StateEditNewOption = by.xpath('//select[contains(@id,"AddressProvinceNew")]/option')
    var ZipEditNew = by.xpath('//input[contains(@id,"AddressZipNew")]')
    var CountryEditNew = by.xpath('//select[contains(@id,"AddressCountryNew")]')
    var CountryEditNewOption = by.xpath('//select[contains(@id,"AddressCountryNew")]/option')

    var UpdateAddress = by.xpath('//*[@value ="Update Address"]')
    var AddAddress = by.xpath('//*[@value ="Add Address"]')

    var LogOut = by.xpath('//*[@id="customer_logout_link"]')
    var Edit = by.xpath("//a[@href='/account/addresses']")
    var DB = by.xpath('//ul[contains(text(),"id")]')
    var EditAddress = by.xpath('//button[contains(text(),"Edit")]')

    var CancelBtn = by.xpath("//*[@class='text-link address-edit-toggle']")
    var EditAddressHeader = by.xpath("//*[text()='Edit address']")

    var ReturnAccountDetails = by.xpath("//*[text()='Return to Account Details']")
    var AddNewAddressBtn = by.xpath("//button[text()='Add a New Address']")
    var AddNewAddressHeader = by.xpath("//h2[text()='Add a New Address']")

    var LastDelete = by.xpath('//div[2]//li[2]//li[2]/button')

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

    this.verifyNewName = async function (n) {
        if (n == 1) {
            await CF.editName(EditAddress, FirstNameEdit, text1, UpdateAddress, FirstName)
        } 
        if (n == 2) {
            await CF.editName(AddNewAddressBtn, FirstNameEditNew, text2, AddAddress, FirstNameNew)
        }
    }

    this.verifyLastName = async function (n) {
        if (n == 1) {
            await CF.editName(EditAddress, LastNameEdit, UpdateAddress, LastName)
        } 
        if (n == 2) {
            await CF.editName(AddNewAddressBtn, LastNameEditNew, AddAddress, LastNameNew)
            await GUILib.clickObject(LastDelete)
            await browser.sleep(1000)
            browser.switchTo().alert().accept();
            await browser.sleep(1000)
        }
    }

    this.verifyCompany = async function (n) {
        if (n == 1) {
            await CF.editName(EditAddress, CompanyEdit, text1, UpdateAddress, Company)
        } 
        if (n == 2) {
            await CF.editName(AddNewAddressBtn, CompanyEditNew, text2, AddAddress, CompanyNew)
        }
    }

    this.verifyAddress = async function () {
        await CF.editName(EditAddress, StreetAddressEdit, UpdateAddress, StreetAddress)
    }

    this.verifyApt = async function () {
        await CF.editName(EditAddress, AptEdit, UpdateAddress, Apt)
    }

    this.verifyCity = async function () {
        await CF.editName(EditAddress, CityEdit, UpdateAddress, City)
    }

    this.verifyState = async function () {
        var result = "text"
        await GUILib.clickObject(EditAddress).then(async function () {
            try {
                await GUILib.scrollToElement(StateEdit)
                await element.all(StateEditOption).count().then(async function (count) {
                    await console.log(count)
                    var RandomNumber = await Math.floor(Math.random() * count);
                    await GUILib.selectFromDropdown(StateEdit, RandomNumber)
                    var StateEditOption = by.xpath('//select[contains(@id,"AddressProvince_")]/option[' + (RandomNumber + 1) + ']')
                    await GUILib.getText(StateEditOption).then(async function (result1) {
                        await GUILib.clickObject(UpdateAddress).then(async function () {
                            await GUILib.scrollToElement(State)
                            await GUILib.getText(State).then(async function (result2) {
                                result = "State was changed successfuly"
                                expect(result2).toContain(result1)
                            })
                        })
                    })
                })
            } catch (e) {
                result = "No option to change the State"
            }
            expect(result).toBe("State was changed successfuly")
        })
    }

    this.verifyEmail = async function () {
        var result = "text"
        await GUILib.clickObject(EditAddress).then(async function () {
            try {
                await element(Email).clear().then(async function () {
                    await GUILib.typeValue(Email, 'Test').then(async function () {
                        await GUILib.clickObject(UpdateBtn).then(async function () {
                            await GUILib.getText(Email).then(async function (text) {
                                result = "Email was changed successfuly"
                                expect(text).toContain('Test')
                            })
                        })
                    })
                })
            } catch (e) {
                result = "No option to change Email"
            }
            expect(result).toBe("Email was changed successfuly")
        })
    }

    this.verifyCountry = async function () {
        await GUILib.clickObject(EditAddress).then(async function () {
            await GUILib.scrollToElement(CountryEdit)
            await element.all(CountryEditOption).count().then(async function (count) {
                await console.log(count)
                var RandomNumber = await Math.floor(Math.random() * count);
                await GUILib.selectFromDropdown(CountryEdit, RandomNumber)
                var CountryEditOption = by.xpath('//select[contains(@id,"AddressCountry_")]/option[' + (RandomNumber + 1) + ']')
                await GUILib.getText(CountryEditOption).then(async function (result1) {
                    await GUILib.clickObject(UpdateAddress).then(async function () {
                        var result = "No such field to verify changes"
                        try {
                            await GUILib.scrollToElement(Country)
                            await GUILib.getText(Country).then(async function (result2) {
                                if (result1 == result2) {
                                    result = "Country value was changed successfully"
                                }
                            })
                        } catch (e) {
                            result = "No such field to verify changes"
                        }
                        expect(result).toBe('Country value was changed successfully')
                    })
                })
            })
        })
    }

    this.verifyZip = async function () {
        await CF.editName(EditAddress, ZipEdit, UpdateAddress, Zip)
    }

    this.verifyPhone = async function () {
        await CF.editName(EditAddress, TelEdit, UpdateAddress, Tel)
    }

    this.verifyCancelBtn = async function () {
        await GUILib.clickObject(EditAddress).then(async function () {
            await GUILib.scrollToElement(CancelBtn)
            await GUILib.clickObject(CancelBtn).then(async function () {
                await browser.sleep(1000)
                await element(EditAddressHeader).isDisplayed().then(async function (result) {
                    expect(result).toBe(false)
                })
            })
        })
    }

    this.verifyReturnAccountDetailsLink = async function () {
        await GUILib.clickObject(EditAddress).then(async function () {
            await GUILib.scrollToElement(ReturnAccountDetails)
            await GUILib.clickObject(ReturnAccountDetails).then(async function () {
                await element(LogOut).isDisplayed().then(async function (result) {
                    expect(result).toBe(true)
                })
            })
        })
    }

    this.verifyAddNewAddressBtn = async function () {
        await GUILib.clickObject(EditAddress).then(async function () {
            await GUILib.scrollToElement(AddNewAddressBtn)
            await GUILib.clickObject(AddNewAddressBtn).then(async function () {
                await element(AddNewAddressHeader).isDisplayed().then(async function (result) {
                    expect(result).toBe(true)
                })
            })
        })
    }
}



module.exports = new Account_Form;