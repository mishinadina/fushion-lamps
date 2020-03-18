var GUILibrary = require('../Utility/GUILibrary_await.js');
var HomePage = require('./HomePage.js');
var fs = require('fs');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var ShopAll_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();

    var a = 1;
    var y = 1;
    var n;



    var ElementText = by.xpath('//*[@id="wooProducts"]//h6')
    var ProductText = by.xpath('//*[@id="wooSummary"]//h1')

    var Page = by.xpath('//*[@class="fixed-top"]');


    var ShopAllPage = by.xpath('//*[@class= "container py-5"]');
    var ProductPage = by.xpath('//*[@class= "card-body p-5"]');

    var SignUpClose = by.xpath("//*[contains(@class,'mc-closeModal')]")
    var AddToCartBtn = by.xpath("//*[text()='Add to Cart']")
    var CartCount = by.xpath("//*[@id='miniCartTrigger']/span/i[2]")
    var CartQuantity = by.xpath('//*[@id="wooCart"]//del')
    var ProductDetails = by.xpath("//*[@id='wooCart']//h6/a")

    var OutStock = by.xpath("//*[text()='Out of stock']")

    var Cart = by.xpath('//*[@id="miniCartTrigger"]/span/i[1]')
    var ViewCart = by.xpath("//*[@id='wooMiniCart']//*[text()='View cart']")
    var Checkout = by.xpath("//*[text()='Checkout']")
    var ContinueShopping = by.xpath("//*[text()='Continue Shopping']")
    var Summary = by.xpath("//*[text()='Summary']")

    var ProductDetailsMiniCart = by.xpath("//*[@id='wooMiniCart']/ul//p/a")

    //-----------------------------------------First Navigation Tabs Verifications----------------------------//

    this.writeProductData = async function () {
        await GUILib.writeJSON(Product, ElementText);
    }

    this.chooseRandomCategory = async function () {

        switch (Math.floor(Math.random() * 9) + 1) {
            case 1:
                await HomePage.clickShopAll();
                await HomePage.clickSignUpClose();
                break;
            case 2:
                await HomePage.clickSkinBody();
                await HomePage.clickSignUpClose();
                break;
            case 3:
                await HomePage.clickSkinFace();
                await HomePage.clickSignUpClose();
                break;
            case 4:
                await HomePage.clickSkinAloe();
                await HomePage.clickSignUpClose();
                break;
            case 5:
                await HomePage.clickSunSprays();
                await HomePage.clickSignUpClose();
                break;
            case 6:
                await HomePage.clickSunAfterSun();
                await HomePage.clickSignUpClose();
                break;
            case 7:
                await HomePage.clickSunTanning();
                await HomePage.clickSignUpClose();
                break;
            case 8:
                await HomePage.clickHealthAloeJuice();
                await HomePage.clickSignUpClose();
                break;
            case 9:
                await HomePage.clickHouseholdCleaning();
                await HomePage.clickSignUpClose();
        }

    }

    this.clickAllProducts = async function () {
        await browser.getCurrentUrl().then(async function (link) {
            await GUILib.waitforElement(Page);
            var Product = await CF.setProduct()
            await HomePage.clickSignUpClose();
            await element.all(Product).count().then(async function (count) {
                await console.log(count);
                for (var n = 1; n < count; n++) {
                    await element.all(Product).then(async function (AllProducts) {
                        var Product = await AllProducts[n].getWebElement();
                        await element.all(ElementText).then(async function (AllElementText) {
                            var ElementText = await AllElementText[n].getWebElement();
                            await ElementText.getText().then(async function (Text1) {
                                console.log(Text1);
                                await HomePage.clickSignUpClose();
                                await browser.wait(EC.elementToBeClickable(AllProducts[n]), 5000);
                                await Product.click().then(async function () {
                                    await HomePage.clickSignUpClose();
                                    await console.log("Element is clicked");
                                    await GUILib.waitforElement(ProductPage);
                                    var ProductPageText = by.xpath('//*[@id="wooSummary"]//h1')
                                    await element(ProductPageText).getText().then(async function (Text2) {
                                        await console.log(Text2);
                                        expect(Text1).toContain(Text2);
                                        await browser.get(link);
                                        await GUILib.waitforElement(Page);
                                    })
                                })
                            })
                        })
                    })
                }
            })
        })
    }

    this.addAllProducts = async function () {
        await browser.getCurrentUrl().then(async function (link) {
            await GUILib.waitforElement(Page);
            var Product = await CF.setProduct()
            await HomePage.clickSignUpClose();
            await element.all(Product).count().then(async function (count) {
                await console.log(count);
                for (var n = 0; n < count; n++) {
                    await element.all(Product).then(async function (AllProducts) {
                        var Product = await AllProducts[n].getWebElement();
                        await HomePage.clickSignUpClose();
                        await browser.wait(EC.elementToBeClickable(AllProducts[n]), 5000);
                        await Product.click().then(async function () {
                            await console.log("Element is clicked");
                            await HomePage.clickSignUpClose();
                            await GUILib.waitforElement(ProductPage);
                            await element(OutStock).isPresent().then(async function (resultOutStock) {
                                if (resultOutStock == true) {
                                    await console.log("Product is out of stock");
                                    await element(AddToCartBtn).isPresent().then(async function (resultAddToCartBtn) {
                                        expect(resultAddToCartBtn).not.toBe(true)
                                    })
                                } else {
                                    await HomePage.clickSignUpClose();
                                    await browser.wait(EC.elementToBeClickable(element(AddToCartBtn)), 5000);
                                    await GUILib.clickObject(AddToCartBtn);
                                    await HomePage.clickSignUpClose();
                                    await browser.wait(EC.textToBePresentInElement(element(CartCount), a), 5000);
                                    await GUILib.getText(CartCount).then(async function (CartCount) {
                                        await console.log(CartCount);
                                    })
                                    await a++;
                                }
                                await browser.get(link);
                                await GUILib.waitforElement(Page);
                            })
                        })
                    })
                }
            })
        })
    }

    

    

    
}
module.exports = new ShopAll_Form;