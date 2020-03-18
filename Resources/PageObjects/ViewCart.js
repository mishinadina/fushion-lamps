var GUILibrary = require('../Utility/GUILibrary_await.js');
var HomePage = require('./HomePage.js');
var fs = require('fs');
var CommonFunctions = require('../Utility/CommonFunctions.js');
var EC = protractor.ExpectedConditions;


var ViewCart_Form = function () {
    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();

    var z = 1;

    var Page = by.xpath('//*[@class="fixed-top"]');
    
    var Description = by.xpath('//*[@href = "#tab-description"]');
    var OutStock = by.xpath("//*[text()='Out of stock']")
    var QuantityNumber = by.xpath('//*[text()="Quantity"]//following::input[@name="quantity"]');
    var AddToCartBtn = by.xpath("//*[text()='Add to Cart']")
    var CartCount = by.xpath("//*[@id='miniCartTrigger']/span/i[2]")

    var ProductText = by.xpath('//*[@id="wooSummary"]//h1')
    var ProductPage = by.xpath('//*[@class= "card-body p-5"]');
    var ProductTextProductPage = by.xpath('//*[@id="wooSummary"]//h1')

    var Cart = by.xpath('//*[@id="miniCartTrigger"]/span/i[1]')
    var ViewCart = by.xpath("//*[@id='wooMiniCart']//*[text()='View cart']")
    var ProductDetails = by.xpath("//*[@id='wooCart']//h6/a")
    var DeleteFromMiniCart = by.xpath("//li[@class='remove']//*[@class='ion ion-ios-close-empty']")
    var NoProductsInCart = by.xpath('//*[text()="No products in the cart."]')

    var ContinueShopping = by.xpath("//*[text()='Continue Shopping']")

    //-----------------------------------------First Navigation Tabs Verifications----------------------------//

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

    this.clickRandomProduct = async function () {
        await GUILib.waitforElement(Page);
        var Product = await CF.setProduct();
        await HomePage.clickSignUpClose();
        await element.all(Product).count().then(async function (count) {
            await console.log(count)
            await HomePage.clickSignUpClose();
            await element.all(Product).then(async function (AllProducts) {
                await element.all(ProductText).then(async function (AllProductsText) {
                    var RandomNumber = await Math.floor(Math.random() * count);
                    console.log("Random Product Number: " + RandomNumber);
                    var Product = await AllProducts[RandomNumber].getWebElement();
                    var ProductText = await AllProductsText[RandomNumber].getWebElement();
                    await ProductText.getText().then(async function (Text1) {
                        console.log("Random Product: " + Text1);
                        await HomePage.clickSignUpClose();
                        await Product.click().then(async function () {
                        })
                    })
                })
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
                for (var a = 0; a <= 3; a++) {
                    await element.all(Product).then(async function (AllProducts) {
                        var RandomNumber = await Math.floor(Math.random() * count);
                        await console.log("Random Number: " + RandomNumber);
                        await HomePage.clickSignUpClose();
                        await browser.wait(EC.elementToBeClickable(AllProducts[RandomNumber]), 15000);
                        var Product = await AllProducts[RandomNumber].getWebElement();
                        await HomePage.clickSignUpClose();
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
                                  
                                    await browser.wait(EC.elementToBeClickable(element(AddToCartBtn)), 9000);
                                    await HomePage.clickSignUpClose();
                                    await GUILib.clickObject(AddToCartBtn, "Product was added to Cart");
                                    await HomePage.clickSignUpClose();
                                    
                                    await console.log("Expected Number of Items in Cart after Adding: " + z)
                                    await browser.wait(EC.textToBePresentInElement(element(CartCount), z), 17000);
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
        await HomePage.clickSignUpClose();
        await GUILib.clickObject(Cart, "Cart Icon is clicked");
        await HomePage.clickSignUpClose();
        await GUILib.waitforElement(ViewCart);
        await GUILib.clickObject(ViewCart, "View Cart Button is clicked");
        await browser.sleep(500);
        await HomePage.clickSignUpClose();
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

    this.ViewCart = async function () {
        var items1 = [];
        var items2 = [];
        await GUILib.waitforElement(ProductPage);
        await element(OutStock).isPresent().then(async function (resultOutStock) {
            if (resultOutStock == true) {
                await console.log("Product is out of stock");
                await element(AddToCartBtn).isPresent().then(async function (resultAddToCartBtn) {
                    expect(resultAddToCartBtn).not.toBe(true)
                })
            } else {
                await console.log("Product is in stock");
                await element(ProductTextProductPage).getText().then(async function (Text1) {
                    Text1 = await Text1.replace("–", " ")
                    console.log("Random Product: " + Text1);
                    if (items1.indexOf(Text1) === -1) {
                        items1.push(Text1);
                        console.log(items1);
                    }
                    await browser.wait(EC.elementToBeClickable(element(AddToCartBtn)), 5000);
                    await HomePage.clickSignUpClose();
                    await GUILib.clickObject(AddToCartBtn, "Product was added to Cart");
                    await HomePage.clickSignUpClose();
                    await browser.wait(EC.textToBePresentInElement(element(CartCount), z), 5000);
                })

                await GUILib.clickObject(Cart, "Cart Icon is clicked");
                await GUILib.waitforElement(ViewCart);
                await GUILib.clickObject(ViewCart, "View Cart is clicked");
                await GUILib.waitforElement(ContinueShopping);
            }
        })
    }
}








module.exports = new ViewCart_Form;