var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var Store_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');
    var n;
    var z = 0;




    //----------------------------------------------------------------------------------------//
    var Filter = by.xpath("//*[contains(@class, 'filter-by-ul')]/li/a")
    var NextPage = by.xpath("//*[@id='Collection']//a[@class='btn btn--tertiary btn--narrow']")
    var NoImage = by.xpath("//*[contains(@data-srcset, 'no-image')]")
    var Item = by.xpath("//*[contains(@class, 'grid__item grid__item--collection-template medium-up--one-third')]")
    var Logo = by.xpath("//*[@class='h2 site-header__logo']")
    var Image = by.xpath('//*[contains(@class, "product-single__photo-wrapper js")]')
    var ItemName = by.xpath('//*[@class="product-single-page__title"]')


    //----------------------------------------------------------------------------------------//
    this.clickFilter = async function () {
        var Arr = [];
        await element.all(Filter).count().then(async function (filter) {
            await console.log("Number of filters:" + filter)
            for (var n = 1; n < filter; n++) {
                await element.all(Filter).then(async function (FilterArray) {
                    var FilterElement = await FilterArray[z].getWebElement();
                    await z++;
                    await FilterElement.getText().then(async function (text) {
                        await console.log("Name of filter:" + text)
                        await FilterElement.click();
                        await browser.sleep(500)
                        await browser.getCurrentUrl().then(async function (url) {
                            await console.log("Link:" + url)
                            await element.all(Item).count().then(async function (item) {
                                await console.log("Number of Items:" + item)
                                var x = 0
                                for (var y = 1; y <= item; y++) {
                                    await element.all(Item).then(async function (ItemArray) {
                                        var ItemElement = await ItemArray[x].getWebElement();
                                        await x++;
                                        await browser.sleep(500)
                                        await ItemElement.click();
                                        await GUILib.waitforElement(Logo)

                                        await element.all(Image).count().then(async function (noimage) {
                                            await console.log("noimage " + noimage)
                                            await GUILib.getText(ItemName).then(async function (name) {
                                                if (noimage == 0) {
                                                    if (Arr.indexOf(name) === -1) {
                                                        await Arr.push(name);
                                                    }
                                                }
                                            })
                                        })
                                        await browser.get(url)
                                    })
                                }
                            })
                            try {
                                await GUILib.scrollToElement(NextPage)
                                await element(NextPage).click()
                                await browser.sleep(500)
                                await browser.getCurrentUrl().then(async function (url1) {
                                await console.log("Link for the second page:" + url1)
                                await element.all(Item).count().then(async function (item) {
                                    await console.log("Number of Items:" + item)
                                    var x = 0
                                    for (var y = 1; y <= item; y++) {
                                        await element.all(Item).then(async function (ItemArray) {
                                            var ItemElement = await ItemArray[x].getWebElement();
                                            await x++;
                                            await browser.sleep(500)
                                            await ItemElement.click();
                                            await GUILib.waitforElement(Logo)

                                            await element.all(Image).count().then(async function (noimage) {
                                                await console.log("noimage " + noimage)
                                                await GUILib.getText(ItemName).then(async function (name) {
                                                    if (noimage == 0) {
                                                        if (Arr.indexOf(name) === -1) {
                                                            await Arr.push(name);
                                                        }
                                                    }
                                                })
                                            })
                                            await browser.get(url1)
                                        })
                                    }
                                })
                            })

                            } catch (e) {
                                await console.log("Only one Page for this filter")
                            }
                        })
                    })
                })
                await browser.get('https://city-electric-supply-marketing.myshopify.com/collections/all')
                await GUILib.waitforElement(Logo)
            }
            await console.log("===Products with no-image: " + Arr)
            expect(Arr.length).toBe(0)
        })
    }
}



module.exports = new Store_Form;