var GUILibrary = require('../Utility/GUILibrary_await.js');
var HomePage = require('./HomePage.js');
var fs = require('fs');
var CommonFunctions = require('../Utility/CommonFunctions.js');
var EC = protractor.ExpectedConditions;


var Blog_Form = function () {
    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();

    var BlogPage = by.xpath("//*[contains(@class,'container pt-4 mt-4 mb-4')]")
    var ArticlePage = by.xpath("//*[@id='page']//h1")
    var Image = by.xpath("//*[contains(@class,'postArticle col-4 mb-4')]")
    var Link = by.xpath("//*[@class='col-10 mt-4 mx-auto']//a[@href]")
    var ErrorText = by.xpath("//*[text()='Not Found']")

    //-----------------------------------------First Navigation Tabs Verifications----------------------------//

    this.clickAllImages = async function () {
        await browser.getCurrentUrl().then(async function (link) {
            await GUILib.waitforElement(BlogPage);
            await HomePage.clickSignUpClose();
            await element.all(Image).count().then(async function (count) {
                await console.log(count);
                for (var n = 1; n < count; n++) {
                    await element.all(Image).then(async function (AllImage) {
                        var Image = await AllImage[n].getWebElement();
                        await browser.wait(EC.elementToBeClickable(AllImage[n]), 5000);
                        await Image.click().then(async function () {
                            await HomePage.clickSignUpClose();
                            await console.log("Element is clicked");
                            await browser.getCurrentUrl().then(async function (link1) {
                                await element.all(Link).count().then(async function (count1) {
                                    await console.log(count1);
                                    for (var y = 1; y < count1; y++) {
                                        await element.all(Link).then(async function (AllLink) {
                                            var Href = await AllLink[y].getWebElement();
                                            await browser.wait(EC.elementToBeClickable(AllLink[y]), 5000);
                                            await Href.click().then(async function () {
                                                await browser.getCurrentUrl().then(async function (url) {
                                                    await console.log(url);
                                                    await element(ErrorText).isPresent().then(async function (result) {
                                                        expect(result).toBe(false)
                                                    })
                                                })
                                                await browser.get(link1);
                                                await GUILib.waitforElement(ArticlePage);
                                            })
                                        })
                                    }
                                    await browser.get(link);
                                    await GUILib.waitforElement(BlogPage);
                                })
                            })
                        })
                    })
                }
            })
        })
    }

}








module.exports = new Blog_Form;