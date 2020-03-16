var GUILibrary = require('../Utility/GUILibrary_await.js');
var HomePage = require('../../Resources/PageObjects/HomePage.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var Product_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();


    var ShopAllPage = by.xpath('//*[@class= "container py-5"]');
    var OutStock = by.xpath("//*[text()='Out of stock']")

    var Page = by.xpath('//*[@class="fixed-top"]');

    var Description = by.xpath('//*[@href = "#tab-description"]');
    var Ingredients = by.xpath('//*[@href = "#tab-ingredients"]');
    var Benefits = by.xpath('//*[@href = "#tab-ingredients"]');

    var Reviews = by.xpath('//*[@href = "#tab-reviews"]');
    var Rating = by.xpath('//*[@class = "stars"]');
    var YourReview = by.xpath('//*[@id = "comment"]');
    var Name = by.xpath('//*[@id = "author"]');
    var Email = by.xpath('//*[@id = "email"]');
    var SubmitBtn = by.xpath('//*[@value = "Submit"]');

    var QuantityNumber = by.xpath('//*[text()="Quantity"]//following::input[@name="quantity"]');
    var Plus = by.xpath('//*[@class = "input-group-append"]');
    var Minus = by.xpath('//*[@class = "input-group-prepend"]');
    var AddToCartBtn = by.xpath("//*[text()='Add to Cart']")
    var CartCount = by.xpath("//*[@id='miniCartTrigger']/span/i[2]")

    var Cart = by.xpath('//*[@id="miniCartTrigger"]/span/i[1]')
    var ViewCart = by.xpath("//*[@id='wooMiniCart']//*[text()='View cart']")
    var Checkout = by.xpath("//*[text()='Checkout']")
    var ContinueShopping = by.xpath("//*[text()='Continue Shopping']")

    var CartQuantity = by.xpath('//*[@id="wooCart"]//del')

    var RecommendedProductsCarousel = by.xpath('//*[@id="wooProducts"]/div/div')
    var ArrowNext = by.xpath('//*[@class="owl-next"]')
    var ArrowPrev = by.xpath('//*[@class="owl-prev"]')


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
        var Product = await CF.setProduct()
        await HomePage.clickSignUpClose();
        await element.all(Product).count().then(async function (count) {
            await HomePage.clickSignUpClose();
            await element.all(Product).then(async function (AllProducts) {
                var RandomNumber = await Math.floor(Math.random() * count);
                if (RandomNumber == count) {
                    RandomNumber = await RandomNumber - 1
                }
                console.log("Random Product Number: " + RandomNumber);
                var Product = await AllProducts[RandomNumber - 1].getWebElement();
                var n = RandomNumber + 1
                var ElementText = by.xpath('//*[@id="wooProducts"]/div/div/div[' + n + ']/h6')
                await element(ElementText).getText().then(async function (Text1) {
                    console.log("Random Product: " + Text1);
                    await Product.click().then(async function () {
                        // await GUILib.clickObject(Ingredients, "Ingredients Tab is clicked")
                        // await GUILib.clickObject(Benefits, "Benefits Tab is clicked")
                        // await GUILib.clickObject(Reviews, "Reviews Tab is clicked")
                    })
                })
            })
        })
    }

    this.addMoreQuantity = async function () {
        await GUILib.clickObject(Description, "Description Tab is clicked")
        await HomePage.clickSignUpClose();
        await element(OutStock).isPresent().then(async function (resultOutStock) {
            if (resultOutStock == true) {
                await element(AddToCartBtn).isPresent().then(async function (resultAddToCartBtn) {
                    expect(resultAddToCartBtn).not.toBe(true)
                })
            } else {
                var RandomNumber = await Math.floor(Math.random() * 9) + 2
                for (var x = 1; x < RandomNumber; x++) {
                    await GUILib.clickObject(Plus, "Plus button was clicked random times");
                }
                await GUILib.clickObject(AddToCartBtn, "Add To Cart button is clicked")
                await element(QuantityNumber).getAttribute('value').then(async function (Quantity) {
                    await console.log(Quantity);
                    await GUILib.clickObject(Plus, "Plus button was clicked");
                    await element(QuantityNumber).getAttribute('value').then(async function (Quantity1) {
                        await console.log(Quantity1);
                        expect(Quantity).toBeLessThan(Quantity1)
                    })
                })
            }
        })
    }

    this.addLessQuantity = async function () {
        await HomePage.clickSignUpClose();
        await GUILib.clickObject(Description, "Description Tab is clicked")
        await HomePage.clickSignUpClose();
        await element(OutStock).isPresent().then(async function (resultOutStock) {
            if (resultOutStock == true) {
                await element(AddToCartBtn).isPresent().then(async function (resultAddToCartBtn) {
                    expect(resultAddToCartBtn).not.toBe(true)
                })
            } else {
                var RandomNumber = await Math.floor(Math.random() * 9)
                for (var x = 1; x < RandomNumber; x++) {
                    await GUILib.clickObject(Plus, "Plus button was clicked");
                }
                await GUILib.clickObject(AddToCartBtn, "Add To Cart button is clicked")
                await element(QuantityNumber).getAttribute('value').then(async function (Quantity) {
                    await console.log(Quantity);
                    await GUILib.clickObject(Minus, "Minus button was clicked");
                    await element(QuantityNumber).getAttribute('value').then(async function (Quantity1) {
                        await console.log(Quantity1);
                        expect(Quantity).toBeGreaterThan(Quantity1)
                    })
                })
            }
        })
    }

    this.fillQuantityMiniCart = async function () {
        await HomePage.clickSignUpClose();
        await GUILib.clickObject(Description, "Description Tab is clicked")
        await HomePage.clickSignUpClose();
        await element(OutStock).isPresent().then(async function (resultOutStock) {
            if (resultOutStock == true) {
                await element(AddToCartBtn).isPresent().then(async function (resultAddToCartBtn) {
                    expect(resultAddToCartBtn).not.toBe(true)
                })
            } else {
                await element(QuantityNumber).getAttribute('max').then(async function (MaxQuantityNumber) {
                    await console.log("Max Quantity Number " + MaxQuantityNumber);
                    await element(QuantityNumber).clear();
                    var RandomNumber = await Math.floor(Math.random() * MaxQuantityNumber);
                    RandomNumber = await RandomNumber.toString();
                    await console.log("Random Quantity Number: " + RandomNumber);
                    await GUILib.typeValue(QuantityNumber, RandomNumber)
                    await GUILib.clickObject(AddToCartBtn, "Add To Cart button is clicked")
                    await HomePage.clickSignUpClose();
                    await browser.wait(EC.textToBePresentInElement(element(CartCount), RandomNumber), 50000);
                    await GUILib.getText(CartCount).then(async function (ActualCartCount) {
                        expect(ActualCartCount).toEqual(RandomNumber)
                    })
                })
            }
        })
    }

    this.fillQuantityCart = async function () {
        await HomePage.clickSignUpClose();
        await GUILib.clickObject(Description, "Description Tab is clicked")
        await HomePage.clickSignUpClose();
        await element(OutStock).isPresent().then(async function (resultOutStock) {
            if (resultOutStock == true) {
                await element(AddToCartBtn).isPresent().then(async function (resultAddToCartBtn) {
                    expect(resultAddToCartBtn).not.toBe(true)
                })
            } else {
                await element(QuantityNumber).getAttribute('max').then(async function (MaxQuantityNumber) {
                    await console.log("Max Quantity Number: " + MaxQuantityNumber);
                    await element(QuantityNumber).clear();
                    var RandomNumber = await Math.floor(Math.random() * MaxQuantityNumber);
                    RandomNumber = await RandomNumber.toString();
                    await console.log("Random Quantity Number: " + RandomNumber);
                    await GUILib.typeValue(QuantityNumber, RandomNumber)
                    await GUILib.clickObject(AddToCartBtn, "Add To Cart button is clicked")
                    await HomePage.clickSignUpClose();
                    await browser.wait(EC.textToBePresentInElement(element(CartCount), RandomNumber), 50000);
                    await CF.goToCart(CartCount, ViewCart, ContinueShopping)
                    await GUILib.getText(CartQuantity).then(async function (CartQuantity) {
                        await console.log("Actual Quantity Number in Cart: " + CartQuantity);
                        expect(CartQuantity).toContain(RandomNumber)
                    })
                })
            }
        })
    }

    this.clickReviewsRating = async function () {
        await GUILib.clickObject(Reviews, "Reviews Tab is clicked")
        await HomePage.clickSignUpClose();
        await GUILib.waitforElement(Rating)
        for (var n = 1; n <= 5; n++) {
            await console.log("Star # " + n + " is clicked");
            await GUILib.clickObject(by.xpath('//*[@class = "star-' + n + '"]'))
        }
    }

    this.checkReviewRequired = async function () {
        //await GUILib.clickObject(Reviews, "Reviews Tab is clicked")
        await CF.checkRequired(YourReview, 'aria-required');
    }

    this.checkNameRequired = async function () {
       // await GUILib.clickObject(Reviews, "Reviews Tab is clicked")
        await CF.checkRequired(Name, 'aria-required');

    }

    this.checkEmailRequired = async function () {
        await GUILib.clickObject(Reviews, "Reviews Tab is clicked")
        await CF.checkRequired(Email, 'aria-required');
    }

    this.clickArrowNextCarousel = async function () {
        var Arr = [];
        var Arr1 = [];
        await GUILib.clickObject(Reviews, "Reviews Tab is clicked")
        await GUILib.scrollToElement(RecommendedProductsCarousel)
        var RandomNumber = await Math.floor(Math.random() * 10) + 1
        await console.log("Random Number " + RandomNumber)
        await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class ="owl-item active"]//h6')).count().then(async function (count) {
            await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class ="owl-item active"]//h6')).then(async function (AllItemsCarousel) {
                await console.log("Number of visible Products in Carousel: " + count)
                for (var n = 0; n < count; n++) {
                    var Product = AllItemsCarousel[n].getWebElement();
                    await Product.getText().then(async function (text) {
                        await console.log("Product Name " + text)
                        await Arr.push(text);
                    })
                }
                for (var x = 1; x <= RandomNumber; x++) {
                    await GUILib.clickObject(ArrowNext, "Arrow Next is clicked")
                }
                await browser.sleep(500);
                await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class ="owl-item active"]//h6')).count().then(async function (count) {
                    await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class ="owl-item active"]//h6')).then(async function (AllItemsCarousel) {
                        await console.log("Number of visible Products in Carousel: " + count)
                        for (var n = 0; n < count; n++) {
                            var Product = AllItemsCarousel[n].getWebElement();
                            await Product.getText().then(async function (text) {
                                await console.log("Product Name " + text)
                                await Arr1.push(text);
                            })
                        }
                    })
                })
            })
        })
        expect(Arr).not.toBe(Arr1);
    }

    this.clickArrowPrevCarousel = async function () {
        var Arr = [];
        var Arr1 = [];
        await GUILib.clickObject(Reviews, "Reviews Tab is clicked")
        await GUILib.scrollToElement(RecommendedProductsCarousel)
        var RandomNumber = await Math.floor(Math.random() * 10) + 2
        await console.log("Random Number for Clicking Arrow Next " + RandomNumber)
        for (var x = 1; x <= RandomNumber; x++) {
            await GUILib.clickObject(ArrowNext, "Arrow Next is clicked")
        }
        await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class ="owl-item active"]//h6')).count().then(async function (count) {
            await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class ="owl-item active"]//h6')).then(async function (AllItemsCarousel) {
                await console.log("Number of visible Products in Carousel: " + count)
                for (var n = 0; n < count; n++) {
                    var Product = AllItemsCarousel[n].getWebElement();
                    await Product.getAttribute("textContent").then(async function (text) {
                        await console.log("Product Name " + text)
                        await Arr.push(text);
                    })
                }
                var RandomNumber1 = await Math.floor(Math.random() * RandomNumber) - 1
                await console.log("Random Number for Clicking Arrow Previous " + RandomNumber1)
                for (var x = 1; x <= RandomNumber1; x++) {
                    await GUILib.clickObject(ArrowPrev, "Arrow Previous is clicked")
                }
                await browser.sleep(500);
                await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class ="owl-item active"]//h6')).count().then(async function (count) {
                    await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class ="owl-item active"]//h6')).then(async function (AllItemsCarousel) {
                        await console.log("Number of visible Products in Carousel: " + count)
                        for (var n = 0; n < count; n++) {
                            var Product = AllItemsCarousel[n].getWebElement();
                            await Product.getAttribute("textContent").then(async function (text) {
                                await console.log("Product Name " + text)
                                await Arr1.push(text);
                            })
                        }
                    })
                })
            })
        })
        expect(Arr).not.toBe(Arr1);
    }

    this.clickRandomItemCarousel = async function () {
        await GUILib.waitforElement(Description)
        await GUILib.scrollToElement(RecommendedProductsCarousel)
        var RandomNumber = await Math.floor(Math.random() * 9) + 1
        for (var x = 1; x <= RandomNumber; x++) {
            await GUILib.clickObject(ArrowNext, "Arrow Next is clicked")
        }
        await browser.sleep(1000);
        await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class ="owl-item active"]')).count().then(async function (count) {
            await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class ="owl-item active"]')).then(async function (AllItemsCarousel) {
                await element.all(by.xpath('//*[@id="wooProducts"]//div.col[@class="owl-item active"]/div/h6')).then(async function (AllText) {
                    var RandomNumber = await Math.floor(Math.random() * count)
                    if (RandomNumber == count) {
                        RandomNumber = RandomNumber - 1
                    }
                    await console.log(RandomNumber)
                    var Product = AllItemsCarousel[RandomNumber].getWebElement();
                    await AllText[RandomNumber].getWebElement().getAttribute("textContent").then(async function (text) {
                        text = await text.toUpperCase()
                        await console.log("Product Name in Carousel " + text)
                        await Product.click();
                        await GUILib.waitforElement(Description);
                        await element(by.xpath('//*[@id="wooSummary"]//h1')).getText().then(async function (text1) {
                            await console.log("Product Name of Opened Page " + text1)
                            expect(text).toBe(text1);
                        })
                    })
                })
            })
        })
    }
}

module.exports = new Product_Form;