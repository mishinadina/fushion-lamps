var GUILibrary = require('./GUILibrary_await.js');
var HomePage = require('../../Resources/PageObjects/HomePage.js');

var CommonFunctions = function () {


    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');
    var n;

    var Product = by.xpath("//button[text()='Quick View']")
    var SortByCategory = by.xpath("//*[@id='productMain']//h4[text()='Sort By']")
    var Image = by.xpath("//div[@id='product__image']//a[contains(href, png)]")
    var Desc = by.xpath("//div[@id='product__details']//h2")
    var Error404 = by.xpath("//h1[text()='404 Not Found']")
    var Logo = by.xpath('//*[@id="logo"]/div[2]/a/img')



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

    this.checkRequiredClass = async function (byObject1, attribute) {
        await GUILib.getAttribute(byObject1, attribute).then(async function (result) {
            await console.log(result);
            await expect(result).toContain('required');
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

    


    this.hoverImageclickBtn = async function (Image, Btn) {
        await GUILib.scrollToElement(Image);
        await GUILib.waitforElement(Image)
        await GUILib.moveToElement(Image);
        await GUILib.waitforElement(Btn)
        await GUILib.clickObject(Btn);
    }

    this.editName = async function (EditBtn, ChangeField, UpdateBtn, ResultField) {
        var result = ''
        await GUILib.clickObject(EditBtn).then(async function () {
            await GUILib.scrollToElement(ChangeField)
            await element(ChangeField).clear().then(async function () {
                await browser.sleep(1000)
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < 10; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                 }
                await console.log(result)
                    await GUILib.typeValue(ChangeField, result).then(async function () {
                        await browser.sleep(1000)
                        await GUILib.clickObject(UpdateBtn).then(async function () {
                            await GUILib.waitforElement(ResultField)
                            await GUILib.getText(ResultField).then(async function (textActual) {
                                expect(textActual).toContain(result)
                            })
                        })
                    })
            })
            await browser.sleep(1000)
        })
    }

    this.clickAllProducts = async function () {
        var Arr = [];
        var Arr1 = [];
        var Arr2 = [];
        var z = 1;
        await element.all(Product).count().then(async function (count) {
            await console.log(count)
            for (var n = 0; n < count; n++) {
                await console.log("n" + n)
                await GUILib.waitforElement(SortByCategory)
                await element.all(Product).then(async function (AllProduct) {
                    //var ItemElement = await AllProduct[n].getWebElement();
                    var ProductScroll = by.xpath("//*[@id='grid']/div[" + z + "]/div/a")
                    await console.log("z" + z)   
                    var elmnt = element(ProductScroll);
                    await browser.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });", elmnt).then(async function () {
                        await browser.wait(EC.visibilityOf(elmnt), 30000);
                        await console.log("Scrolled to element");
                    })
                    await element(ProductScroll).click()
                    await z++;
                    await browser.sleep(2000);
                    await await GUILib.waitforElement(Logo)
                    await browser.getCurrentUrl().then(async function (url) {
                        await element.all(Image).count().then(async function (AllImage) {
                            await console.log("AllImage " + AllImage)
                            if (AllImage == 0) {
                                await Arr.push(url);
                            }
                        })
                        await element.all(Desc).count().then(async function (AllDesc) {
                            await console.log("AllDesc " + AllDesc)
                            if (AllDesc == 0) {
                                await Arr1.push(url);
                            }
                        })
                        await element.all(Error404).count().then(async function (AllError404) {
                            await console.log("AllError404 " + AllError404)
                            if (AllError404 > 0) {
                                await Arr2.push(url);
                            }
                        })
                        await browser.navigate().back();
                        await browser.getCurrentUrl().then(async function (url) {
                            await browser.wait(EC.urlContains("fusion-lamps.com/products"),30000)
                        });
                    })
                })
            }
        })

        await console.log("===Products with No Image: " + Arr)
        expect(Arr.length).toBe(0)
        await console.log("===Products with No Desc: " + Arr1)
        expect(Arr1.length).toBe(0)
        await console.log("===Products with 404: " + Arr2)
        expect(Arr2.length).toBe(0)
    }




};

module.exports = CommonFunctions;