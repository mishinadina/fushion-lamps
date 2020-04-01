var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');




var HomePage_Form = function () {
  var GUILib = new GUILibrary();
  var EC = protractor.ExpectedConditions;
  var CF = new CommonFunctions();
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

  var ContactUs = by.xpath("//ul[@id ='SiteNav']//*[text() = 'Contact Us']")
  var ContactUsLink = "https://city-electric-supply-marketing.myshopify.com/pages/contact-us"

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
  
  var LogOut = by.id("customer_logout_link")

  this.clickLogOutTab = async function () {
    await GUILib.clickObject(LogOut);
    await GUILib.waitforElement(by.id("CustomerEmail"))
  }

  this.clickEventCounterTab = async function () {
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
    await GUILib.clickTab(null, ContactUs, ContactUsLink)
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

}



module.exports = new HomePage_Form;