var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var HomePage_Form = function () {
  var GUILib = new GUILibrary();
  var EC = protractor.ExpectedConditions;
  var fs = require('fs');



  //----------------------------------------------------------------------------------------//
  var Logo = by.xpath("//*[@class='h2 site-header__logo']")

  var Event = by.xpath("//ul[@id ='SiteNav']//*[text() = 'Event']")
  var Counter = by.xpath("//ul[@id ='SiteNav']//*[text() = 'Counter Day']")
  var CounterLink = "city-electric-supply-marketing.myshopify.com/collections/counter-bundle"

  var Branch = by.xpath("//ul[@id ='SiteNav']//*[text() = 'Branch']")
  var CompanySignage = by.xpath("//ul[@id ='SiteNav']//*[text() = 'Company Signage']")
  var CompanySignageLink = "city-electric-supply-marketing.myshopify.com/products/company-signage"
  var VehicleSignage = by.xpath("//ul[@id ='SiteNav']//*[text() = 'Vehicle Signage']")
  var VehicleSignageLink = "https://city-electric-supply-marketing.myshopify.com/products/vehicle-signage"

  var Employee = by.xpath("//ul[@id ='SiteNav']//*[text() = 'Employee']")
  var BusinessCards = by.xpath("//ul[@id ='SiteNav']//*[text() = 'Business Cards']")
  var BusinessCardsLink = "https://city-electric-supply-marketing.myshopify.com/products/business-cards"
  var Uniforms = by.xpath("//ul[@id ='SiteNav']//*[text() = 'Uniforms']")
  var UniformsLink = "https://city-electric-supply-marketing.myshopify.com/pages/uniforms"

  var Store = by.xpath("//ul[@id ='SiteNav']//*[text() = 'Store']")
  var StoreLink = "https://city-electric-supply-marketing.myshopify.com/collections/all"

  var ContactUs = by.xpath("//*[@class='site-nav--has-dropdown']/button/*[text() = 'Contact Us']")
  var ContactUsDD = by.xpath("//*[@id='SiteNavLabel-contact-us']//*[text() = 'Contact Us']")
  var RoadMapDD = by.xpath("//*[@id='SiteNavLabel-contact-us']//*[text() = 'Roadmap']")
  var ContactUsLink = "https://city-electric-supply-marketing.myshopify.com/pages/contact-us"
  var RoadMapLink = "https://city-electric-supply-marketing.myshopify.com/pages/roadmap"

  var Search = by.xpath("//*[@class ='btn--link site-header__icon site-header__search-toggle js-drawer-open-top']//*[@class = 'icon icon-search']")
  var SearchBar = by.xpath("//*[@class ='search__input search-bar__input']")

  var Account = by.xpath("//*[@class = 'site-header__icon site-header__account']")
  var AccountLink = "https://city-electric-supply-marketing.myshopify.com/account"

  var Cart = by.xpath("//*[@class = 'site-header__icon site-header__cart']")
  var CartLink = "https://city-electric-supply-marketing.myshopify.com/cart"

  var BranchBox = by.xpath('//*[@id="shopify-section-1571229997197"]/div/div/ul/li[1]')
  var BranchLink = "city-electric-supply-marketing.myshopify.com/collections/branch-supplies"
  var BusinessCardsBox = by.xpath('//*[@id="shopify-section-1571229997197"]/div/div/ul/li[2]')
  var ContactUsBox = by.xpath('//*[@id="shopify-section-1571229997197"]/div/div/ul/li[3]')
  var ApparelBox = by.xpath('//*[@id="shopify-section-1571229997197"]/div/div/ul/li[4]')
  var ApparelLink = "https://city-electric-supply-marketing.myshopify.com/collections/apparel"
  var UniformsBox = by.xpath('//*[@id="shopify-section-1571229997197"]/div/div/ul/li[5]')
  var VehicleSignageBox = by.xpath('//*[@id="shopify-section-1571229997197"]/div/div/ul/li[6]')
  var CounterBox = by.xpath('//*[@id="shopify-section-1571229997197"]/div/div/ul/li[7]')
  var CompanySignageBox = by.xpath('//*[@id="shopify-section-1571229997197"]/div/div/ul/li[8]')

  var CESUniforms1 = by.xpath('//*[@id="shopify-section-1571232084804"]/div/ul/li[1]/div/div[3]/div')
  var CESUniforms2 = by.xpath('//*[@id="shopify-section-1571232084804"]/div/ul/li[2]/div/div[3]/div')
  var CESUniforms3 = by.xpath('//*[@id="shopify-section-1571232084804"]/div/ul/li[3]/div/div[3]/div')
  var CESUniforms4 = by.xpath('//*[@id="shopify-section-1571232084804"]/div/ul/li[4]/div/div[3]/div')

  var FooterLink = by.xpath('//*[@id="shopify-section-footer"]/footer/div[2]/div/div[1]/div/small/a')

  var HotSellers = by.xpath("//*[contains(@class, 'grid__item--1571231326253')]")
  var Next = by.xpath('//*[@id="shopify-section-1571231326253"]/div/ul/button[2]')
  var Prev = by.xpath('//*[@id="shopify-section-1571231326253"]/div/ul/button[1]')
  var Slider = by.xpath("//*[text()='CES Uniform']")
  var AddToCartBtn = by.xpath("//div/button[@type='submit']")

  var LogOut = by.id("customer_logout_link")
  var Image = by.xpath('//*[contains(@class, "product-single__photo-wrapper js")]')

  var HotSellersHeaderSpan = by.xpath('//span[@class="visually-hidden"]')


  this.clickLogOutTab = async function () {
    await GUILib.clickObject(LogOut);
    await GUILib.waitforElement(by.id("CustomerEmail"))
  }

  this.clickEventCounterTab = async function () {
    await GUILib.moveToElement(Logo);
    await GUILib.clickTab(Event, Counter, CounterLink)
  }

  this.clickBranchCompanySignage = async function () {
    await GUILib.moveToElement(Logo);
    await GUILib.clickTab(Branch, CompanySignage, CompanySignageLink)
  }

  this.clickBranchVehicleSignage = async function () {
    await GUILib.moveToElement(Logo);
    await GUILib.clickTab(Branch, VehicleSignage, VehicleSignageLink)
  }

  this.clickEmployeeBusinessCards = async function () {
    await GUILib.moveToElement(Logo);
    await GUILib.clickTab(Employee, BusinessCards, BusinessCardsLink)
  }

  this.clickEmployeeUniforms = async function () {
    await GUILib.moveToElement(Logo);
    await GUILib.clickTab(Employee, Uniforms, UniformsLink)
  }

  this.clickStoreTab = async function () {
    await GUILib.clickTab(null, Store, StoreLink)
  }

  this.clickContactUsTab = async function () {
    await GUILib.clickTab(ContactUs, ContactUsDD, ContactUsLink)
  }

  this.clickRoadMap = async function () {
    await GUILib.moveToElement(Logo);
    await GUILib.clickTab(ContactUs, RoadMapDD, RoadMapLink)
  }

  this.clickSearchIcon = async function () {
    await GUILib.clickObject(Search)
    await element(SearchBar).isDisplayed().then(async function (result) {
      expect(result).toBe(true)
    })
  }

  this.clickAccountIcon = async function () {
    await GUILib.clickTab(null, Account, AccountLink)
  }

  this.clickCartIcon = async function () {
    await GUILib.clickTab(null, Cart, CartLink)
  }

  this.clickBranchBox = async function () {
    await GUILib.clickTab(null, BranchBox, BranchLink)
  }

  this.clickBusinessCardsBox = async function () {
    await GUILib.clickTab(null, BusinessCardsBox, BusinessCardsLink)
  }

  this.clickContactUsBox = async function () {
    await GUILib.clickTab(null, ContactUsBox, ContactUsLink)
  }

  this.clickApparelBox = async function () {
    await GUILib.clickTab(null, ApparelBox, ApparelLink)
  }

  this.clickUniformsBox = async function () {
    await GUILib.clickTab(null, UniformsBox, UniformsLink)
  }

  this.clickVehicleSignageBox = async function () {
    await GUILib.clickTab(null, VehicleSignageBox, VehicleSignageLink)
  }

  this.clickVehicleSignageBox = async function () {
    await GUILib.clickTab(null, VehicleSignageBox, VehicleSignageLink)
  }

  this.clickCounterBox = async function () {
    await GUILib.clickTab(null, CounterBox, CounterLink)
  }

  this.clickCompanySignageBox = async function () {
    await GUILib.clickTab(null, CompanySignageBox, CompanySignageLink)
  }

  this.clickHotSellers = async function () {
    var Arr = [];
    var y = 4
    var z = 0;

    await GUILib.waitforElement(Slider)
    await GUILib.scrollToElement(Slider);
    await element.all(HotSellersHeaderSpan).count().then(async function (count) {
      await console.log(count)
      for (var n = 0; n < (count - 3); n++) {
        if (z < 2) {
          await console.log(n)
          await console.log(y)
          var HotSellersHeader = await by.xpath("//li[" + y + "]/div[@class='grid-view-item product-card pb-0 pl-3 pr-3 pt-4   ']/a")
          await GUILib.scrollToElement(HotSellersHeader)
          await element(HotSellersHeader).getText().then(async function (text) {
            if (text == 'Cap - Baseball Red') {
              await z++
            }
            await y++;
            var Item = by.xpath("//*[@data-slick-index=" + n + "]/div/a")
            var done = false
            while (done == false) {
              try {
                await element(Item).click();
                await browser.sleep(600)
                var done = true
              } catch (e) {
                await GUILib.clickObject(Next)
                await browser.sleep(600)
              }
            }
            await element.all(Image).count().then(async function (noimage) {
              await console.log("noimage " + noimage)
              await browser.getCurrentUrl().then(async function (url) {
                if (noimage == 0) {
                  if (Arr.indexOf(url) === -1) {
                    await Arr.push(url);
                  }
                }
                await browser.get('https://city-electric-supply-marketing.myshopify.com')
                await browser.wait(EC.visibilityOf(element(Logo)), 35000)
              })
            })
          })
        }
      }

      await console.log("===Products with no-image: " + Arr)
      expect(Arr.length).toBe(0)
    })
  }



}



module.exports = new HomePage_Form;