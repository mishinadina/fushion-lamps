var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var HomePage_Form = function () {
  var GUILib = new GUILibrary();
  var EC = protractor.ExpectedConditions;
  var fs = require('fs');



  //----------------------------------------------------------------------------------------//
  var Logo = by.xpath('//*[@alt="Fusion Lamps"]')
  var Search = by.xpath('//*[@id="ls_query"]')
  var Magnefier = by.xpath('//*[@id="accountInfo"]/div[1]/form/button/i')
  var Account = by.xpath('//*[@id="accountInfo"]/div[1]/div/ul/li[1]/a/svg')
  var Cart = by.xpath('//*[@id="accountInfo"]/div[1]/div/ul/li[2]/a/svg')

  var OurBrandsDD = by.xpath('//*[@id="menu-item-37"]/a')
  var Home = by.xpath('//*[@id="menu-item-16"]/a')
  var AboutUs = by.xpath('//*[@id="menu-item-15"]/a')
  var AllProducts = by.xpath('//*[@id="menu-item-97"]/a')
  var SpecSheets = by.xpath('//*[@id="menu-item-14"]/a')
  var WhereToBuy = by.xpath('//*[@id="menu-item-17"]/a')
  var NewArticles = by.xpath('//*[@id="menu-item-3030"]/a')
  var ContactUs = by.xpath('//*[@id="menu-item-13"]/a')

  var TamCo = by.xpath('//*[@id="brandNav"]/li[1]/a/img')
  var F4P = by.xpath('//*[@id="brandNav"]/li[2]/a/img')
  var Tamlite = by.xpath('//*[@id="brandNav"]/li[3]/a/img')
  var CentureInst = by.xpath('//*[@id="brandNav"]/li[4]/a/img')
  var MCG = by.xpath('//*[@id="brandNav"]/li[5]/a/img')
  var RPPDev = by.xpath('//*[@id="brandNav"]/li[6]/a/img')

  var LedLamps = by.xpath('//*[@id="menu-item-18085"]/a')
  var LedTubes = by.xpath('//*[@id="menu-item-18086"]/a')
  var FluorescentTubes = by.xpath('//*[@id="menu-item-18081"]/a')
  var CompactFluorescent = by.xpath('//*[@id="menu-item-18080"]/a')
  var Incandescent = by.xpath('//*[@id="menu-item-18084"]/a')
  var Halogen = by.xpath('//*[@id="menu-item-18082"]/a')
  var HidLamps = by.xpath('//*[@id="menu-item-18083"]/a')
  var BallastAcc = by.xpath('//*[@id="menu-item-18079"]/a')

  var ViewProducts = by.xpath('//*[@id="fusionDetail"]/div/div/div[2]/div/a')

  var Banner1 = by.xpath('//*[@id="recentPosts"]/div/div[1]/div/a/img')
  var Banner2 = by.xpath('//*[@id="recentPosts"]/div/div[2]/div/a/img')

  var Tel = by.xpath('//*[@id="address"]/ul/li[1]/a')
  var Address = by.xpath('//*[@id="address"]/ul/li[2]/a')

  var FooterLedLamps = by.xpath('//*[@id="menu-main-menu"]/li[1]/a')
  var FooterLedTubes = by.xpath('//*[@id="menu-main-menu"]/li[2]/a')
  var FooterFluorescentTubes = by.xpath('//*[@id="menu-main-menu"]/li[3]/a')
  var FooterCompactFluorescent = by.xpath('//*[@id="menu-main-menu"]/li[4]/a')
  var FooterIncandescent = by.xpath('//*[@id="menu-main-menu"]/li[5]/a')
  var FooterHalogen = by.xpath('//*[@id="menu-main-menu"]/li[6]/a')
  var FooterHidLamps = by.xpath('//*[@id="menu-main-menu"]/li[7]/a')
  var FooterBallastAcc = by.xpath('//*[@id="menu-main-menu"]/li[8]/a')

  var FooterHome = by.xpath('//*[@id="menu-top-menu-1"]/li[2]/a')
  var FooterAboutUs = by.xpath('//*[@id="menu-top-menu-1"]/li[3]/a')
  var FooterAllProducts = by.xpath('//*[@id="menu-top-menu-1"]/li[4]/a')
  var FooterSpecSheets = by.xpath('//*[@id="menu-top-menu-1"]/li[5]/a')
  var FooterWhereToBuy = by.xpath('//*[@id="menu-top-menu-1"]/li[6]/a')
  var FooterNewArticles = by.xpath('//*[@id="menu-top-menu-1"]/li[7]/a')
  var FooterContactUs = by.xpath('//*[@id="menu-top-menu-1"]/li[8]/a')

  var Facebook = by.xpath('//*[@id="social"]/li[1]/a/i')
  var Instagram = by.xpath('//*[@id="social"]/li[2]/a/i')

  var FooterTamcoGroupLink = by.xpath('//*[text()="TAMCO Group"]')
  var FooterTermsConditions = by.xpath('//*[text()="Terms and Conditions"]')
  var FooterPrivacyPolicy = by.xpath('//*[text()="Privacy Policy"]')
  var FooterEightyThreeCreativeLink = by.xpath('//*[text()="Eighty Three Creative"]')

  //-----------------------------------Links-----------------------------------//

  var TamCoLink = "fusion-lamps.com"
  var AccountLink = "fusion-lamps.com/my-account"
  var CartLink = "fusion-lamps.com/view-quote"
  var TamcoGroupLink = "tamcogroup.com"
  var F4PLink = ""
  var TamliteLink = "www.tamliteusa.com"
  var CentureInstLink = ""
  var MCGLink = ""
  var RPPDevLink = ""

  var HomeLink = TamCoLink
  var AboutUsLink = "fusion-lamps.com/about-us"
  var AllProductsLink = "fusion-lamps.com/products"
  var SpecSheetsLink = "fusion-lamps.com/spec-sheets"
  var WhereToBuyLink = "cityelectricsupply.com/PayBill/login"
  var NewArticlesLink = "fusion-lamps.com/resources/news-articles"
  var ContactUsLink = "fusion-lamps.com/contact-us"

  var LedLampsLink = "fusion-lamps.com/category/led-lamps"
  var LedTubesLink = "fusion-lamps.com/category/led-tubes"
  var FluorescentTubesLink = "fusion-lamps.com/category/fluorescent-tubes"
  var CompactFluorescentLink = "fusion-lamps.com/category/compact-fluorescent"
  var IncandescentLink = "fusion-lamps.com/category/incandescent"
  var HalogenLink = "fusion-lamps.com/category/halogen"
  var HidLampsLink = "fusion-lamps.com/category/hid-lamps"
  var BallastAccLink = "fusion-lamps.com/category/ballasts-accessories"

  var LedLampsLinkFooter = LedLampsLink
  var LedTubesLinkFooter = LedTubesLink
  var FluorescentTubesLinkFooter = FluorescentTubesLink
  var CompactFluorescentLinkFooter = CompactFluorescentLink
  var IncandescentLinkFooter = IncandescentLink
  var HalogenLinkFooter = HalogenLink
  var HidLampsLinkFooter = HidLampsLink
  var BallastAccLinkFooter = BallastAccLink

  //-----------------------------------Functions-----------------------------------//

  this.clickLogo = async function () {
    try {
      await GUILib.waitforElement(Logo)
    } catch (err) {
      await console.log('Page was not loaded')
    }

  }

  this.clickLogo = async function () {
    
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
                  if (Arr.indexOf(text) === -1) {
                    await Arr.push(text);
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