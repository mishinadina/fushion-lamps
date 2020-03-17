var GUILibrary = require('./GUILibrary_await.js');
//var CF = new CommonFunctions();

var CommonFunctions = function () {

    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');
    var Logo = by.xpath('//*[@class="logo"]')
    var n;

    var ShopAllLink = "https://fotedev.wpengine.com/shop/"
    
    var BodyLink = "https://fotedev.wpengine.com/product-category/skin/body/"
   
    var FaceLink = "https://fotedev.wpengine.com/product-category/skin/face/"
    var AloeLink = "https://fotedev.wpengine.com/product-category/skin/aloe/"

    var Sprays = "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/"
    var AfterSun = "https://fotedev.wpengine.com/product-category/sun/after-sun/"
    var Tanning = "https://fotedev.wpengine.com/product-category/sun/tanning/"

    var HealthLink = "https://fotedev.wpengine.com/product-category/health/" 
    var HouseholdLink = "https://fotedev.wpengine.com/product-category/household/"

    var Product1= by.xpath('//*[@class= "col col-3 my-3"]');
    var Product2 = by.xpath('//*[@class= "col-centered  my-3"]');
    var Product3 = by.xpath('//*[@class= "owl-item active"]');

    this.checkLink = async function (WebAddress, byObject1, byObject2, byObject3) {
        if (byObject1 != null && byObject2 == null && byObject3 == null) {
            await browser.findElement(Logo).then(async function (result) {
                await browser.actions({ bridge: true }).move({ duration: 500, origin: result, x: 0, y: 0 }).perform();
            })
            await browser.findElement(byObject1).then(async function (result) {
                await browser.actions({ bridge: true }).move({ duration: 500, origin: result, x: 0, y: 0 }).perform();
                await GUILib.clickObject(byObject1, 'First level is clicked');
            })
        }
        else {
            if (byObject3 == null) {
                await browser.findElement(Logo).then(async function (result) {
                    await browser.actions({ bridge: true }).move({ duration: 500, origin: result, x: 0, y: 0 }).perform();
                })
                await browser.findElement(byObject1).then(async function (result) {
                    await browser.actions({ bridge: true }).move({ duration: 500, origin: result, x: 0, y: 0 }).perform();
                    await GUILib.clickObject(byObject2, 'Second level is clicked');
                })
            }
            else {
                await browser.findElement(Logo).then(async function (result) {
                    await browser.actions({ bridge: true }).move({ duration: 500, origin: result, x: 0, y: 0 }).perform();
                })
                await browser.findElement(byObject1).then(async function (result) {
                    await browser.actions({ bridge: true }).move({ duration: 500, origin: result, x: 0, y: 0 }).perform();
                    await browser.findElement(byObject2).then(async function (result) {
                        await browser.actions({ bridge: true }).move({ duration: 500, origin: result, x: 0, y: 0 }).perform();
                        await GUILib.clickObject(byObject3, 'Third level is clicked');
                    })
                })
            }
        }
        await GUILib.getLinkText(WebAddress, byObject1, byObject2, byObject3).then(async function (linkFinal) {
            await console.log(linkFinal);
            await browser.wait(EC.urlContains(linkFinal), 15000);
            await browser.getCurrentUrl().then(async function (url) {
                await expect(url).toBe(linkFinal);
            })
            return linkFinal;
        }).then(async function (link) {
            await fs.writeFileSync('./link.txt', '');
            await fs.appendFileSync('./link.txt', link)
        })
    }

    this.checkEmail = async function (byObject1) {
        await GUILib.getAttribute(byObject1, 'href').then(async function (result) {
            await console.log(result);
            await expect(result).toContain('mailto:');
        })
    }

    this.checkPhone = async function (byObject1) {
        await GUILib.getAttribute(byObject1, 'href').then(async function (result) {
            await console.log(result);
            await expect(result).toContain('tel:');
        })
    }

    this.checkRequired = async function (byObject1, attribute) {
        await GUILib.getAttribute(byObject1, attribute).then(async function (result) {
            await console.log(result);
            await expect(result).toContain(true);
        })
    }

    this.clickDownloadFile = async function (filename, DownloadLink, ScrollPoint) {
        if (fs.existsSync(filename)) {
            fs.unlink(filename, (err) => {
                if (err) throw err;
                console.log('File was deleted');
            });
        } else {
            console.log('there is no File to be deleted');
        }
        var elmnt = element(ScrollPoint);
        await browser.executeScript("arguments[0].scrollIntoView();", elmnt);
        console.log('Scrolled to Element');
        await browser.sleep(1000);
        await GUILib.clickObject(DownloadLink, 'DownloadLink is clicked');
        await browser.sleep(2000);
    }

    this.verifyDownloadedRequestForm = async function () {
        await browser.sleep(15000);
        await browser.executeScript('browserstack_executor: {\"action\": \"fileExists\", \"arguments\": {\"fileName\": "Nextlink-IP-Justification-Form-acct125067580-_29.docx"}}').then(async function (file_exists) {
            if (file_exists == true) {
                console.log("File was downloaded");
            } else {
                console.log("File was not downloaded");
            }
        })
    }

    this.clickLink = async function (Link, ExtURL) {
        
        await console.log(Link)
        await browser.wait(EC.elementToBeClickable(element(Link)), 30000);
        await GUILib.clickObject(Link, 'Link is clicked').then(async function () {
            await browser.sleep(2000);
            let windowHandles = browser.getAllWindowHandles();
            let parentHandle, childHandle;
            await windowHandles.then(async function (handles) {
                parentHandle = await handles[0];
                childHandle = await handles[1];

                await browser.switchTo().window(childHandle).then(async function () {
                    await browser.wait(EC.urlContains('com'), 10000);
                    await browser.getCurrentUrl().then(async function (url) {
                        await console.log("Child window:- " + url);
                        if (url.includes(ExtURL)) {
                            await console.log('New tab is opened in the child window');
                            await expect(url).toContain(ExtURL);
                            await browser.close();
                            await browser.switchTo().window(parentHandle);
                        } else {
                            await browser.switchTo().window(parentHandle).then(async function () {
                                await browser.sleep(2000);
                                await browser.getCurrentUrl().then(async function (url) {
                                    await console.log("Parent window:- " + url);
                                    await console.log('New tab is opened in the parent window');
                                    await expect(url).toContain(ExtURL);
                                    await browser.close();
                                    await browser.switchTo().window(childHandle);
                                })
                            })
                        }
                        var allWindowHandlers = await browser.getAllWindowHandles();
                        if (allWindowHandlers.length > 1) {
                            console.log("There are several open windows");
                            for (let windowHandlerIndex = 1; windowHandlerIndex < allWindowHandlers.length; windowHandlerIndex++) {
                                console.log("Closing open window");
                                const windowHandler = allWindowHandlers[windowHandlerIndex];
                                await browser.switchTo().window(windowHandler);
                                await browser.close();
                            }
                        }
                        else {
                            console.log("Only one window is opened");
                        }
                        await browser.switchTo().window(allWindowHandlers[0]);
                    })
                })
            })
        })
    }

    this.clickFooterLink = async function (byObject) {
        var FooterXpathText = await byObject.toString()
        var count = FooterXpathText.length
        var FooterXpathText = FooterXpathText.slice(9, count - 1).replace("sub-menu dropdown-menu", "item")
        await GUILib.scrollToElement(by.xpath(FooterXpathText))
        await GUILib.waitforElement(by.xpath(FooterXpathText));
        await GUILib.clickObject(by.xpath(FooterXpathText))
        var ExpectedLink = await fs.readFileSync('./link.txt', 'utf8')
        await browser.getCurrentUrl().then(async function (url) {
            await expect(url).toBe(ExpectedLink);
            await browser.sleep(1500);
        })
    }

    this.clickFooterSocialMedia = async function (byObject, link) {
        var FooterXpathText = await byObject.toString()
        var count = FooterXpathText.length
        if (link !== "google.com" && link !== "eightythreecreative.com") {
            var FooterXpathText = FooterXpathText.slice(9, count - 1).replace("//", "//*[@id='footer']//")
        } else {
            var FooterXpathText = FooterXpathText.slice(9, count - 1).replace("//", "//*[@id='quickContact']//")
        }
        await console.log(FooterXpathText)
        var FooterXpath = by.xpath(FooterXpathText)
        await GUILib.scrollToElement(FooterXpath)
        await GUILib.waitforElement(FooterXpath);
        await GUILib.clickObject(FooterXpath, 'Link is clicked').then(async function () {
            await browser.sleep(2000);
            let windowHandles = browser.getAllWindowHandles();
            let parentHandle, childHandle;
            await windowHandles.then(async function (handles) {
                parentHandle = await handles[0];
                childHandle = await handles[1];
                await browser.switchTo().window(childHandle).then(async function () {
                    await browser.wait(EC.urlContains('com'), 10000);
                    await browser.getCurrentUrl().then(async function (url) {
                        await console.log("Child window:- " + url);
                        if (url.includes(link)) {
                            await console.log('New tab is opened in the child window');
                            await expect(url).toContain(link);
                            await browser.close();
                            await browser.switchTo().window(parentHandle);
                        } else {
                            await browser.switchTo().window(parentHandle).then(async function () {
                                await browser.sleep(2000);
                                await browser.getCurrentUrl().then(async function (url) {
                                    await console.log("Parent window:- " + url);
                                    await console.log('New tab is opened in the parent window');
                                    await expect(url).toContain(link);
                                    await browser.close();
                                    await browser.switchTo().window(childHandle);
                                })
                            })
                        }
                        var allWindowHandlers = await browser.getAllWindowHandles();
                        if (allWindowHandlers.length > 1) {
                            console.log("There are several open windows");
                            for (let windowHandlerIndex = 1; windowHandlerIndex < allWindowHandlers.length; windowHandlerIndex++) {
                                console.log("Closing open window");
                                const windowHandler = allWindowHandlers[windowHandlerIndex];
                                await browser.switchTo().window(windowHandler);
                                await browser.close();
                            }
                        }
                        else {
                            console.log("Only one window is opened");
                        }
                        await browser.switchTo().window(allWindowHandlers[0]);
                    })
                })
            })
        })

    }

    this.hoverImageclickBtn = async function (Image, Btn) {
        await GUILib.scrollToElement(Image);
        await GUILib.waitforElement(Image)
        await GUILib.moveToElement(Image);
        await GUILib.waitforElement(Btn)
        await GUILib.clickObject(Btn);
    }

    this.goToCart = async function (Cart, ViewCart, ContinueShopping) {
        await GUILib.clickObject(Cart, "Cart Icon is clicked");
        await GUILib.waitforElement(ViewCart);
        await GUILib.clickObject(ViewCart, "View Cart Button is clicked");
        await GUILib.waitforElement(ContinueShopping);
    }

    this.setProduct = async function () {
        var link = await browser.getCurrentUrl()
        if (link == ShopAllLink) {
            return Product1;
        } else {
            if (link !== HealthLink && link !== HouseholdLink) {
                return Product2;
            } else {
                return Product3;
            }
        }

    }


};

module.exports = CommonFunctions;