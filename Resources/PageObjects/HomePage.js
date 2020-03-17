var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');




var HomePage_Form = function () {
  var GUILib = new GUILibrary();
  var EC = protractor.ExpectedConditions;
  var CF = new CommonFunctions();
  var fs = require('fs');
  var n = 1



  //----------------------------------------------------------------------------------------//
  var Logo = by.xpath("//*[contains(@class,'logo')]")
  var Facebook = by.xpath("//*[contains(@href, 'www.facebook.com')]")
  var FacebookFooter = by.xpath("//*[@class='social']//*[contains(@href, 'www.facebook.com')]")
  var FacebookLink = "https://www.facebook.com/FOTEUSA"
  var Instagram = by.xpath("//*[contains(@href, 'www.instagram.com/fote_usa')]")
  var InstagramFooter = by.xpath("//*[@class='social']//*[contains(@href, 'www.instagram.com/fote_usa')]")
  var InstagramLink = "www.instagram.com/fote_usa"
  var Twitter = by.xpath("//*[@class='social']//*[contains(@href, 'twitter.com/foteusa')]")
  var TwitterFooter = by.xpath("//*[contains(@href, 'twitter.com/foteusa')]")
  var TwitterLink = "twitter.com/foteusa"

  var Google = by.xpath("//*[contains(@href,'https://www.google.com')]")
  var GoogleLink = "google.com"
  var PhoneLink = by.xpath("//*[text()='(817) 510-1600']")

  var ETC = by.xpath("//*[contains(@href,'https://eightythreecreative.com')]")
  var ETClink = "eightythreecreative.com"

  var WebSiteFooter = by.xpath("//*[text()='. All rights reserved.']")

  var PrivacyPolicy = by.xpath("//*[text()='Privacy Policy']")
  var TermsConditions = by.xpath("//*[text()='Terms & Conditions']")

  var SignUpClose = by.xpath("//*[contains(@class,'mc-closeModal')]")
  var CookiesPopUp = by.xpath("//*[text()='Got it!']")

  var ShopAll = by.xpath("//*[text()='Shop All']")
  var Skin = by.xpath("//*[text()='Skin ']")
  var Body = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='Body']")
  var Face = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='Face']")
  var Aloe = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='Aloe']")
  var Sun = by.xpath("//*[text()='Sun ']")
  var Sprays = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='Sprays & Lotions']")
  var AfterSun = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='After Sun']")
  var Tanning = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='Tanning']")
  var Health = by.xpath("//*[text()='Health ']")
  var AloeJuice = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='Aloe Juice']")
  var Household = by.xpath("//*[text()='Household ']")
  var Cleaning = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='Cleaning']")
  var Discover = by.xpath("//*[text()='Discover ']")
  var AboutUs = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='About Us']")
  var Ingredients = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='Ingredients']")
  var Blog = by.xpath("//*[@class='sub-menu dropdown-menu']//*[text()='Blog']")
  var Cart = by.xpath("//*[@class='cart']")

  var LearnMoreBtn1 = by.xpath("//*[@id='homeIngredients']//a[text()='Learn More']")

  var ArrowCarouselNext = by.xpath("//*[@class='owl-stage-outer']//div.card[@class='owl-item active']//button[@class='owl-next']")

  var ArrowCarouselPrev = by.xpath("//*[@class='owl-stage-outer']//div.card[@class='owl-item active']//button[@class='owl-prev']")
  var ArrowCarouselClonedPrev = by.xpath("//*[@class='owl-stage-outer']//div.card[@class='owl-item cloned active']//button[@class='owl-prev']")

  var ArrowCarouselText = by.xpath("//*[@class='owl-stage-outer']//div.card[@class='owl-item active']//descendant::div//descendant::img")

  var ArrowCarouselTextClonedPrev = by.xpath("//*[@class='owl-stage-outer']//div.card[@class='owl-item cloned']//descendant::div//descendant::img")
  var ArrowCarouselTextPrev = by.xpath("//*[@class='owl-stage-outer']//div.card[@class='owl-item active']//descendant::div//descendant::img")

  var ArrowCarouselShop = by.xpath("//*[@class='owl-stage-outer']//div.card[@class='owl-item active']//a[text()='Shop']")

  var ArrowNext = by.xpath("//*[@class='owl-nav']//*[@class='owl-next']")
  var ArrowPrev = by.xpath("//*[@class='owl-nav']//*[@class='owl-prev']")
  var CarouselHeader = by.xpath("//*[@class='owl-item']//h3")

  var ShopBtn1 = by.xpath("//*[@id='homeTiles']/div/div/div[1]//a[text()='Shop']")
  var ShopImage1 = by.xpath("//*[@id='homeTiles']/div/div/div[1]//tr/td")


  var ShopBtn2 = by.xpath("//*[@id='homeTiles']/div/div/div[2]//a[text()='Shop']")
  var ShopImage2 = by.xpath("//*[@id='homeTiles']/div/div/div[2]//tr/td")

  var ReadMoreBtn = by.xpath("//*[@class='col col-6 my-3']//*[text()='Read More']")
  var ReadMoreImage = by.xpath("//*[@id='homeTiles']/div/div/div[3]//td")

  var LearnMoreBtn2 = by.xpath("//*[@class='col col-6 my-3']//*[text()='Learn More']")
  var LeanMoreImage2 = by.xpath("//*[@id='homeTiles']/div/div/div[4]//td")

  var ShopBtn3 = by.xpath("//*[@id='wooCallout']//a[text()='Shop']")

  var ProductLink = "https://fotedev.wpengine.com/product-category/"
  var BaseLink = "https://fotedev.wpengine.com/"

  //-----------------------------------------Verifications----------------------------//

  this.clickSignUpClose = async function () {
    await element(SignUpClose).isPresent().then(async function (result) {
      if (result) {
        await GUILib.clickObject(SignUpClose);
        await browser.wait(EC.invisibilityOf(element(SignUpClose)), 5000);
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  this.clickCookiesPopUp = async function () {
    await element(CookiesPopUp).isPresent().then(async function (result) {
      if (result == true) {
        await GUILib.clickObject(CookiesPopUp, "Cookies Pop Up is closed");
        await browser.wait(EC.invisibilityOf(element(CookiesPopUp)), 5000);
      }
    })
  }

  this.clickFacebook = async function () {
    await GUILib.waitforElement(Facebook);
    await browser.sleep(1000)
    await CF.clickLink(Facebook, FacebookLink)
  }

  this.clickInstagram = async function () {
    if (browser.browserName !== 'Safari') {
    await GUILib.waitforElement(Instagram);
    await browser.sleep(1000)
    await CF.clickLink(Instagram, InstagramLink)
    }
  }

  this.clickTwitter = async function () {
    if (browser.browserName !== 'Safari') {
    await GUILib.waitforElement(Twitter);
    await browser.sleep(1000)
    await CF.clickLink(Twitter, TwitterLink)
    }
  }

  this.clickShopAll = async function () {
    await GUILib.waitforElement(ShopAll);
    await GUILib.clickObject(ShopAll);
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain("https://fotedev.wpengine.com/shop/")
    })
  }

  this.clickSkinBody = async function () {
    await GUILib.waitforElement(Skin);
    await CF.checkLink(ProductLink, Skin, Body);
  }

  this.clickSkinFace = async function () {
    await GUILib.waitforElement(Skin);
    await CF.checkLink(ProductLink, Skin, Face);
  }

  this.clickSkinAloe = async function () {
    await GUILib.waitforElement(Skin);
    await CF.checkLink(ProductLink, Skin, Aloe);
  }

  this.clickSunSprays = async function () {
    await GUILib.waitforElement(Sun);
    await CF.checkLink(ProductLink, Sun, Sprays);
  }

  this.clickSunAfterSun = async function () {
    await GUILib.waitforElement(Sun);
    await CF.checkLink(ProductLink, Sun, AfterSun);
  }

  this.clickSunTanning = async function () {
    await GUILib.waitforElement(Sun);
    await CF.checkLink(ProductLink, Sun, Tanning);
  }

  this.clickHealthAloeJuice = async function () {
    await GUILib.waitforElement(Health);
    await CF.checkLink(ProductLink, Health);
  }

  this.clickHouseholdCleaning = async function () {
    await GUILib.waitforElement(Household);
    await CF.checkLink(ProductLink, Household);
  }

  this.clickDiscoverAboutUs = async function () {
    await GUILib.waitforElement(Discover);
    await CF.checkLink(BaseLink, Discover, AboutUs);
  }

  this.clickDiscoverIngredients = async function () {
    await GUILib.waitforElement(Discover);
    await CF.checkLink(BaseLink, Discover, Ingredients);
  }

  this.clickDiscoverBlog = async function () {
    await GUILib.waitforElement(Discover);
    await CF.checkLink(BaseLink, Discover, Blog);
  }

  this.clickBodyFooter = async function () {
    await CF.clickFooterLink(Body)
  }

  this.clickFaceFooter = async function () {
    await CF.clickFooterLink(Face)
  }

  this.clickAloeFooter = async function () {
    await CF.clickFooterLink(Aloe)
  }

  this.clickSpraysFooter = async function () {
    await CF.clickFooterLink(Sprays)
  }

  this.clickAfterSunFooter = async function () {
    await CF.clickFooterLink(AfterSun)
  }

  this.clickTanningFooter = async function () {
    await CF.clickFooterLink(Tanning)
  }

  this.clickAloeJuiceFooter = async function () {
    await CF.clickFooterLink(Health)
  }

  this.clickCleaningFooter = async function () {
    await CF.clickFooterLink(Cleaning)
  }

  this.clickFacebookFooter = async function () {
    await GUILib.waitforElement(Facebook);
    await CF.clickFooterSocialMedia(Facebook, FacebookLink)
  }

  this.clickInstagramFooter = async function () {
    await GUILib.waitforElement(Instagram);
    await CF.clickFooterSocialMedia(Instagram, InstagramLink)
  }

  this.clickTwitterFooter = async function () {
    await GUILib.waitforElement(Twitter);
    await CF.clickFooterSocialMedia(Twitter, TwitterLink)
  }

  this.clickGoogleAddress = async function () {
    await GUILib.waitforElement(Skin);
    await CF.clickFooterSocialMedia(Google, GoogleLink)
  }

  this.checkPhoneLink = async function () {
    await GUILib.waitforElement(Skin);
    await CF.checkPhone(PhoneLink)
  }

  this.clickETCLink = async function () {
    await GUILib.waitforElement(Skin);
    await CF.clickFooterSocialMedia(ETC, ETClink)
  }

  this.clickFooterLink = async function () {
    await GUILib.waitforElement(Skin);
    await GUILib.scrollToElement(WebSiteFooter);
    await browser.wait(EC.visibilityOf(element(WebSiteFooter)), 30000);
    await GUILib.clickObject(WebSiteFooter)
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain(BaseLink)
    })
  }

  this.clickPrivacyPolicy = async function () {
    await GUILib.waitforElement(Skin);
    await GUILib.scrollToElement(PrivacyPolicy);
    await browser.wait(EC.visibilityOf(element(PrivacyPolicy)), 30000);
    await GUILib.clickObject(PrivacyPolicy)
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain("privacy-policy")
    })
  }

  this.clickTermsConditions = async function () {
    await GUILib.waitforElement(Skin);
    await GUILib.scrollToElement(TermsConditions);
    await browser.wait(EC.visibilityOf(element(TermsConditions)), 30000);
    await GUILib.clickObject(TermsConditions)
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain('terms-conditions')
    })
  }

  this.clickLogo = async function () {
    await GUILib.waitforElement(Logo);
    await GUILib.clickObject(Logo)
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain(BaseLink)
    })
  }

  this.clickArrowNext = async function () {
    var Arr = [];
    var Arr1 = [];
    await GUILib.scrollToElement(ArrowNext)
    await GUILib.waitforElement(ArrowNext)
    await element.all(by.xpath("//*[@class='permalink']")).then(async function (AllImages) {
      var count = await AllImages.length;
      await console.log(count)
      for (n = 0; n < count; n++) {
        var Arrow = await AllImages[n].getWebElement();
        await Arrow.isDisplayed().then(async function (result) {
          if (result !== true) {
            await Arrow.getAttribute('href').then(async function (href) {
              await Arr.push(href);
              var count = await Arr.length;
              await console.log(count)
            })
          }
        })
      }
    })
    await GUILib.clickObject(ArrowNext);
    await element.all(by.xpath("//*[@class='permalink']")).then(async function (AllImages) {
      var count = await AllImages.length;
      await console.log(count)
      for (n = 0; n < count; n++) {
        var Arrow = await AllImages[n].getWebElement();
        await Arrow.isDisplayed().then(async function (result) {
          if (result !== true) {
            await Arrow.getAttribute('href').then(async function (href) {
              await Arr1.push(href);
              var count = await Arr1.length;
              await console.log(count)
            })
          }
        })
      }
    })
    expect(Arr).not.toBe(Arr1);
  }

  this.clickArrowPrev = async function () {
    await GUILib.scrollToElement(ArrowNext)
    await GUILib.waitforElement(ArrowNext)
    await GUILib.clickObject(ArrowNext);
    var Arr = [];
    var Arr1 = [];
    await GUILib.scrollToElement(ArrowPrev)
    await GUILib.waitforElement(ArrowPrev)
    await element.all(by.xpath("//*[@class='permalink']")).then(async function (AllImages) {
      var count = await AllImages.length;
      await console.log(count)
      for (n = 0; n < count; n++) {
        var Arrow = await AllImages[n].getWebElement();
        await Arrow.isDisplayed().then(async function (result) {
          if (result !== true) {
            await Arrow.getAttribute('href').then(async function (href) {
              await Arr.push(href);
              var count = await Arr.length;
              await console.log(count)
            })
          }
        })
      }
    })
    await GUILib.clickObject(ArrowPrev);
    await element.all(by.xpath("//*[@class='permalink']")).then(async function (AllImages) {
      var count = await AllImages.length;
      await console.log(count)
      for (n = 0; n < count; n++) {
        var Arrow = await AllImages[n].getWebElement();
        await Arrow.isDisplayed().then(async function (result) {
          if (result !== true) {
            await Arrow.getAttribute('href').then(async function (href) {
              await Arr1.push(href);
              var count = await Arr1.length;
              await console.log(count)
            })
          }
        })
      }
    })
    expect(Arr).not.toBe(Arr1);
  }

  this.clickShopBtn1 = async function () {
    await GUILib.waitforElement(Logo);
    await CF.hoverImageclickBtn(ShopImage1, ShopBtn1)
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain("/product-category/sun/sprays-lotions/")
    })
  }

  this.clickShopBtn2 = async function () {
    await GUILib.waitforElement(Logo);
    await CF.hoverImageclickBtn(ShopImage2, ShopBtn2)
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain("/product-category/sun/after-sun/")
    })
  }

  this.clickShopBtn3 = async function () {
    await GUILib.waitforElement(Logo);
    await GUILib.scrollToElement(ShopBtn3)
    await GUILib.clickObject(ShopBtn3)
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain("/product-category/health/")
    })
  }

  this.clickReadMoreBtn = async function () {
    await GUILib.waitforElement(Logo);
    await CF.hoverImageclickBtn(ReadMoreImage, ReadMoreBtn)
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain("/blog/")
    })
  }

  this.clickLearnMoreBtn1 = async function () {
    await GUILib.waitforElement(Logo);
    await GUILib.scrollToElement(LearnMoreBtn1);
    await GUILib.clickObject(LearnMoreBtn1);
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain("/ingredients/")
    })
  }

  this.clickLearnMoreBtn2 = async function () {
    await GUILib.waitforElement(Logo);
    await CF.hoverImageclickBtn(LeanMoreImage2, LearnMoreBtn2)
    await browser.getCurrentUrl().then(async function (link) {
      await expect(link).toContain("/about-us/")
    })
  }

  this.clickArrowNextCarousel = async function () {
    await GUILib.waitforElement(Logo);
    await element.all(by.xpath('//*[@class="owl-item"]')).count().then(async function (count) {
      await console.log(count)
      for (var n = 1; n < count; n++) {
        await element(SignUpClose).isPresent().then(async function (result) {
          if (result == true) {
            await GUILib.clickObject(SignUpClose);
          }
        })
        await element(ArrowCarouselText).getAttribute('alt').then(async function (AltText1) {
          await console.log(AltText1)
          await browser.wait(EC.elementToBeClickable(element(ArrowCarouselNext)), 5000);
          await element(ArrowCarouselNext).click().then(async function () {
            await browser.sleep(2000);
            await console.log("Arrow Next is clicked in Carousel")
            await element(ArrowCarouselText).getAttribute('alt').then(async function (AltText2) {
              await console.log(AltText2)
              expect(AltText1).not.toBe(AltText2);
            })
          })
        })
      }
    })
  }

  this.clickArrowPrevCarousel = async function () {
    await GUILib.waitforElement(Logo);
    await element.all(by.xpath('//*[@class="owl-item"]')).count().then(async function (count) {
      await console.log(count)
      await element(ArrowCarouselText).getAttribute('alt').then(async function (AltText1) {
       
        if (AltText1 !== "Healthy Skin is Always In Season") {
          await console.log("Staring point 1 for Carousel: " + AltText1)
          await GUILib.clickObject(ArrowCarouselPrev, "Arrow Prev is cliked to get to Staring Point")
          await element(ArrowCarouselText).getAttribute('alt').then(async function (AltText1) {
            await console.log("Staring point 2 for Carousel: " + AltText1)
            if (AltText1 !== "Healthy Skin is Always In Season") {
              await GUILib.clickObject(ArrowCarouselPrev, "Arrow Prev is cliked to get to Staring Point")
              await element(ArrowCarouselText).getAttribute('alt').then(async function (AltText1) {
                await console.log("Staring point 3 for Carousel: " + AltText1)
                if (AltText1 !== "Healthy Skin is Always In Season") {
                  await GUILib.clickObject(ArrowCarouselPrev, "Arrow Prev is cliked to get to Staring Point")
                }
              })
            }
          })
        }
      }) 
          for (var n = 1; n < count; n++) {
            if (n == 2) {
              await console.log(n)
              await element(ArrowCarouselTextClonedPrev).getAttribute('alt').then(async function (AltText1) {
                await console.log(AltText1)
                await browser.wait(EC.elementToBeClickable(element(ArrowCarouselClonedPrev)), 5000);
                await element(ArrowCarouselClonedPrev).click().then(async function () {
                  await console.log("Arrow Prev is clicked in Carousel")
                  await browser.sleep(2000);
                  await element(ArrowCarouselTextPrev).getAttribute('alt').then(async function (AltText2) {
                    await console.log(AltText2)
                    expect(AltText1).not.toBe(AltText2);
                  })
                })
              })
            }
            if ((n == 1) || (n == 6)) {
              await console.log(n)
              await element(ArrowCarouselText).getAttribute('alt').then(async function (AltText1) {
                await console.log(AltText1)
                await browser.wait(EC.elementToBeClickable(element(ArrowCarouselPrev)), 5000);
                await element(ArrowCarouselPrev).click().then(async function () {
                  await console.log("Arrow Prev is clicked in Carousel")
                  await browser.sleep(2000);
                  await element(ArrowCarouselTextClonedPrev).getAttribute('alt').then(async function (AltText2) {
                    await console.log(AltText2)
                    expect(AltText1).not.toBe(AltText2);
                  })
                })
              })
            }
            if (n > 2 && n !== 6) {
              await console.log(n)
              await element(ArrowCarouselText).getAttribute('alt').then(async function (AltText1) {
                await console.log(AltText1)
                await browser.wait(EC.elementToBeClickable(element(ArrowCarouselPrev)), 5000);
                await element(ArrowCarouselPrev).click().then(async function () {
                  await console.log("Arrow Prev is clicked in Carousel")
                  await browser.sleep(2000);
                  await element(ArrowCarouselTextPrev).getAttribute('alt').then(async function (AltText2) {
                    await console.log(AltText2)
                    expect(AltText1).not.toBe(AltText2);
                  })
                })
              })
            }
          }
      })
  }

  // this.clickArrowPrevCarousel = async function () {
  //   await GUILib.waitforElement(Logo);
  //   await element.all(by.xpath('//*[@class="owl-item"]')).count().then(async function (count) {
  //     await console.log(count)
  //     for (var n = 1; n < count; n++) {
  //       await element(ArrowCarouselNext).click().then(async function () {
  //         await console.log("Arrow Next is clicked in Carousel")
  //       })
  //       await element(SignUpClose).isPresent().then(async function (result) {
  //         if (result == true) {
  //           await GUILib.clickObject(SignUpClose);
  //         }
  //       })
  //       await element(ArrowCarouselText).getAttribute('alt').then(async function (AltText1) {
  //         await console.log(AltText1)
  //         await browser.wait(EC.elementToBeClickable(element(ArrowCarouselPrev)), 5000);
  //         await element(ArrowCarouselPrev).click().then(async function () {
  //           await console.log("Arrow Prev is clicked in Carousel")
  //           await element(ArrowCarouselText).getAttribute('alt').then(async function (AltText2) {
  //             await console.log(AltText2)
  //             expect(AltText1).not.toBe(AltText2);
  //           })
  //         })
  //       })
  //     }
  //   })
  // }

  // await element(ArrowCarouselShop).click().then(async function () {
  //   await console.log("===========")
  // })
  // await element(ArrowCarouselText).getAttribute('alt').then(async function (AltText) {
  //   await console.log(AltText)
  // })

  // await element.all(ArrowCarousel).then(async function (AllArrows) {
  //   var count = await AllArrows.length;
  //   await console.log(count)
  //   for (n = 0; n < count; n++) {
  //     await console.log(n);
  //     var Arrow = await AllArrows[0].getWebElement();
  //     await Arrow.isDisplayed().then(async function (result) {
  //       if (result !== true) {
  //         await console.log("Here you gooooo!");
  //       }
  //     })
  //   }
  // })



  // await element.all(CarouselHeader).then(async function (AllCarouselHeader) {
  //   var count = await AllCarouselHeader.length;
  //   await console.log(count)
  //   for (n = 0; n < count; n++) {
  //     await console.log(n);
  //     var Header = await AllCarouselHeader[n].getWebElement();
  //     await Header.isDisplayed().then(async function (result) {
  //       if (result == true) {
  //         await Header.getText().then(async function (HeaderText) {
  //           await console.log("Here you gooooo!");
  //         })
  //       }
  //     })
  //   }
  // })


  // await browser.getCurrentUrl().then(async function (link) {
  //   await expect(link).toContain(BaseLink)
  // })






}


module.exports = new HomePage_Form;