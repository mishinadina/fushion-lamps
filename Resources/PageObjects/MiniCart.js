var GUILibrary = require('../Utility/GUILibrary_await.js');
var HomePage = require('./HomePage.js');
var fs = require('fs');
var CommonFunctions = require('../Utility/CommonFunctions.js');


var MiniCart_Form = function () {
    var GUILib = new GUILibrary();
    var EC = protractor.ExpectedConditions;
    var CF = new CommonFunctions();

  

    //-----------------------------------------First Navigation Tabs Verifications----------------------------//

    this.writeProductData = async function () {
        await GUILib.writeJSON(Product, ElementText);
    }

    this.chooseRandomCategory = async function () {

        switch (Math.floor(Math.random() * 9) + 1) {
            case 1:
                await HomePage.clickShopAll();
                break;
            case 2:
                await HomePage.clickSkinBody();
                break;
            case 3:
                await HomePage.clickSkinFace();
                break;
            case 4:
                await HomePage.clickSkinAloe();
                break;
            case 5:
                await HomePage.clickSunSprays();
                break;
            case 6:
                await HomePage.clickSunAfterSun();
                break;
            case 7:
                await HomePage.clickSunTanning();
                break;
            case 8:
                await HomePage.clickHealthAloeJuice();
                break;
            case 9:
                await HomePage.clickHouseholdCleaning();
        }

    }

    
}
module.exports = new MiniCart_Form;