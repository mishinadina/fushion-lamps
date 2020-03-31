var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');




var HomePage_Form = function () {
  var GUILib = new GUILibrary();
  var EC = protractor.ExpectedConditions;
  var CF = new CommonFunctions();
  var fs = require('fs');



  //----------------------------------------------------------------------------------------//
  var LogOut = by.id("customer_logout_link")

  this.logOut = async function () {
    await GUILib.clickObject(LogOut);
    await  GUILib.waitforElement(by.id("CustomerEmail"))
  }
}



module.exports = new HomePage_Form;