var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');

var MyAccount = function () {
    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');

    //----------------------------------------------------------------------------------------//
    var Register = by.xpath("//a[text()='Register']")
    var ForgotPassword = by.xpath("//a[text()='Forgot Password?']")
    var LogIn = by.xpath("//input[@value='Log In']")

    var UserName = by.xpath('//*[@id="user_login"]')
    var Pass = by.xpath('//*[@id="user_pass"]')
    var Email = by.xpath("//strong[text()='Email Address: ']")
    var Logo = by.xpath('//*[@id="logo"]/div[2]/a/img')
    var InvalidCred = by.xpath("//p[text()='Invalid login credentials']")
    var RegisterHeader = by.xpath("//*[contains(text(),'Get your own')]")
    var GetNewPass = by.xpath("//input[@value='Get New Password']")
    var SignOut = by.xpath("//a[text()='Sign Out']")
    var PleaseLogIn = by.xpath("//p[text()='Please log in to view account details']")

    var MyAccount = "//a[text()='My Account']"
    var MyOrders = "//a[text()='My Orders']"
    var SavedItems = "//a[text()='Saved Items']"
    var MyTemplates = "//a[contains(text(),'Templates')]"



    //-----------------------------------Functions-----------------------------------//


    this.LogInPos = async function () {
        await GUILib.typeValue(UserName, 'test').then(async function () {
            await GUILib.typeValue(Pass, 'PhJH3PGLHhrI').then(async function () {
                await GUILib.clickObject(LogIn).then(async function () {
                    await browser.sleep(500)
                    await element(Email).isDisplayed().then(async function (result) {
                        expect(result).toBe(true);
                    })
                })
            })
        })
    }

    this.LogInNeg = async function () {
        await GUILib.typeValue(UserName, 'test').then(async function () {
            await GUILib.typeValue(Pass, '11111').then(async function () {
                await GUILib.clickObject(LogIn).then(async function () {
                    await browser.sleep(500)
                    await element(InvalidCred).isDisplayed().then(async function (result) {
                        expect(result).toBe(true);
                    })
                })
            })
        })
    }

    this.Register = async function () {
        await GUILib.clickObject(Register).then(async function () {
            await GUILib.waitUrl('https://fusion-lamps.com/wp-signup.php/').then(async function () {
                await element(RegisterHeader).isDisplayed().then(async function (result) {
                    expect(result).toBe(true);
                })
            })
        })
    }

    this.ForgotPassword = async function () {
        await GUILib.clickObject(ForgotPassword).then(async function () {
            await GUILib.waitUrl('lostpassword').then(async function () {
                await element(GetNewPass).isDisplayed().then(async function (result) {
                    expect(result).toBe(true);
                })
            })
        })
    }

    this.clickSignOut = async function () {
        await GUILib.clickObject(SignOut).then(async function () {
            await element(PleaseLogIn).isDisplayed().then(async function (result) {
                expect(result).toBe(true);
            })
        })
    }

    this.clickMyAccount = async function () {
        await CF.clickMyAccountTabs(MyAccount);
    }

    this.clickMyOrders = async function () {
        await CF.clickMyAccountTabs(MyOrders);
    }

    this.clickSavedItems = async function () {
        await CF.clickMyAccountTabs(SavedItems);
    }

    this.clickMyTemplates = async function () {
        await CF.clickMyAccountTabs(MyTemplates);
    }

    
}



module.exports = new MyAccount;