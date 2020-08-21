var GUILibrary = require('./GUILibrary_await.js');
var HomePage = require('../../Resources/PageObjects/HomePage.js');

var CommonFunctions = function () {


    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');
    var n;


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




};

module.exports = CommonFunctions;