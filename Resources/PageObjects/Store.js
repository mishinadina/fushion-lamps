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
    var FirstItem = by.xpath('//*[@id="Collection"]/div/div/div[3]/ul/li[1]/div/a')
    var Quantity = by.xpath("//*[@for='Quantity-product-template']")

    var AddtoCartBtn = by.xpath("//*[@aria-label='Add to cart']")
    var ViewCartBtn = by.xpath('//*[@class="cart-popup__cta-link btn btn--secondary-accent"]')
    var Cart = by.xpath("//*[@class='cart__submit btn btn--small-wide']")

    var UniformItems = by.xpath("//*[@class='grid-view-item product-card   uniform-grid   ']")
    var Uniform = by.xpath("//*[contains(@class, 'filter-by-ul')]/li/a[contains(text(), 'Uniforms')]")
    var Size = by.xpath("//div[contains(@class,'swatch-element size-swatch')]")
    var Price = by.xpath("//*[contains(@class,'price-item price-item--regular')]")
    var FirstUniformItem = by.xpath("//*[@class='grid grid--uniform grid--view-items']")

    //----------------------------------------------------------------------------------------//
    this.addRandomItemToCart = async function () {
        await GUILib.waitforElement(FirstItem)
        await GUILib.clickObject(Uniform)
        await element.all(Item).count().then(async function (count) {
            await element.all(Item).then(async function (ItemArray) {
                var RandomNumber = await Math.floor(Math.random() * count);
                var ItemElement = await ItemArray[RandomNumber].getWebElement();
                await ItemElement.click()
                await GUILib.waitforElement(ItemName)
                await GUILib.getText(ItemName).then(async function (name) {
                    await console.log(name)
                    await GUILib.clickObject(AddtoCartBtn)
                    await GUILib.waitforElement(ViewCartBtn)
                    await GUILib.clickObject(ViewCartBtn)
                    await GUILib.waitforElement(Cart)
                })
            })
        })

    }

    this.checkAllUniforms = async function () {
        var Arr = []
        await GUILib.waitforElement(FirstUniformItem)
        await element.all(UniformItems).count().then(async function (count) {
            for (var n = 0; n < count; n++) {
                await console.log()
                await GUILib.waitforElement(FirstUniformItem)
                await element.all(UniformItems).then(async function (ItemArray) {
                    await browser.sleep(1500)
                    await console.log('====' + ItemArray.length)
                    var ItemElement = await ItemArray[n].getWebElement();
                    await ItemElement.click()
                    await GUILib.waitforElement(ItemName)
                    await GUILib.getText(ItemName).then(async function (name) {
                        await console.log(name)
                        await element.all(Size).count().then(async function (count) {
                            for (var x = 0; x < count; x++) {
                                await element.all(Size).then(async function (SizeArray) {
                                    var SizeElement = await SizeArray[x].getWebElement();
                                    await SizeElement.click()
                                    await SizeElement.getAttribute('data-value').then(async function (SizeName) {
                                        await GUILib.getText(Price).then(async function (PriceNumber) {
                                            await console.log(PriceNumber)
                                            if (PriceNumber == '$0.00') {
                                                await Arr.push(name);
                                                await Arr.push(SizeName);
                                            }
                                        })
                                    })
                                })
                            }
                        })
                    })
                })
                await browser.get('https://city-electric-supply-marketing.myshopify.com/pages/uniforms')
            }
            await console.log(Arr)
            expect(Arr.length).toBe(0)
        })
    }



    this.clickFilter = async function () {
        try {
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
                                if (text !== 'Counter Bundle') {
                                    await GUILib.waitforElement(FirstItem)
                                    await element.all(Item).count().then(async function (item) {
                                        await console.log("Number of Items:" + item)
                                        var x = 0
                                        for (var y = 1; y <= item; y++) {
                                            await GUILib.waitforElement(FirstItem)
                                            await browser.sleep(500)
                                            await element.all(Item).then(async function (ItemArray) {
                                                var ItemElement = await ItemArray[x].getWebElement();
                                                await x++;
                                                await browser.sleep(500)
                                                await ItemElement.click();
                                                await GUILib.waitforElement(ItemName)
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
                                            await GUILib.waitforElement(FirstItem)
                                            await element.all(Item).count().then(async function (item) {
                                                await console.log("Number of Items:" + item)
                                                var x = 0
                                                for (var y = 1; y <= item; y++) {
                                                    await GUILib.waitforElement(FirstItem)
                                                    await element.all(Item).then(async function (ItemArray) {
                                                        var ItemElement = await ItemArray[x].getWebElement();
                                                        await x++;
                                                        await browser.sleep(500)
                                                        await ItemElement.click();
                                                        await GUILib.waitforElement(Quantity)
                                                        await element.all(Image).count().then(async function (noimage) {
                                                            await console.log("noimage " + noimage)
                                                            await GUILib.getText(ItemName).then(async function (name) {
                                                                if (noimage == 0) {
                                                                    await console.log("HERE!!!")
                                                                    if (Arr.indexOf(name) === -1) {
                                                                        await console.log("========HERE!!!")
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
        catch (e) {
            await console.log(e)
            if (e.code !== 'ETIMEDOUT') {
                expect(true).toBe(false)
            }
        }
    }
}



module.exports = new Store_Form;