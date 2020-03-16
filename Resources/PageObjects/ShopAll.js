var GUILibrary = require('../Utility/GUILibrary_await.js');
var HomePage = require('./HomePage.js');
var fs = require('fs');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var ShopAll_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();

    var z = 1;
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
                break;
            case 2:
                await HomePage.clickSkinBody();
                break;
            case 3:
                await HomePage.clickSkinFace();
                break;
            case 4:
                await HomePage.clickSkinAloe();
                break;
            case 5:
                await HomePage.clickSunSprays();
                break;
            case 6:
                await HomePage.clickSunAfterSun();
                break;
            case 7:
                await HomePage.clickSunTanning();
                break;
            case 8:
                await HomePage.clickHealthAloeJuice();
                break;
            case 9:
                await HomePage.clickHouseholdCleaning();
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
                        await browser.wait(EC.elementToBeClickable(AllProducts[n]), 5000);
                        await Product.click().then(async function () {
                            await console.log("Element is clicked");
                            await HomePage.clickSignUpClose();
                            await GUILib.waitforElement(ProductPage);
                            await element(OutStock).isPresent().then(async function (resultOutStock) {
                                if (resultOutStock == true) {
                                    await element(AddToCartBtn).isPresent().then(async function (resultAddToCartBtn) {
                                        expect(resultAddToCartBtn).not.toBe(true)
                                    })
                                } else {
                                    await browser.wait(EC.elementToBeClickable(element(AddToCartBtn)), 5000);
                                    await GUILib.clickObject(AddToCartBtn);
                                    await HomePage.clickSignUpClose();
                                    await browser.wait(EC.textToBePresentInElement(element(CartCount), z), 5000);
                                    await GUILib.getText(CartCount).then(async function (CartCount) {
                                        await console.log(CartCount);
                                    })
                                    await z++;
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

    this.verifyProductsCart = async function () {
        var items1 = [];
        var items2 = [];
        await browser.getCurrentUrl().then(async function (link) {
            await GUILib.waitforElement(Page);
            await HomePage.clickSignUpClose();
            var Product = await CF.setProduct()
            await element.all(Product).count().then(async function (count) {
                for (var a = 0; a <= 2; a++) {
                    await element.all(Product).then(async function (AllProducts) {
                        var RandomNumber = await Math.floor(Math.random() * count);
                        await console.log("Random Number: " + RandomNumber);
                        await HomePage.clickSignUpClose();
                        await browser.wait(EC.elementToBeClickable(AllProducts[RandomNumber]), 15000);
                        var Product = await AllProducts[RandomNumber].getWebElement();
                        await Product.click();
                        await HomePage.clickSignUpClose();
                        await GUILib.waitforElement(ProductPage);
                        await element(OutStock).isPresent().then(async function (resultOutStock) {
                            if (resultOutStock == true) {
                                await console.log("Product is out of stock");
                                await element(AddToCartBtn).isPresent().then(async function (resultAddToCartBtn) {
                                    expect(resultAddToCartBtn).not.toBe(true)
                                })

                            } else {
                                await console.log("Product is in stock");
                                await element(ProductText).getText().then(async function (Text1) {
                                    Text1 = await Text1.replace("–", " ")
                                    console.log("Random Product: " + Text1);
                                    if (items1.indexOf(Text1) === -1) {
                                        items1.push(Text1);
                                        console.log(items1);
                                    }
                                    await browser.wait(EC.elementToBeClickable(element(AddToCartBtn)), 5000);
                                    await GUILib.clickObject(AddToCartBtn, "Product was added to Cart");
                                    await HomePage.clickSignUpClose();
                                    await browser.wait(EC.textToBePresentInElement(element(CartCount), z), 5000);
                                    await z++;
                                })
                            }
                            await browser.get(link);
                            await GUILib.waitforElement(Page);
                        })
                    })
                }
            })
        })
        await GUILib.clickObject(Cart, "Cart Icon is clicked");
        await HomePage.clickSignUpClose();
        await GUILib.waitforElement(ViewCart);
        await GUILib.clickObject(ViewCart, "View Cart Button is clicked");
        await browser.sleep(500);
        await element(ContinueShopping).isDisplayed().then(async function (result) {
            if (result !== true) {
                await GUILib.clickObject(Cart, "Cart Icon is clicked");
                await HomePage.clickSignUpClose();
                await GUILib.waitforElement(ViewCart);
                await GUILib.clickObject(ViewCart, "View Cart Button is clicked");
                await browser.sleep(500);
            }
        })
        await element.all(ProductDetails).count().then(async function (count) {
            await element.all(ProductDetails).then(async function (AllProductDetails) {
                await console.log("Number of Unique Products in Cart: " + count)
                for (var n = 0; n < count; n++) {
                    var Product = await AllProductDetails[n].getWebElement();
                    await Product.getText().then(async function (Text2) {
                        Text2 = await Text2.replace("-", " ")
                        await console.log("Product Name " + Text2)
                        await items2.push(Text2);
                    })
                }
            })
        })
        await console.log("Comapring: " + items1 + " and " + items2)
        await expect(items1).toEqual(items2)

    }

    this.verifyProductsMiniCart = async function () {
        var items1 = [];
        var items2 = [];
        await browser.getCurrentUrl().then(async function (link) {
            await GUILib.waitforElement(Page);
            await HomePage.clickSignUpClose();
            var Product = await CF.setProduct()
            await element.all(Product).count().then(async function (count) {
                for (var a = 0; a <= 2; a++) {
                    await element.all(Product).then(async function (AllProducts) {
                        var RandomNumber = await Math.floor(Math.random() * count);
                        await console.log("Random Number: " + RandomNumber);
                        await HomePage.clickSignUpClose();
                        await browser.wait(EC.elementToBeClickable(AllProducts[RandomNumber]), 15000);
                        var Product = await AllProducts[RandomNumber].getWebElement();
                        await Product.click();
                        await HomePage.clickSignUpClose();
                        await GUILib.waitforElement(ProductPage);
                        await element(OutStock).isPresent().then(async function (resultOutStock) {
                            if (resultOutStock == true) {
                                await console.log("Product is out of stock");
                                await element(AddToCartBtn).isPresent().then(async function (resultAddToCartBtn) {
                                    expect(resultAddToCartBtn).not.toBe(true)
                                })

                            } else {
                                await console.log("Product is in stock");
                                await element(ProductText).getText().then(async function (Text1) {
                                    Text1 = await Text1.replace("–", " ")
                                    console.log("Random Product: " + Text1);
                                    if (items1.indexOf(Text1) === -1) {
                                        items1.push(Text1);
                                        console.log(items1);
                                    }
                                    await browser.wait(EC.elementToBeClickable(element(AddToCartBtn)), 5000);
                                    await GUILib.clickObject(AddToCartBtn, "Product was added to Cart");
                                    await HomePage.clickSignUpClose();
                                    await browser.wait(EC.textToBePresentInElement(element(CartCount), z), 5000);
                                    await z++;
                                })
                            }
                            await browser.get(link);
                            await GUILib.waitforElement(Page);
                        })
                    })
                }
            })
        })
        await GUILib.clickObject(Cart, "Cart Icon is clicked");
        await GUILib.waitforElement(ViewCart)
        await element.all(ProductDetailsMiniCart).count().then(async function (count) {
            await element.all(ProductDetailsMiniCart).then(async function (AllProductDetailsMiniCart) {
                await console.log("Number of Unique Products in Mini Cart: " + count)
                for (var n = 0; n < count; n++) {
                    var Product = await AllProductDetailsMiniCart[n].getWebElement();
                    await Product.getText().then(async function (Text2) {
                        if (browser.browserName !== 'Safari') {
                        Text2 = await Text2.toUpperCase().replace("-", " ")
                        } else {
                            Text2 = await Text2.replace("-", " ")
                        }
                        await console.log("Product Name " + Text2)
                        await items2.push(Text2);
                    })
                }
            })
        })
        await console.log("Comapring: " + items1 + " and " + items2)
        await expect(items1).toEqual(items2)

    }

    // this.verifyProductsMiniCart = async function () {
    //     await GUILib.waitforElement(ShopAllPage);
    //     await HomePage.clickSignUpClose();
    //     await element.all(Product).count().then(async function (count) {
    //         for (var a = 0; a < 5; a++) {
    //             await HomePage.clickSignUpClose();
    //             await element.all(Product).then(async function (AllProducts) {
    //                 var RandomNumber = await Math.round(Math.random() * count);
    //                 console.log("Random Number: " + RandomNumber);
    //                 var Product = await AllProducts[RandomNumber].getWebElement();
    //                 var n = RandomNumber + 1
    //                 var ElementText = by.xpath('//*[@id="wooProducts"]/div/div/div[' + n + ']/h6')
    //                 await element(ElementText).getText().then(async function (Text1) {
    //                     console.log("Random Product: " + Text1);
    //                     await browser.wait(EC.elementToBeClickable(element(by.xpath('//*[@id="wooProducts"]/div/div/div[' + n + ']/a'))), 5000);
    //                     await Product.click().then(async function () {
    //                         await console.log(Text1 + " is clicked");
    //                         await HomePage.clickSignUpClose();
    //                         await GUILib.waitforElement(ProductPage);
    //                         await element(OutStock).isPresent().then(async function (resultOutStock) {
    //                             if (resultOutStock == true) {
    //                                 await console.log("Product is out of stock");
    //                                 await element(AddToCartBtn).isPresent().then(async function (resultAddToCartBtn) {
    //                                     expect(resultAddToCartBtn).not.toBe(true)
    //                                 })
    //                             } else {
    //                                 await console.log("Product is in stock");
    //                                 await browser.wait(EC.elementToBeClickable(element(AddToCartBtn)), 5000);
    //                                 await GUILib.clickObject(AddToCartBtn, "Product was added to Cart");
    //                                 await HomePage.clickSignUpClose();
    //                                 await browser.wait(EC.textToBePresentInElement(element(CartCount), z), 15000);
    //                                 await z++;
    //                                 await GUILib.clickObject(Cart, "Cart Icon is clicked");
    //                                 await HomePage.clickSignUpClose();
    //                                 var ProductDetailsMiniCart = by.xpath("//*[@id='wooMiniCart']/ul/li[" + y + "]/ul/li[3]/p/a")
    //                                 await y++;
    //                                 await element(ProductDetailsMiniCart).getAttribute("textContent").then(async function (Text2) {
    //                                     Text2 = await Text2.toUpperCase();
    //                                     await console.log("Product in Mini Cart " + Text2);
    //                                     await console.log("Comparing: " + Text1 + " and " + Text2);
    //                                     expect(Text1).toContain(Text2)
    //                                 })
    //                             }
    //                             await browser.get("https://fotedev.wpengine.com/shop/");
    //                             await GUILib.waitforElement(ShopAllPage);
    //                         })
    //                     })
    //                 })
    //             })
    //         }
    //     })
    // }



}
module.exports = new ShopAll_Form;