var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');

var SpecSheets_Form = function () {
    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');

    //----------------------------------------------------------------------------------------//
    var SpecSheet = by.xpath("//*[@class='download']")
    var SortByCategory = by.xpath("//*[@id='productMain']//h4[text()='Sort By Category']")
    var Link = 'wp-content'
    var Error404 = by.xpath("//h1[text()='404 Not Found']")

    var FilterField = by.xpath("//input[@class='textfield filter__search js-shuffle-search']")
    var ProductName = "5000K"
    var ProductElement = by.xpath("//h3[@class='item__title']")

    //-----------------------------------Functions-----------------------------------//

    this.clickAllSpecSheets = async function (y) {
        var Arr = [];
        var z = 1;
        await element.all(SpecSheet).count().then(async function (count) {
            if (y == 1) {
                var start = 0
                var end = await Math.floor(count / 2);
            }
            if (y == 2) {
                var start = await Math.floor(count / 2);
                var end = count
            }
            await console.log("start " + start)
            await console.log("end " + end)
            for (var n = start; n < end; n++) {
                await console.log(count)
                await console.log("n" + n)
                await GUILib.waitforElement(SortByCategory)
                await element.all(SpecSheet).then(async function (AllSpecSheet) {
                    var ItemElement = await AllSpecSheet[n].getWebElement();
                    var SpecSheetScroll = by.xpath("//*[@id='grid']/div[" + (1 + n) + "]")
                    await console.log("Scrolling to element... " + SpecSheetScroll)
                    var elmnt = element(SpecSheetScroll);
                    await browser.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });", elmnt).then(async function () {
                        await console.log("Scrolled to element");
                    })
                    await browser.wait(EC.visibilityOf(elmnt), 30000);
                    await ItemElement.click().then(async function () {
                        await console.log("ItemElement was clicked")
                    })
                    await browser.sleep(2000);
                    let windowHandles = browser.getAllWindowHandles();
                    var allWindowHandlers = await browser.getAllWindowHandles();
                    await console.log("allWindowHandlers.length" + allWindowHandlers.length)
                    if (allWindowHandlers.length > 1) {
                        let parentHandle, childHandle;
                        await windowHandles.then(async function (handles) {
                            parentHandle = await handles[0];
                            childHandle = await handles[1];
                            await browser.switchTo().window(childHandle).then(async function () {
                                await browser.getCurrentUrl().then(async function (url) {
                                    await console.log("Child window:- " + url);
                                    if (url.includes(Link)) {
                                        await console.log('New tab is opened in the child window');
                                        await element.all(Error404).count().then(async function (AllError404) {
                                            await console.log("AllError404 " + AllError404)
                                            if (AllError404 > 0) {
                                                await Arr.push(url);
                                            }
                                        })
                                        await browser.close();
                                        await browser.switchTo().window(parentHandle);
                                    } else {
                                        await browser.switchTo().window(parentHandle).then(async function () {
                                            await browser.sleep(2000);
                                            await browser.getCurrentUrl().then(async function (url) {
                                                await console.log("Parent window:- " + url);
                                                await console.log('New tab is opened in the parent window');
                                                await element.all(Error404).count().then(async function (AllError404) {
                                                    await console.log("AllError404 " + AllError404)
                                                    if (AllError404 > 0) {
                                                        await Arr.push(url);
                                                    }
                                                })
                                                await browser.close();
                                                await browser.switchTo().window(childHandle);
                                            })
                                        })
                                    }

                                })
                            })
                        })
                    } else {
                        await browser.getCurrentUrl().then(async function (url) {
                            await element.all(Error404).count().then(async function (AllError404) {
                                await console.log("AllError404 " + AllError404)
                                if (AllError404 > 0) {
                                    await Arr.push(url);
                                }
                            })
                        })
                        await browser.get('https://fusion-lamps.com/spec-sheets/')
                    }


                })
            }
        })

        await console.log("===Products with 404: " + Arr)
        expect(Arr.length).toBe(0)
    }

    this.verifyFilterSpecSheetsByName = async function () {
        var Arr = [];
        var Arr1 = []

        await element.all(ProductElement).count().then(async function (count) {
            await console.log(count)
            for (var n = 1; n <= count; n++) {
                elementText = by.xpath('//*[@id="grid"]/div[' + n + ']/div/a/h3')
                var result = await element(elementText).isDisplayed();
                if (result == true) {
                    await GUILib.getText(elementText).then(async function (text) {
                        await Arr.push(text)
                    })
                }
            }
            await GUILib.typeValue(FilterField, ProductName)
            await element.all(ProductElement).count().then(async function (count1) {

                for (var n = 1; n <= count1; n++) {
                    elementText = by.xpath('//*[@id="grid"]/div[' + n + ']/div/a/h3')
                    var result = await element(elementText).isDisplayed();
                    if (result == true) {
                        await GUILib.getText(elementText).then(async function (text) {
                            await Arr1.push(text)
                        })
                    }
                }
                await console.log(Arr1.length)

                await expect(Arr).not.toEqual(Arr1)
            })
        })
    }

}


module.exports = new SpecSheets_Form;