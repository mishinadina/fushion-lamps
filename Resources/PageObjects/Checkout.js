var GUILibrary = require('../Utility/GUILibrary_await.js');
var HomePage = require('./HomePage.js');
var fs = require('fs');
var CommonFunctions = require('../Utility/CommonFunctions.js');
var EC = protractor.ExpectedConditions;


var Checkout_Form = function () {
    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();

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
    var ProductDetailsCheckout = by.xpath('//*[@id="wooCheckout"]//h6')
    var ProductDetailsPayOrder = by.xpath("//*[@id='wooCheckout']//a")

    var ProductNumber = by.xpath("//input[@type='number']")
    var DeleteFromCart = by.xpath("//*[@class='col product-details']//*[@class='ion ion-ios-close-empty']")

    var Alert = by.xpath('//*[@role= "alert"]');
    var ViewCartAlertLink = by.xpath("//*[@class ='alert alert-success']//*[text()='View cart']")
    var UndoBtn = by.xpath("//*[text()='Undo?']")
    var CartUpdatedAlert = by.xpath("//*[text()=' Cart updated.']")
    var PlusSign = by.xpath("//*[text()='+']")
    var MinusSign = by.xpath("//*[text()='-']")
    var UpdateCart = by.xpath('//*[@value= "Update cart"]');

    var ContinueShopping = by.xpath('//*[@id="wooCart"]')
    var ShippingCheckoutBtn = by.xpath("//*[text()='Shipping & Checkout']")

    var CheckoutPage = by.xpath("//*[text()='Billing details']")

    var FirstName = by.xpath("//*[@id='billing_first_name_field']/label/abbr")
    var LastName = by.xpath("//*[@id='billing_last_name_field']/label/abbr")
    var Company = by.xpath('//*[@id="billing_company"]')
    var StreetAddress = by.xpath("//*[@id='billing_address_1_field']/label/abbr")
    var State = by.xpath("//*[@id='billing_state_field']/label/abbr")
    var StateSelect = by.xpath("//*[@id='billing_state_field']")
    var StateSelectShip = by.xpath("//*[@id='shipping_state_field']")
    var City = by.xpath("//*[@id='billing_city_field']/label/abbr")
    var Zip = by.xpath("//*[@id='billing_postcode_field']/label/abbr")
    var Phone = by.xpath("//*[@id='billing_phone_field']/label/abbr")
    var Email = by.xpath("//*[@id='billing_email_field']/label/abbr")

    var FirstNameX = "//*[@id='billing_first_name_field']/label/abbr"
    var LastNameX = "//*[@id='billing_last_name_field']/label/abbr"
    var CompanyX = '//*[@id="billing_company"]'
    var StreetAddressX = "//*[@id='billing_address_1_field']/label/abbr"
    var StateX = "//*[@id='billing_state_field']/label/abbr"
    var CityX = "//*[@id='billing_city_field']/label/abbr"
    var ZipX = "//*[@id='billing_postcode_field']/label/abbr"
    var PhoneX = "//*[@id='billing_phone_field']/label/abbr"
    var EmailX = "//*[@id='billing_email_field']/label/abbr"

    var Subscription = by.xpath('//*[@id="mailchimp_woocommerce_newsletter"]')

    var ShipDiffAddress = by.xpath("//*[@id='ship-to-different-address-checkbox']")
    var FirstNameShipDiffAddress = by.xpath('//*[@id="shipping_first_name"]')
    var OrderNotes = by.xpath("//*[@id='order_comments']")
    var EditLink = by.xpath("//*[text()='Edit']")
    var ReadAcceptCheckbox = by.xpath("//*[@id='terms']")
    var TermsLink = by.xpath('//*[@id="payment"]//label/a')
    var TermsConditionHeader = by.xpath('//*[@id="payment"]//h3[1]')
    var ContinueBtn = by.xpath("//*[@id='place_order']")
    var ItemsSummaryHeaders = by.xpath("//*[@id='wooCheckout']//h6")

    var ZipAlert = by.xpath("//*[text()=' is not a valid postcode / ZIP.			']")
    var PhoneAlert = by.xpath("//*[text()=' is not a valid phone number.			']")
    var EmailAlert = by.xpath("//*[text()=' is not a valid email address.			']")
    var TermsConditionsAlert = by.xpath("//*[contains(text(),'Please read and accept the terms and conditions to proceed with your order.			')]")

    var CheckoutFinalPage = by.xpath("//*[@id='completeButton']")

    //-----------------------------------------First Navigation Tabs Verifications----------------------------//

    this.chooseRandomCategory = async function () {
        // switch (Math.floor(Math.random() * 9) + 1) {
        //     case 1:
        await HomePage.clickShopAll();
        //         break;
        //     case 2:
        //         await HomePage.clickSkinBody();
        //         break;
        //     case 3:
        //         await HomePage.clickSkinFace();
        //         break;
        //     case 4:
        //         await HomePage.clickSkinAloe();
        //         break;
        //     case 5:
        //         await HomePage.clickSunSprays();
        //         break;
        //     case 6:
        //         await HomePage.clickSunAfterSun();
        //         break;
        //     case 7:
        //         await HomePage.clickSunTanning();
        //         break;
        //     case 8:
        //         await HomePage.clickHealthAloeJuice();
        //         break;
        //     case 9:
        //         await HomePage.clickHouseholdCleaning();
        // }

    }

    this.clickShippingCheckoutBtn = async function () {
        var items1 = [];
        await browser.getCurrentUrl().then(async function (link) {
            await GUILib.waitforElement(Page);
            await HomePage.clickSignUpClose();
            var Product = await CF.setProduct()
            await element.all(Product).count().then(async function (count) {

                await element.all(Product).then(async function (AllProducts) {
                    await HomePage.clickSignUpClose();
                    await browser.wait(EC.elementToBeClickable(AllProducts[1]), 15000);
                    var Product = await AllProducts[1].getWebElement();
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
                                await GUILib.waitforElement(ViewCartAlertLink);
                            })
                        }

                    })
                })
            })
        })
        if (items1.length > 0) {
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
            await GUILib.clickObject(ShippingCheckoutBtn, "Shipping & Checkout Btn Btn is clicked")
            await GUILib.waitforElement(CheckoutPage);
            await browser.getCurrentUrl().then(async function (url) {
                expect(url).toContain("fotedev.wpengine.com/checkout/")
            })
        }
    }

    this.checkFirstNameRequired = async function () {
        await CF.checkRequiredClass(FirstName, 'class');
        await console.log("FirstName is required field");
        await CF.checkRequiredClass(LastName, 'class');
        await console.log("Last Name is required field");
        await CF.checkRequiredClass(StreetAddress, 'class');
        await console.log("Street Address is required field");
        await CF.checkRequiredClass(City, 'class');
        await console.log("City is required field");
        await CF.checkRequiredClass(State, 'class');
        await console.log("State is required field");
        await CF.checkRequiredClass(Zip, 'class');
        await console.log("Zip is required field");
        await CF.checkRequiredClass(Phone, 'class');
        await console.log("Phone is required field");
        await CF.checkRequiredClass(Email, 'class');
        await console.log("Email is required field");
    }

    this.checkSubscriptionBox = async function () {
        await GUILib.scrollToElement(Subscription)
        await GUILib.clickObject(Subscription, "Subscription box is checked")

    }

    this.clickEditLink = async function () {
        await GUILib.clickObject(EditLink, "Edit Link is clicked")
        await browser.getCurrentUrl().then(async function (url) {
            expect(url).toContain("fotedev.wpengine.com/cart/")
        })
    }

    this.clickTermsLink = async function () {
        await GUILib.scrollToElement(TermsLink);
        await GUILib.clickObject(TermsLink, "Terms & Condition Link is clicked")
        await browser.sleep(2000);
        await element(TermsConditionHeader).isDisplayed().then(async function (result) {
            expect(result).toBe(true)
        })
    }

    this.checkProductListSummary = async function () {
        var z = 1;
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
                                    await GUILib.waitforElement(ViewCartAlertLink);
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
        if (items1.length > 0) {
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
            await GUILib.clickObject(ShippingCheckoutBtn, "Shipping & Checkout Btn is clicked")
            await GUILib.waitforElement(CheckoutPage);
            await element.all(ProductDetailsCheckout).count().then(async function (count) {
                await element.all(ProductDetailsCheckout).then(async function (ProductDetailsCheckout) {
                    await console.log("Number of Unique Products in Cart: " + count)
                    for (var n = 0; n < count; n++) {
                        var Product = await ProductDetailsCheckout[n].getWebElement();
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

    }

    this.checkProductLinkSummary = async function () {
        var z = 1;
        var items1 = [];
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
                                    await GUILib.waitforElement(ViewCartAlertLink);
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
        if (items1.length > 0) {
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
            await GUILib.clickObject(ShippingCheckoutBtn, "Shipping & Checkout Btn is clicked")
            await GUILib.waitforElement(CheckoutPage);
            await element.all(ProductDetailsCheckout).count().then(async function (count) {
                await element.all(ProductDetailsCheckout).then(async function (ProductDetailsCheckout) {
                    await console.log("Number of Unique Products in Cart: " + count)
                    var RandomNumber = await Math.floor(Math.random() * count);
                    var Product = await ProductDetailsCheckout[RandomNumber].getWebElement();
                    await Product.getText().then(async function (Text1) {
                        Text1 = await Text1.replace("-", " ")
                        await console.log("Product Name #1 " + Text1)
                        await Product.click()
                        await GUILib.waitforElement(ProductPage)
                        await element(ProductText).getText().then(async function (Text2) {
                            await console.log("Product Name #2 " + Text2)
                            expect(Text1).toBe(Text2)
                        })
                    })
                })
            })
        }
    }
    this.clickShipDifferentAddress = async function () {
        await GUILib.scrollToElement(ShipDiffAddress);
        await GUILib.clickObject(ShipDiffAddress, "Ship to a Different Address is checked")
        await GUILib.scrollToElement(FirstNameShipDiffAddress);
        await browser.sleep(2000);
        await element(FirstNameShipDiffAddress).isDisplayed().then(async function (result) {
            expect(result).toBe(true)
        })
    }

    this.checkZipAlert = async function () {
        await GUILib.waitforElement(FirstName)
        var xpathes = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, StateX, CityX, ZipX, PhoneX, EmailX];
        var xpathes1 = []
        for (var a = 0; a < xpathes.length; a++) {
            var item = await xpathes[a]
            item = await item.replace("/label/abbr", "").replace("_field", "")
            await xpathes1.push(item)
            await console.log(item)
        }
        await GUILib.typeValue(by.xpath(xpathes1[0]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[1]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[2]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[3]), "Test")

        await element.all(by.xpath('//*[@id="shipping_state"]/option')).count().then(async function (count) {
            await console.log(count)
            for (var a = 2; a < count; a++) {
                await GUILib.selectFromDropdown(StateSelect, a);
                //await browser.sleep(500);
            }
            await GUILib.typeValue(by.xpath(xpathes1[5]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[6]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[7]), "4088874885")
            await GUILib.typeValue(by.xpath(xpathes1[8]), "Test@eightythreecreative.com")
            await GUILib.scrollToElement(ReadAcceptCheckbox)
            await GUILib.clickObject(ReadAcceptCheckbox, "Read & Accept Checkbox is clicked")
            await GUILib.scrollToElement(ContinueBtn)
            await GUILib.clickObject(ContinueBtn, "Continue button is clicked")
            await GUILib.waitforElement(ZipAlert)
            await GUILib.scrollToElement(ZipAlert)
            await element(ZipAlert).isDisplayed().then(async function (result) {
                expect(result).toBe(true)
            })

        })
    }

    this.checkEmailAlert = async function () {
        await GUILib.waitforElement(FirstName)
        var xpathes = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, StateX, CityX, ZipX, PhoneX, EmailX];
        var xpathes1 = []
        for (var a = 0; a < xpathes.length; a++) {
            var item = await xpathes[a]
            item = await item.replace("/label/abbr", "").replace("_field", "")
            await xpathes1.push(item)
            await console.log(item)
        }
        await GUILib.typeValue(by.xpath(xpathes1[0]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[1]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[2]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[3]), "Test")

        await element.all(by.xpath('//*[@id="shipping_state"]/option')).count().then(async function (count) {
            await console.log(count)
            for (var a = 2; a < count; a++) {
                await GUILib.selectFromDropdown(StateSelect, a);
            }
            await GUILib.typeValue(by.xpath(xpathes1[5]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[6]), "76010")
            await GUILib.typeValue(by.xpath(xpathes1[7]), "4088874885")
            await GUILib.typeValue(by.xpath(xpathes1[8]), "Test")
            await GUILib.scrollToElement(ReadAcceptCheckbox)
            await browser.sleep(1000)
            await GUILib.clickObject(ReadAcceptCheckbox, "Read & Accept Checkbox is clicked")
            await GUILib.scrollToElement(ContinueBtn)
            await GUILib.clickObject(ContinueBtn, "Continue button is clicked")
            await GUILib.waitforElement(EmailAlert)
            await GUILib.scrollToElement(EmailAlert)
            await element(EmailAlert).isDisplayed().then(async function (result) {
                expect(result).toBe(true)
            })

        })
    }

    this.checkPhoneAlert = async function () {
        await GUILib.waitforElement(FirstName)
        var xpathes = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, StateX, CityX, ZipX, PhoneX, EmailX];
        var xpathes1 = []
        for (var a = 0; a < xpathes.length; a++) {
            var item = await xpathes[a]
            item = await item.replace("/label/abbr", "").replace("_field", "")
            await xpathes1.push(item)
            await console.log(item)
        }
        await GUILib.typeValue(by.xpath(xpathes1[0]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[1]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[2]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[3]), "Test")

        await element.all(by.xpath('//*[@id="shipping_state"]/option')).count().then(async function (count) {
            await console.log(count)
            for (var a = 2; a < count; a++) {
                await GUILib.selectFromDropdown(StateSelect, a);
            }
            await GUILib.typeValue(by.xpath(xpathes1[5]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[6]), "76010")
            await GUILib.typeValue(by.xpath(xpathes1[7]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[8]), "Test@eightythreecreative.com")
            await GUILib.scrollToElement(ReadAcceptCheckbox)
            await browser.sleep(1000)
            await GUILib.clickObject(ReadAcceptCheckbox, "Read & Accept Checkbox is clicked")
            await GUILib.scrollToElement(ContinueBtn)
            await GUILib.clickObject(ContinueBtn, "Continue button is clicked")
            await GUILib.waitforElement(PhoneAlert)
            await GUILib.scrollToElement(PhoneAlert)
            await element(PhoneAlert).isDisplayed().then(async function (result) {
                expect(result).toBe(true)
            })

        })
    }

    this.checkTermsConditionsAlert = async function () {
        await GUILib.waitforElement(FirstName)
        var xpathes = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, StateX, CityX, ZipX, PhoneX, EmailX];
        var xpathes1 = []
        for (var a = 0; a < xpathes.length; a++) {
            var item = await xpathes[a]
            item = await item.replace("/label/abbr", "").replace("_field", "")
            await xpathes1.push(item)
            await console.log(item)
        }
        await GUILib.typeValue(by.xpath(xpathes1[0]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[1]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[2]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[3]), "Test")

        await element.all(by.xpath('//*[@id="shipping_state"]/option')).count().then(async function (count) {
            await console.log(count)
            for (var a = 2; a < count; a++) {
                await GUILib.selectFromDropdown(StateSelect, a);
            }
            await GUILib.typeValue(by.xpath(xpathes1[5]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[6]), "76010")
            await GUILib.typeValue(by.xpath(xpathes1[7]), "4088874885")
            await GUILib.typeValue(by.xpath(xpathes1[8]), "Test@eightythreecreative.com")
            await GUILib.scrollToElement(ContinueBtn)
            await GUILib.clickObject(ContinueBtn, "Continue button is clicked")
            await GUILib.waitforElement(TermsConditionsAlert)
            await GUILib.scrollToElement(TermsConditionsAlert)
            await element(TermsConditionsAlert).isDisplayed().then(async function (result) {
                expect(result).toBe(true)
            })

        })
    }

    this.fillBillingForm = async function () {
        await GUILib.waitforElement(FirstName)
        var xpathes = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, StateX, CityX, ZipX, PhoneX, EmailX];
        var xpathes1 = []
        for (var a = 0; a < xpathes.length; a++) {
            var item = await xpathes[a]
            item = await item.replace("/label/abbr", "").replace("_field", "")
            await xpathes1.push(item)
            await console.log(item)
        }
        await GUILib.typeValue(by.xpath(xpathes1[0]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[1]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[2]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[3]), "Test")

        await element.all(by.xpath('//*[@id="shipping_state"]/option')).count().then(async function (count) {
            await console.log(count)
            for (var a = 2; a < count; a++) {
                await GUILib.selectFromDropdown(StateSelect, a);
            }
            await GUILib.typeValue(by.xpath(xpathes1[5]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[6]), "82001")
            await GUILib.typeValue(by.xpath(xpathes1[7]), "4088874885")
            await GUILib.typeValue(by.xpath(xpathes1[8]), "Test@eightythreecreative.com")
            //await GUILib.scrollToElement(ReadAcceptCheckbox)
            await browser.sleep(1000)
            await GUILib.clickObject(ReadAcceptCheckbox, "Read & Accept Checkbox is clicked")
            await browser.sleep(1000)
            await GUILib.scrollToElement(ContinueBtn)
            await GUILib.clickObject(ContinueBtn, "Continue button is clicked")
            await browser.wait(EC.urlContains('order-pay'), 30000);
            await browser.getCurrentUrl().then(async function (link) {
                expect(link).toContain("order-pay")

            })
        })
    }

    this.fillShippingForm = async function () {
        await GUILib.waitforElement(FirstName)
        var xpathes = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, StateX, CityX, ZipX, PhoneX, EmailX];
        var xpathes1 = []
        for (var a = 0; a < xpathes.length; a++) {
            var item = await xpathes[a]
            item = await item.replace("/label/abbr", "").replace("_field", "")
            await xpathes1.push(item)
            await console.log(item)
        }
        await GUILib.typeValue(by.xpath(xpathes1[0]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[1]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[2]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[3]), "Test")

        await element.all(by.xpath('//*[@id="shipping_state"]/option')).count().then(async function (count) {
            await console.log(count)
            for (var a = 2; a < count; a++) {
                await GUILib.selectFromDropdown(StateSelect, a);
            }
            await GUILib.typeValue(by.xpath(xpathes1[5]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[6]), "82001")
            await GUILib.typeValue(by.xpath(xpathes1[7]), "4088874885")
            await GUILib.typeValue(by.xpath(xpathes1[8]), "Test@eightythreecreative.com")
            // await browser.wait(EC.elementToBeClickable(element(ReadAcceptCheckbox)), 15000);
            // await GUILib.clickObject(ReadAcceptCheckbox, "Read & Accept Checkbox is clicked")

            await GUILib.scrollToElement(ShipDiffAddress);
            await GUILib.clickObject(ShipDiffAddress, "Ship to a Different Address is checked")
            await GUILib.waitforElement(FirstNameShipDiffAddress);

            await GUILib.scrollToElement(by.xpath('//*[@class="woocommerce-shipping-fields"]'))
            var xpathesShipping = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, CityX, StateX, ZipX];
            var xpathes1Shipping = []
            for (var a = 0; a < xpathesShipping.length; a++) {
                var item = await xpathesShipping[a]
                item = await item.replace("/label/abbr", "").replace("_field", "").replace("billing", "shipping")
                await xpathes1Shipping.push(item)
                await console.log(item)
            }
            await GUILib.typeValue(by.xpath(xpathes1Shipping[0]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1Shipping[1]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1Shipping[2]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1Shipping[3]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1Shipping[4]), "Test")
            await element.all(by.xpath('//*[@id="billing_state"]/option')).count().then(async function (count) {
                await console.log(count)
                for (var a = 2; a < count; a++) {
                    await GUILib.selectFromDropdown(StateSelectShip, a);
                }

                await GUILib.typeValue(by.xpath(xpathes1Shipping[6]), "82001")
                await GUILib.typeValue(OrderNotes, "Test");
                await GUILib.scrollToElement(ReadAcceptCheckbox)
                await browser.sleep(1000)
                await GUILib.clickObject(ReadAcceptCheckbox, "Read & Accept Checkbox is clicked")
                await GUILib.scrollToElement(ContinueBtn)
                await GUILib.clickObject(ContinueBtn, "Continue button is clicked")
                await browser.wait(EC.urlContains('order-pay'), 90000);
                await browser.getCurrentUrl().then(async function (link) {
                    expect(link).toContain("order-pay")
                })
            })
        })
    }

    this.checkZipAlertShippingForm = async function () {
        await GUILib.waitforElement(FirstName)
        var xpathes = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, StateX, CityX, ZipX, PhoneX, EmailX];
        var xpathes1 = []
        for (var a = 0; a < xpathes.length; a++) {
            var item = await xpathes[a]
            item = await item.replace("/label/abbr", "").replace("_field", "")
            await xpathes1.push(item)
            await console.log(item)
        }
        await GUILib.typeValue(by.xpath(xpathes1[0]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[1]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[2]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[3]), "Test")

        await element.all(by.xpath('//*[@id="shipping_state"]/option')).count().then(async function (count) {
            await console.log(count)
            for (var a = 2; a < count; a++) {
                await GUILib.selectFromDropdown(StateSelect, a);
            }
            await GUILib.typeValue(by.xpath(xpathes1[5]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[6]), "82001")
            await GUILib.typeValue(by.xpath(xpathes1[7]), "4088874885")
            await GUILib.typeValue(by.xpath(xpathes1[8]), "Test@eightythreecreative.com")
            // await browser.wait(EC.elementToBeClickable(element(ReadAcceptCheckbox)), 15000);
            // await GUILib.clickObject(ReadAcceptCheckbox, "Read & Accept Checkbox is clicked")

            await GUILib.scrollToElement(ShipDiffAddress);
            await GUILib.clickObject(ShipDiffAddress, "Ship to a Different Address is checked")
            await GUILib.waitforElement(FirstNameShipDiffAddress);

            await GUILib.scrollToElement(by.xpath('//*[@class="woocommerce-shipping-fields"]'))
            var xpathesShipping = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, CityX, StateX, ZipX];
            var xpathes1Shipping = []
            for (var a = 0; a < xpathesShipping.length; a++) {
                var item = await xpathesShipping[a]
                item = await item.replace("/label/abbr", "").replace("_field", "").replace("billing", "shipping")
                await xpathes1Shipping.push(item)
                await console.log(item)
            }
            await GUILib.typeValue(by.xpath(xpathes1Shipping[0]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1Shipping[1]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1Shipping[2]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1Shipping[3]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1Shipping[4]), "Test")
            await element.all(by.xpath('//*[@id="billing_state"]/option')).count().then(async function (count) {
                await console.log(count)
                for (var a = 2; a < count; a++) {
                    await GUILib.selectFromDropdown(StateSelectShip, a);
                }

                await GUILib.typeValue(by.xpath(xpathes1Shipping[6]), "Test")
                await GUILib.typeValue(OrderNotes, "Test");
                await GUILib.scrollToElement(ReadAcceptCheckbox)
                await browser.sleep(1000)
                await GUILib.clickObject(ReadAcceptCheckbox, "Read & Accept Checkbox is clicked")
                await GUILib.scrollToElement(ContinueBtn)
                await GUILib.clickObject(ContinueBtn, "Continue button is clicked")
                await GUILib.waitforElement(ZipAlert)
                await GUILib.scrollToElement(ZipAlert)
                await element(ZipAlert).isDisplayed().then(async function (result) {
                    expect(result).toBe(true)
                })
            })
        })
    }

    this.checkLinkOrderPayForm = async function () {
        await GUILib.waitforElement(FirstName)
        var xpathes = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, StateX, CityX, ZipX, PhoneX, EmailX];
        var xpathes1 = []
        for (var a = 0; a < xpathes.length; a++) {
            var item = await xpathes[a]
            item = await item.replace("/label/abbr", "").replace("_field", "")
            await xpathes1.push(item)
            await console.log(item)
        }
        await GUILib.typeValue(by.xpath(xpathes1[0]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[1]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[2]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[3]), "Test")

        await element.all(by.xpath('//*[@id="shipping_state"]/option')).count().then(async function (count) {
            await console.log(count)
            for (var a = 2; a < count; a++) {
                await GUILib.selectFromDropdown(StateSelect, a);
            }
            await GUILib.typeValue(by.xpath(xpathes1[5]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[6]), "82001")
            await GUILib.typeValue(by.xpath(xpathes1[7]), "4088874885")
            await GUILib.typeValue(by.xpath(xpathes1[8]), "Test@eightythreecreative.com")
            //await GUILib.scrollToElement(ReadAcceptCheckbox)
            await browser.sleep(1000)
            await GUILib.clickObject(ReadAcceptCheckbox, "Read & Accept Checkbox is clicked")
            await browser.sleep(1000)
            await GUILib.scrollToElement(ContinueBtn)
            await GUILib.clickObject(ContinueBtn, "Continue button is clicked")
            await browser.wait(EC.urlContains('order-pay'), 30000);
            await GUILib.getText(ProductDetailsPayOrder).then(async function (text1) {
                text1 = await text1.toUpperCase()
                await console.log(text1)
                await GUILib.clickObject(ProductDetailsPayOrder)
                //await browser.wait(EC.urlContains('fotedev.wpengine.com'), 30000);
                await GUILib.getText(ProductText).then(async function (text2) {
                await expect(text1).toContain(text2)
                })
            })
        })
    }

    this.checkCreditCardPayForm = async function () {
        await GUILib.waitforElement(FirstName)
        var xpathes = await [FirstNameX, LastNameX, CompanyX, StreetAddressX, StateX, CityX, ZipX, PhoneX, EmailX];
        var xpathes1 = []
        for (var a = 0; a < xpathes.length; a++) {
            var item = await xpathes[a]
            item = await item.replace("/label/abbr", "").replace("_field", "")
            await xpathes1.push(item)
            await console.log(item)
        }
        await GUILib.typeValue(by.xpath(xpathes1[0]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[1]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[2]), "Test")
        await GUILib.typeValue(by.xpath(xpathes1[3]), "Test")

        await element.all(by.xpath('//*[@id="shipping_state"]/option')).count().then(async function (count) {
            await console.log(count)
            for (var a = 2; a < count; a++) {
                await GUILib.selectFromDropdown(StateSelect, a);
            }
            await GUILib.typeValue(by.xpath(xpathes1[5]), "Test")
            await GUILib.typeValue(by.xpath(xpathes1[6]), "82001")
            await GUILib.typeValue(by.xpath(xpathes1[7]), "4088874885")
            await GUILib.typeValue(by.xpath(xpathes1[8]), "Test@eightythreecreative.com")
            //await GUILib.scrollToElement(ReadAcceptCheckbox)
            await browser.sleep(1000)
            await GUILib.clickObject(ReadAcceptCheckbox, "Read & Accept Checkbox is clicked")
            await browser.sleep(1000)
            await GUILib.scrollToElement(ContinueBtn)
            await GUILib.clickObject(ContinueBtn, "Continue button is clicked")
            await browser.wait(EC.urlContains('order-pay'), 30000);
            await browser.switchTo().frame(element(by.id('wc-chase-paymentech-pay-form')).getWebElement());
            await GUILib.clearText(by.xpath('//*[@id="name"]'))
            await GUILib.typeValue(by.xpath('//*[@id="name"]'), "Test")
            await GUILib.typeValue(by.xpath('//*[@id="ccNumber"]'), "5105105105105100")
            await GUILib.clickObject(by.xpath('//*[@id="cancelButton"]'))
            await browser.sleep(2000);
        })
    }









}








module.exports = new Checkout_Form;