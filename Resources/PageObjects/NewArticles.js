var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');

var NewArticles = function () {
    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');

    //----------------------------------------------------------------------------------------//

    var Article = by.xpath("//a[contains(@href, 'https:')]/img")
    var Logo = by.xpath('//*[@alt="Fusion Lamps"]')
    var Error404 = by.xpath("//h1[contains(text(),'404')]")


    "//a[contains(@href, 'https://www.tamco')]"
    var Category = by.xpath("//a[contains(@href, 'https://fusion-lamps.com/category/')]/span")
    var Download = by.xpath("//a[contains(text(),'DOWNLOAD')]")
    var Download1 = by.xpath("/html/body/div[1]/section/div/div[1]/p[14]/a")
    var Download2 = by.xpath("/html/body/div[1]/section/div/div[1]/p[3]/a")
    // var Here = by.xpath("//text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'Here')]")
    var Wpengine = by.xpath("//p[@class='p3']/a[contains(@href, 'fusion')]")
    var Here = by.xpath("//a[contains(text(), 'HERE')]");
    var Here1 = by.xpath("//a[contains(text(), 'Here')]");
    var LearnMore = by.xpath("//a[contains(text(), 'LEARN MORE')]");
    var HomePage = by.xpath("//a[contains(@href, 'www.fusion-lamps.com')]")
    var CES = by.xpath("//a[text()='City Electric Supply.']")
    var HidSeries = by.xpath("//a[contains(@href,'hid-series')]")
    var Sorry = by.xpath("//p[contains(text(), 'Sorry')]")



    //-----------------------------------Functions-----------------------------------//

    this.clickAllArticles = async function () {
        var Arr = []
        await element.all(Article).count().then(async function (count) {
            await console.log(count)
            for (var n = 1; n < count; n++) {
                await browser.sleep(500)
                var elm = by.xpath('//*[@id="newsArticlesMain"]/div/div[' + n + ']')
                await GUILib.scrollToElement(elm)
                await GUILib.clickObject(elm)
                await browser.getCurrentUrl().then(async function (url) {
                    await console.log("Checking url " + url)
                    await CF.check404()
                    await CF.checkSorry()
                    await element.all(Here).count().then(async function (AllHere) {
                        if (AllHere > 0) {
                            await GUILib.clickObject(Here)
                            await CF.check404()
                            await CF.checkSorry()
                            await browser.get(url)
                        }
                    })
                    await element.all(Here1).count().then(async function (AllHere1) {
                        if (AllHere1 > 0) {
                            await GUILib.clickObject(Here1)
                            await CF.check404()
                            await CF.checkSorry()
                            await browser.get(url)
                        }
                    })
                    await element.all(LearnMore).count().then(async function (AllLearnMore) {
                        if (AllLearnMore > 0) {
                            await console.log("Checking 'Learn More' button")
                            await CF.clickLink404(LearnMore, 'FLED_HID_5K_Flyer_v3.pdf')
                            await browser.get(url)
                        }
                    })
                    await element.all(Category).count().then(async function (AllCategory) {
                        if (AllCategory > 0) {
                            for (var n = 0; n < AllCategory; n++) {
                                await element.all(Category).then(async function (AllCategoryArray) {
                                    await AllCategoryArray[n].click()
                                    await CF.check404()
                                    await CF.checkSorry()
                                    await browser.getCurrentUrl().then(async function (url1) {
                                        expect(url1).toContain('https://fusion-lamps.com/category')
                                    })
                                })
                                await browser.get(url)
                            }
                        }
                    })
                    await element.all(HomePage).count().then(async function (AllHomePage) {
                        if (AllHomePage > 0) {
                            for (var n = 0; n < AllHomePage; n++) {
                                await element.all(HomePage).then(async function (AllHomePageArray) {
                                    await AllHomePageArray[n].click()
                                    await CF.check404()
                                    await CF.checkSorry()
                                })
                                await browser.get(url)
                            }
                        }
                    })
                    await element.all(Download).count().then(async function (AllDownload) {
                        if (AllDownload > 0) {
                            await console.log("AllDownload" + AllDownload)
                            try {
                                await CF.clickLink404(Download2, 'apps.apple.com/us/app/fusion-lamps-roi-calculator')
                                await browser.get(url)
                            } catch (e) {
                                console.log("There is no such button")
                            }
                            try {
                                await CF.clickLink404(Download1, 'apps.apple.com/us/app/fusion-lamps-roi-calculator')
                                await browser.get(url)
                            } catch (e) {
                                console.log("There is no such button")
                            }
                            try {
                                await CF.clickLink404(Download, 'newsletter/pdf/FUS_UTUBE_15.pdf')
                                await browser.get(url)
                            } catch (e) {
                                console.log("There is no such button")
                            }
                        }
                    })
                    await element.all(Wpengine).count().then(async function (AllWpengine) {
                        if (AllWpengine > 0) {
                            for (var n = 0; n < AllWpengine; n++) {
                                await element.all(Wpengine).then(async function (AllWpengineArray) {
                                    await AllWpengineArray[n].click()
                                    await CF.check404()
                                    await CF.checkSorry()
                                    await browser.getCurrentUrl().then(async function (url2) {
                                        await console.log("Expecting " + url2 + " not to be https://fusion-lamps.com/")
                                        expect(url2).not.toBe('https://fusion-lamps.com/')
                                    })
                                })
                                await browser.get(url)
                            }
                        }
                    })
                    await element.all(HidSeries).count().then(async function (AllHidSeries) {
                        if (AllHidSeries > 0) {
                            for (var n = 0; n < AllHidSeries; n++) {
                                await element.all(HidSeries).then(async function (AllHidSeriesArray) {
                                    await AllHidSeriesArray[n].click()
                                    await CF.check404()
                                    await CF.checkSorry()
                                })
                                await browser.get(url)
                            }
                        }
                    })
                    await element.all(CES).count().then(async function (AllCES) {
                        if (AllCES > 0) {
                            await GUILib.clickLinkWait(CES)
                            await browser.getCurrentUrl().then(async function (url3) {
                                await console.log("Expecting " + url3 + " to be https://www.cityelectricsupply.com/")
                                expect(url3).toContain('www.cityelectricsupply.com')
                            })
                            await browser.get(url)                
                        }
                    })
                    await browser.get('https://fusion-lamps.com/resources/news-articles/')
                    await GUILib.waitforElement(Logo)
                })
            }
        })
    }








}



module.exports = new NewArticles;