var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');

var HomePage_Form = function () {
  var GUILib = new GUILibrary();
  var CF = new CommonFunctions();
  var EC = protractor.ExpectedConditions;
  var fs = require('fs');

  //----------------------------------------------------------------------------------------//
  var Logo = by.xpath('//*[@alt="Fusion Lamps"]')
  var Search = by.xpath('//*[@id="ls_query"]')
  var Magnefier = by.xpath('//*[@id="accountInfo"]/div[1]/form/button/i')
  var Account = by.xpath('//*[@id="accountInfo"]/div[1]/div/ul/li[1]/a')
  var Cart = by.xpath('//*[@id="accountInfo"]/div[1]/div/ul/li[2]/a')

  var OurBrandsDD = by.xpath('//*[@id="menu-item-37"]/a')
  var Home = by.xpath('//*[@id="menu-item-16"]/a')
  var AboutUs = by.xpath('//*[@id="menu-item-15"]/a')
  var AllProducts = by.xpath('//*[@id="menu-item-97"]/a')
  var SpecSheets = by.xpath('//*[@id="menu-item-14"]/a')
  var WhereToBuy = by.xpath('//*[@id="menu-item-17"]/a')
  var NewArticles = by.xpath('//*[@id="menu-item-3030"]/a')
  var ContactUs = by.xpath('//*[@id="menu-item-13"]/a')

 

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
  var Linkedin = by.xpath('//*[@id="social"]/li[2]/a/i')

  var FooterTamcoGroupLink = by.xpath('//*[text()="TAMCO Group"]')
  var FooterTermsConditions = by.xpath('//*[text()="Terms and Conditions"]')
  var FooterPrivacyPolicy = by.xpath('//*[text()="Privacy Policy"]')
  var FooterEightyThreeCreative = by.xpath('//*[text()="Eighty Three Creative"]')

  var FooterTermsConditionsLink = "fusion-lamps.com/terms-and-conditions"
  var FooterPrivacyPolicyLink = "fusion-lamps.com/privacy-policy"
  var FooterEightyThreeCreativeLink = "eightythreecreative.com"

  //-----------------------------------Links-----------------------------------//

  var TamCoLink = "fusion-lamps.com"
  var AccountLink = "fusion-lamps.com/my-account"
  var CartLink = "fusion-lamps.com/view-quote"


  var TamCo = by.xpath('//*[@id="brandNav"]/li[1]/a/img')

  var HomeLink = TamCoLink
  var AboutUsLink = "fusion-lamps.com/about-us"
  var AllProductsLink = "fusion-lamps.com/products"
  var SpecSheetsLink = "fusion-lamps.com/spec-sheets"
  var WhereToBuyLink = "cityelectricsupply"
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

  var FacebookLink = "facebook.com/FusionLamps"
  var LinkedinLink = 'linkedin.com/company/tamco-group'

  //-----------------------------------Functions-----------------------------------//

  this.waitLogo = async function () {
    try {
      await GUILib.waitforElement(Logo)
      await console.log('Page was loaded')
    } catch (e) {
      await console.log('Page was NOT loaded')
    }

  }

  this.clickLogo = async function () {
    await GUILib.clickTab(null, Logo, TamCoLink)
  }

  this.clickAccount = async function () {
    await GUILib.clickTab(null, Account, AccountLink)
  }

  this.clickCart= async function () {
    await GUILib.clickTab(null, Cart, CartLink)
  }

  //--------------------------------------------------------------------------------//

  this.clickTamCoLink = async function () {
    await GUILib.clickObject(OurBrandsDD)
    await GUILib.clickLink(TamCo, TamCoLink)
  }

  this.clickHome = async function () {
    await GUILib.clickTab(null, Home, HomeLink)
  }

  this.clickAboutUs = async function () {
    await GUILib.clickTab(null, AboutUs, AboutUsLink)
  }

  this.clickAllProducts = async function () {
    await GUILib.clickTab(null, AllProducts, AllProductsLink)
  }

  this.clickSpecSheets = async function () {
    await GUILib.clickTab(null, SpecSheets, SpecSheetsLink)
  }

  this.clickWhereToBuy = async function () {
    await GUILib.clickLink(WhereToBuy, WhereToBuyLink)
  }

  this.clickNewArticles = async function () {
    await GUILib.clickTab(null, NewArticles, NewArticlesLink)
  }

  this.clickContactUs = async function () {
    await GUILib.clickTab(null, ContactUs, ContactUsLink)
  }

  //--------------------------------------------------------------------------------//

  this.clickLedLamps = async function () {
    await GUILib.clickTab(null, LedLamps, LedLampsLink)
  }

  this.clickLedTubes = async function () {
    await GUILib.clickTab(null, LedTubes, LedTubesLink)
  }

  this.clickFluorescentTubes = async function () {
    await GUILib.clickTab(null, FluorescentTubes, FluorescentTubesLink)
  }

  this.clickCompactFluorescent = async function () {
    await GUILib.clickTab(null, CompactFluorescent, CompactFluorescentLink)
  }

  this.clickIncandescent = async function () {
    await GUILib.clickTab(null, Incandescent, IncandescentLink)
  }

  this.clickHalogen = async function () {
    await GUILib.clickTab(null, Halogen, HalogenLink)
  }

  this.clickHidLamps = async function () {
    await GUILib.clickTab(null, HidLamps, HidLampsLink)
  }

  this.clickBallastAcc = async function () {
    await GUILib.clickTab(null, BallastAcc, BallastAccLink)
  }

  //--------------------------------------------------------------------------------//

  this.clickTel = async function () {
    await CF.checkPhone(Tel)
  }

  //--------------------------------------------------------------------------------//

  this.clickFooterLedLamps = async function () {
    await GUILib.clickTab(null, FooterLedLamps, LedLampsLink)
  }

  this.clickFooterLedTubes = async function () {
    await GUILib.clickTab(null, FooterLedTubes, LedTubesLink)
  }

  this.clickFooterFluorescentTubes = async function () {
    await GUILib.clickTab(null, FooterFluorescentTubes, FluorescentTubesLink)
  }

  this.clickFooterCompactFluorescent = async function () {
    await GUILib.clickTab(null, FooterCompactFluorescent, CompactFluorescentLink)
  }

  this.clickFooterIncandescent = async function () {
    await GUILib.clickTab(null, FooterIncandescent, IncandescentLink)
  }

  this.clickFooterHalogen = async function () {
    await GUILib.clickTab(null, FooterHalogen, HalogenLink)
  }

  this.clickFooterHidLamps = async function () {
    await GUILib.clickTab(null, FooterHidLamps, HidLampsLink)
  }

  this.clickFooterBallastAcc = async function () {
    await GUILib.clickTab(null, FooterBallastAcc, BallastAccLink)
  }

  //--------------------------------------------------------------------------------//

  this.clickFooterHome = async function () {
    await GUILib.clickTab(null, FooterHome, HomeLink)
  }

  this.clickFooterAboutUs = async function () {
    await GUILib.clickTab(null, FooterAboutUs, AboutUsLink)
  }

  this.clickFooterAllProducts = async function () {
    await GUILib.clickTab(null,  FooterAllProducts, AllProductsLink)
  }

  this.clickFooterSpecSheets = async function () {
    await GUILib.clickTab(null, FooterSpecSheets, SpecSheetsLink)
  }

  this.clickFooterWhereToBuy = async function () {
    await GUILib.clickLink(FooterWhereToBuy, WhereToBuyLink)
  }

  this.clickFooterNewArticles = async function () {
    await GUILib.clickTab(null,  FooterNewArticles, NewArticlesLink)
  }

  this.clickFooterContactUs = async function () {
    await GUILib.clickTab(null,  FooterContactUs, ContactUsLink)
  }

  //--------------------------------------------------------------------------------//

  this.clickFacebook = async function () {
    await GUILib.clickLink(Facebook, FacebookLink)
  }

  this.clickLinkedin = async function () {
    await GUILib.clickLink(Linkedin, LinkedinLink)
  }

  //--------------------------------------------------------------------------------//

  this.clickFooterTamcoGroupLink = async function () {
    await GUILib.scrollToElement(FooterTamcoGroupLink)
    await GUILib.clickLink(FooterTamcoGroupLink, TamCoLink)
  }

  this.clickFooterTermsConditions = async function () {
    await GUILib.scrollToElement(FooterTermsConditions)
    await GUILib.clickTab(null, FooterTermsConditions, FooterTermsConditionsLink)
  }

  this.clickFooterPrivacyPolicy = async function () {
    await GUILib.scrollToElement(FooterPrivacyPolicy)
    await GUILib.clickTab(null, FooterPrivacyPolicy, FooterPrivacyPolicyLink)
  }

  this.clickFooterEightyThreeCreative = async function () {
    await GUILib.scrollToElement(FooterEightyThreeCreative)
    await GUILib.clickLink(FooterEightyThreeCreative, FooterEightyThreeCreativeLink)
  }




  
  



}



module.exports = new HomePage_Form;