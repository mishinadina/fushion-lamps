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

  

}



module.exports = new HomePage_Form;