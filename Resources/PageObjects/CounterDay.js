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

    var QuantityNameCart = by.xpath('//*[@class="cart__itemDetails-td  text-left"]')
    var Cart = by.xpath("//*[@class='cart__submit btn btn--small-wide']")
    var Delete = by.xpath("//*[@class='fas fa-times']")


    //----------------------------------------------------------------------------------------//

    this.clickBreakfast = async function (n) {
        var Breakfast = by.xpath("//*[@id='Collection']/div/div/div/ul/li[" + n + "]/div/div[3]/a")
        await GUILib.clickObject(Breakfast)
        await GUILib.waitforElement(QuantityName)
    }

    this.clickBBQ = async function (n) {
        var BBQ = by.xpath("//*[@id='Collection']/div/div/div/ul/li[" + n + "]/div/div[4]/a")
        await GUILib.clickObject(BBQ)
        await GUILib.waitforElement(QuantityName)
    }

    this.clickLunch = async function (n) {
        var BBQ = by.xpath("//*[@id='Collection']/div/div/div/ul/li[" + n + "]/div/div[4]/a")
        await GUILib.clickObject(BBQ)
        await GUILib.waitforElement(QuantityName)
    }

    this.checkProductsPage = async function () {
        var Arr = [];
        await browser.getCurrentUrl().then(async function (url) {
            await element.all(QuantityLines).count().then(async function (lines) {
                await console.log(lines)
                for (y = 1; y <= lines; y++) {
                    var Quantity = by.xpath('//*[@id="counter-day-form"]/div[1]/div/table/tbody/tr[' + y + ']/td[4]/input')
                    var Product = by.xpath("//*[@id='counter-day-form']/div[1]/div/table/tbody/tr[" + y + "]/td[2]/a")
                    var ProductDescription = by.xpath('//*[@id="counter-day-form"]/div[1]/div/table/tbody/tr[' + y + ']/td[2]/a')
                    await GUILib.getText(ProductDescription).then(async function (text) {
                        await GUILib.getAttribute(Quantity, 'value').then(async function (count) {
                            await console.log(count)
                            if (count > 0) {
                                await GUILib.clickObject(Product)
                                await browser.sleep(500)
                                let windowHandles = await browser.getAllWindowHandles();
                                await browser.switchTo().window(windowHandles[1])
                                await GUILib.waitforElement(Logo)
                                await element.all(Error404).count().then(async function (Error404) {
                                    await console.log(Error404)
                                    if (Error404 > 0) {
                                        await Arr.push(text);
                                    }
                                })
                                await browser.close()
                                await browser.switchTo().window(windowHandles[0])
                                await browser.get(url)
                                await GUILib.waitforElement(Quantity)
                            }
                        })
                    })
                }
            })
        })
        await console.log(Arr)
        expect(Arr.length).toBe(0)
    }

    this.fillBundleInfoPastDate = async function () {
        await GUILib.typeValue(Vendors, 'Test')
        await GUILib.selectFromDropdown(StartHourOptions, '1')
        await GUILib.selectFromDropdown(EndHourOptions, '1')
        await GUILib.selectFromDropdown(StartMinuteOptions, '1')
        await GUILib.selectFromDropdown(EndMinuteOptions, '1')
        await GUILib.clickObject(Calendar)
        try {
            await GUILib.clickObject(DateCalendar)
            await GUILib.clickObject(AddToCartBtn)
            await GUILib.waitforElement(ViewCartBtn)
            await GUILib.clickObject(ViewCartBtn)
            boolean = false
        }
        catch (e) {
            boolean = true
        }
        expect(boolean).toBe(true)
    }

    this.addBundleCartPositive = async function () {
        await element.all(QuantityLines).count().then(async function (ExpectedCount) {
            await console.log(ExpectedCount)
            await GUILib.typeValue(Vendors, 'Test')
            await GUILib.selectFromDropdown(StartHourOptions, '1')
            await GUILib.selectFromDropdown(EndHourOptions, '1')
            await GUILib.selectFromDropdown(StartMinuteOptions, '1')
            await GUILib.selectFromDropdown(EndMinuteOptions, '1')
            await GUILib.clickObject(Calendar)
            await GUILib.clickObject(NextMonth)
            await GUILib.clickObject(NextMonth)
            try {
                await GUILib.clickObject(DateCalendar)
                await GUILib.clickObject(AddToCartBtn)
                await GUILib.waitforElement(ViewCartBtn)
                await GUILib.clickObject(ViewCartBtn)
                await GUILib.waitforElement(Cart);
                await element.all(QuantityNameCart).count().then(async function (ActualCount) {
                    await console.log(ActualCount)
                    expect(1 + ExpectedCount).toBe(ActualCount)
                    boolean = true
                })
            }
            catch (e) {
                boolean = false
            }
            expect(boolean).toBe(true)
        })
    }

    this.deleteBundleCartPositive = async function () {
        await element.all(QuantityLines).count().then(async function (ExpectedCount) {
            await console.log(ExpectedCount)
            await GUILib.typeValue(Vendors, 'Test')
            await GUILib.selectFromDropdown(StartHourOptions, '1')
            await GUILib.selectFromDropdown(EndHourOptions, '1')
            await GUILib.selectFromDropdown(StartMinuteOptions, '1')
            await GUILib.selectFromDropdown(EndMinuteOptions, '1')
            await GUILib.clickObject(Calendar)
            await GUILib.clickObject(NextMonth)
            await GUILib.clickObject(NextMonth)
            try {
                await GUILib.clickObject(DateCalendar)
                await GUILib.clickObject(AddToCartBtn)
                await GUILib.waitforElement(ViewCartBtn)
                await GUILib.clickObject(ViewCartBtn)
                await GUILib.waitforElement(Cart);
                await element.all(QuantityNameCart).count().then(async function (ActualCount) {
                    await console.log(ActualCount)
                    await element.all(Delete).count().then(async function (count) {
                        for (var y = 0; y < count; y++) {
                            await console.log(y)
                            await browser.sleep(500)
                            await element.all(Delete).then(async function (DeleteArray) {
                                var DeleteElement = await DeleteArray[0].getWebElement();
                                await DeleteElement.click()
                            })
                        }
                    })
                })
                await browser.refresh()
                await element.all(QuantityNameCart).count().then(async function (ExpectedCount) {
                    expect (ExpectedCount).toBe(0)
                })
                boolean = true
            } catch (e) {
                boolean = false
            }
            expect(boolean).toBe(true)
        })
    }

    this.checkAddtoCartBtn = async function () {
        await GUILib.typeValue(Vendors, 'Test')
        await GUILib.selectFromDropdown(StartHourOptions, '1')
        await GUILib.selectFromDropdown(EndHourOptions, '1')
        await GUILib.selectFromDropdown(StartMinuteOptions, '1')
        await GUILib.selectFromDropdown(EndMinuteOptions, '1')
        await GUILib.clickObject(Calendar)
        await GUILib.clickObject(NextMonth)
        await GUILib.clickObject(NextMonth)
        await GUILib.clickObject(DateCalendar)
        await GUILib.clickObject(AddToCartBtn)
        await GUILib.waitforElement(ContinueShopping)
        await GUILib.clickObject(ContinueShopping)
        await GUILib.getText(AddToCartBtn).then(async function (text) {
            await console.log(text)
            expect(text).not.toContain('Adding Bundle...')
        })


        expect(boolean).toBe(true)
    }

    this.clickAddToCart = async function () {
        await GUILib.scrollToElement(AddToCartBtn)
        await GUILib.clickObject(AddToCartBtn)
        try {
            await GUILib.waitforElement(ViewCartBtn)
            await GUILib.clickObject(ViewCartBtn)
            boolean = false
        }
        catch (e) {
            boolean = true
        }
        expect(boolean).toBe(true)

    }

    this.fillNonNumericOptions = async function () {
        await GUILib.typeValue(Vendors, 'Test')
        await GUILib.selectFromDropdown(StartHourOptions, '0')
        await GUILib.selectFromDropdown(EndHourOptions, '0')
        await GUILib.selectFromDropdown(StartMinuteOptions, '0')
        await GUILib.selectFromDropdown(EndMinuteOptions, '0')
        await GUILib.clickObject(Calendar)
        await GUILib.clickObject(NextMonth)
        await GUILib.clickObject(DateCalendar)
        await GUILib.clickObject(AddToCartBtn)
        try {
            await GUILib.waitforElement(ViewCartBtn)
            await GUILib.clickObject(ViewCartBtn)
            boolean = false
        }
        catch (e) {
            boolean = true
        }
        expect(boolean).toBe(true)
    }



}



module.exports = new CounterDay_Form;