var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var BusinessCards_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();
    var fs = require('fs');
    var n;
    var y;

    var EditBusinessCards = by.xpath("//*[@id='EditFormButton']")
    var AddToCart = by.xpath("//*[@class='btn product-form__cart-submit']")

    var SelectEmployee = by.xpath("//*[@id='bm_details']")
    var SelectEmployeeOption = by.xpath("//*[@id='bm_details']/option")

    var CompanyName = by.xpath("//*[@id='company-name']")
    var CompanyNameOption = by.xpath("//*[@id='company-name']/option")
    var FullName = by.xpath("//*[@id='full-name']")
    var CompanyTitle = by.xpath("//*[@id='company-title']")
    var CompanyTitleOption = by.xpath("//*[@id='company-title']/option")
    var StreetAddress = by.xpath("//*[@id='street-address']")
    var City = by.xpath("//*[@id='city']")
    var State = by.xpath("//*[@id='state']")
    var StateOption = by.xpath("//*[@id='state']/option")
    var Zip = by.xpath("//*[@id='zip']")
    var Telephone = by.xpath("//*[@id='telephone']")
    var TelephoneExt = by.xpath("//*[@id='telephone-ext']")
    var Fax = by.xpath("//*[@id='fax']")
    var Cell = by.xpath("//*[@id='cell']")
    var Email = by.xpath("//*[@id='-email']")

    var NameCard = by.xpath("//*[@class='outputName']")
    var EmailCard = by.xpath("//*[@class='mb-0 output outputEmail']")
    var WebSiteCard = by.xpath("//*[@class='outputEmail2']")
    var TitleCard = by.xpath("//*[@class='outputWorkTitle']")
    var StreetCard = by.xpath("//*[@class='mb-0 outputStreet']")
    var CityCard = by.xpath("//*[@class='output-city']")
    var StateCard = by.xpath("//*[@class='outputState pl-1 pr-2']")
    var ZipCard = by.xpath("//*[@class='outputZip']")
    var TelCard = by.xpath("//*[@class='mb-0 d-flex']")
    var TelExCard = by.xpath("//*[@class='fax outputExt']")
    var FaxCard = by.xpath("//*[@class='fax outputFax']")
    var CellCard = by.xpath("//*[@class='cell outputCell']")

    var ViewCartBtn = by.xpath('/html/body/div[2]/div/div[2]/div[2]/a')
    var Cart = by.xpath("//*[@class='cart__submit btn btn--small-wide']")

    var CartName = by.xpath('//*[@id="shopify-section-cart-template"]/div/div[1]/form/div/div/div[1]/table/tbody/tr/td[3]/div/div/ul/li[4]/span[2]')

    this.verifyNames = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(SelectEmployee)
        await GUILib.scrollToElement(SelectEmployee)
        await element.all(SelectEmployeeOption).count().then(async function (count) {
            await console.log(count)
            for (var n = 2; n < count; n++) {
                await GUILib.selectFromDropdown(SelectEmployee, n)
                var Option = by.xpath("//*[@id='bm_details']/option[" + n + "]")
                await GUILib.getText(Option).then(async function (result1) {
                    await console.log(result1)
                    await browser.sleep(500);
                    await GUILib.getText(NameCard).then(async function (result2) {
                        await console.log(result2)
                        expect(result2).toBe(result1)
                    })
                })
            }
        })
    }

    this.verifyEmails = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(SelectEmployee)
        await GUILib.scrollToElement(SelectEmployee)
        await element.all(SelectEmployeeOption).count().then(async function (count) {
            await console.log(count)
            for (var n = 2; n < count; n++) {
                await GUILib.selectFromDropdown(SelectEmployee, n)
                var Option = by.xpath("//*[@id='bm_details']/option[" + n + "]")
                await GUILib.getText(Option).then(async function (result1) {
                    await console.log(result1)
                    await browser.sleep(500);
                    await GUILib.getText(EmailCard).then(async function (result3) {
                        await console.log(result3)
                        var ExpectedEmail = result1.toLowerCase().replace(' ', '.') + '@cityelectricsupply.com'
                        await console.log(ExpectedEmail)
                        expect(result3).toBe(ExpectedEmail)
                    })
                })
            }
        })
    }

    this.verifyCompanyNames = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(CompanyName)
        await GUILib.scrollToElement(CompanyName)
        await element.all(CompanyNameOption).count().then(async function (count) {
            await console.log(count)
            for (var n = 0; n < count; n++) {
                await GUILib.selectFromDropdown(CompanyName, n)
                var Option = by.xpath("//*[@id='company-name']/option[" + (n + 1) + "]")
                await GUILib.getText(Option).then(async function (result1) {
                    await console.log(result1)
                    await browser.sleep(500);
                    await GUILib.getText(WebSiteCard).then(async function (result2) {
                        await console.log(result2)
                        var ExpectedResult = "www." + result1.toLowerCase().replace(/ /g, "") + ".com"
                        await console.log(ExpectedResult)
                        expect(result2).toBe(ExpectedResult)
                    })
                })
            }
        })
    }

    this.verifyNameInput = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(FullName)
        await GUILib.scrollToElement(FullName)
        await element(FullName).clear().then(async function () {
            await GUILib.typeValue(FullName, 'Test Name').then(async function () {
                await GUILib.getText(NameCard).then(async function (text) {
                    expect(text).toBe('Test Name')
                })
            })
        })
    }

    this.verifyCompanyTitle = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(CompanyTitle)
        await GUILib.scrollToElement(CompanyTitle)
        await element.all(CompanyTitleOption).count().then(async function (count) {
            await console.log(count)
            for (var n = 2; n < count; n++) {
                await GUILib.selectFromDropdown(CompanyTitle, n)
                var Option = by.xpath("//*[@id='company-title']/option[" + (n + 1) + "]")
                await GUILib.getText(Option).then(async function (result1) {
                    await console.log(result1)
                    await browser.sleep(500);
                    await GUILib.getText(TitleCard).then(async function (result2) {
                        await console.log(result2)
                        expect(result2).toBe(result1)
                    })
                })
            }
        })
    }

    this.verifyStreetAddress = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(StreetAddress)
        await GUILib.scrollToElement(StreetAddress)
        await element(StreetAddress).clear().then(async function () {
            await GUILib.typeValue(StreetAddress, 'Test Address').then(async function () {
                await browser.sleep(600)
                await GUILib.getText(StreetCard).then(async function (text) {
                    expect(text).toBe('Test Address')
                })
            })
        })
    }

    this.verifyStreetAddress = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(StreetAddress)
        await GUILib.scrollToElement(StreetAddress)
        await element(StreetAddress).clear().then(async function () {
            await GUILib.typeValue(StreetAddress, 'Test Address').then(async function () {
                await GUILib.getText(StreetCard).then(async function (text) {
                    expect(text).toBe('Test Address')
                })
            })
        })
    }

    this.verifyCity = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(City)
        await GUILib.scrollToElement(City)
        await element(City).clear().then(async function () {
            await GUILib.typeValue(City, 'Test City').then(async function () {
                await GUILib.getText(CityCard).then(async function (text) {
                    expect(text).toBe('Test City')
                })
            })
        })
    }

    this.verifyState = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(State)
        await GUILib.scrollToElement(State)
        await element.all(StateOption).count().then(async function (count) {
            await console.log(count)
            var RandomNumber = await Math.floor(Math.random() * count);
            await GUILib.selectFromDropdown(State, RandomNumber)
            var Option = by.xpath("//*[@id='state']/option[" + (RandomNumber + 1) + "]")
            await GUILib.getText(Option).then(async function (result1) {
                await console.log(result1)
                await browser.sleep(500);
                await GUILib.getText(StateCard).then(async function (result2) {
                    await console.log(result2)
                    expect(result2).toBe(result1)
                })
            })
        })
    }

    this.verifyZipCodeNumeric = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(Zip)
        await GUILib.scrollToElement(Zip)
        await element(Zip).clear().then(async function () {
            await GUILib.typeValue(Zip, '11111').then(async function () {
                await GUILib.getText(ZipCard).then(async function (text) {
                    expect(text).toBe('11111')
                })
            })
        })
    }

    this.verifyPhoneNumeric = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(Telephone)
        await GUILib.scrollToElement(Telephone)
        await element(Telephone).clear().then(async function () {
            await GUILib.typeValue(Telephone, '111-111-1111').then(async function () {
                await GUILib.getText(TelCard).then(async function (text) {
                    expect(text).toContain('111-111-1111')
                })
            })
        })
    }

    this.verifyTelExNumeric = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(TelephoneExt)
        await GUILib.scrollToElement(TelephoneExt)
        await element(TelephoneExt).clear().then(async function () {
            await GUILib.typeValue(TelephoneExt, '111').then(async function () {
                await browser.sleep(300)
                await GUILib.getText(TelExCard).then(async function (text) {
                    expect(text).toContain('111')
                })
            })
        })
    }

    this.verifyFaxNumeric = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(Fax)
        await GUILib.scrollToElement(Fax)
        await element(Fax).clear().then(async function () {
            await GUILib.typeValue(Fax, '111-111-111').then(async function () {
                await browser.sleep(300)
                await GUILib.getText(FaxCard).then(async function (text) {
                    expect(text).toContain('111-111-111')
                })
            })
        })
    }

    this.verifyCell = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(Cell)
        await GUILib.scrollToElement(Cell)
        await element(Cell).clear().then(async function () {
            await GUILib.typeValue(Cell, '222-222-222').then(async function () {
                await browser.sleep(300)
                await GUILib.getText(CellCard).then(async function (text) {
                    expect(text).toContain('222-222-222')
                })
            })
        })
    }

    this.verifyEmailInput = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(Email)
        await GUILib.scrollToElement(Email)
        await element(Email).clear().then(async function () {
            await GUILib.typeValue(Email, 'test@eightythreecreative').then(async function () {
                await browser.sleep(300)
                await GUILib.getText(EmailCard).then(async function (text) {
                    expect(text).toContain('test@eightythreecreative')
                })
            })
        })
    }

    this.changeNameTelAddCart = async function () {
        await GUILib.clickObject(EditBusinessCards)
        await GUILib.waitforElement(FullName)
        await element(FullName).clear().then(async function () {
            await element(Telephone).clear().then(async function () {
                await GUILib.typeValue(FullName, 'Test Dina').then(async function () {
                    await GUILib.typeValue(Telephone, '111-111-1111').then(async function () {
                        await browser.sleep(300)
                        await GUILib.clickObject(AddToCart)
                        await GUILib.waitforElement(ViewCartBtn)
                        await GUILib.clickObject(ViewCartBtn)
                        await GUILib.waitforElement(Cart)
                        await GUILib.getText(CartName).then(async function (text) {
                            expect(text).toBe('Test Dina')
                        })
                    })
                })
            })
        })
    }












}



module.exports = new BusinessCards_Form;