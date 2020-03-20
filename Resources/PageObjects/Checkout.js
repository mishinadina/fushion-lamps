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
    var ProductNumber = by.xpath("//input[@type='number']")
    var DeleteFromCart = by.xpath("//*[@class='col product-details']//*[@class='ion ion-ios-close-empty']")

    var Alert = by.xpath('//*[@role= "alert"]');
    var ViewCartAlertLink = by.xpath("//*[@class ='alert alert-success']//*[text()='View cart']")
    var UndoBtn = by.xpath("//*[text()='Undo?']")
    var CartUpdatedAlert = by.xpath("//*[text()=' Cart updated.']")
    var PlusSign = by.xpath("//*[text()='+']")
    var MinusSign = by.xpath("//*[text()='-']")
    var UpdateCart = by.xpath('//*[@value= "Update cart"]');

    var ContinueShopping = by.xpath("//*[text()='Continue Shopping']")
    var ShippingCheckoutBtn = by.xpath("//*[text()='Shipping & Checkout']")

    var CheckoutPage = by.xpath("//*[text()='Billing details']")
    var FirstName = by.xpath("//*[@id='billing_first_name_field']/label/abbr")
    var LastName = by.xpath("//*[@id='billing_last_name_field']/label/abbr")
    var StreetAddress = by.xpath("//*[@id='billing_address_1_field']/label/abbr")
    var State = by.xpath("//*[@id='billing_state_field']/label/abbr")
    var City = by.xpath("//*[@id='billing_city_field']/label/abbr")
    var Zip = by.xpath("//*[@id='billing_postcode_field']/label/abbr")
    var Phone = by.xpath("//*[@id='billing_phone_field']/label/abbr")
    var Email = by.xpath("//*[@id='billing_email_field']/label/abbr")
    var Subscription = by.xpath("//[@id='mailchimp_woocommerce_newsletter']")
    var ShipDiffAddress = by.xpath("//[@id='ship-to-different-address-checkbox']")
    var OrderNotes = by.xpath("//[@id='order_comments']")
    var EditLink =  by.xpath("//*[text()='Edit']")
    var ReadAcceptCheckbox = by.xpath("//*[@id='terms']")
    var TermsLink = by.xpath("//*[text()='terms & conditions']")
    var ContinueBtn = by.xpath("//*[@id='place_order']")
    var ItemsSummaryHeaders = by.xpath("//*[@id='wooCheckout']//h6")


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

}








module.exports = new Checkout_Form;