var GUILibrary = require('../Utility/GUILibrary_await.js');
var CommonFunctions = require('../Utility/CommonFunctions.js');

var Quote= function () {
    var GUILib = new GUILibrary();
    var CF = new CommonFunctions();
    var EC = protractor.ExpectedConditions;
    var fs = require('fs');

    //----------------------------------------------------------------------------------------//
   
    var AddToQuote = by.xpath('//a[text()="Get a Quote"]')
    var CreateTemplate = by.xpath('//a[text()="Create Template"]')
    var SaveProductLater = by.xpath('//a[text()="Save Product for Later"]')
    var SavedList = by.xpath("//p[text()='No Items Saved']")

    var TemplateName = by.xpath('//*[@id="templateName"]')
    var TemplateComments = by.xpath("//textarea[@name='template_comments']")
    var SaveTemplate = by.xpath('//input[@name="save_template"]')
    var SaveTemplateResults = by.xpath("//h2[text()='Your Template Has Been Created']")
    var ViewAllTemplatesBtn = by.xpath("//a[text()='View All Templates']")
    var TemplateEvidence = by.xpath("//small[text()='Use This Template for Order']")
    


    //-----------------------------------Functions-----------------------------------//

    this.clickAddToQuote = async function () {
        await GUILib.clickObject(AddToQuote)  
    }

    this.clickCreateTemplate = async function () {
        await GUILib.clickLinkWait(CreateTemplate)  
    }

    this.clickSaveProductLater = async function () {
        await GUILib.clickLinkWait(SaveProductLater)  
    }

    this.verifySaveProductLater = async function () {
        await element(SavedList).isDisplayed().then(async function (result) {
            expect(result).toBe(false);
        }) 
    }

    this.fillTemplatesFields = async function () {
        await GUILib.typeValue(TemplateName, 'test')
        await GUILib.typeValue(TemplateComments, 'test')
    }

    this.clickSaveTemplateBtn = async function () {
        await GUILib.clickLinkWait(SaveTemplate)  
    }

    this.verifySaveTemplate = async function () {
        await browser.sleep(1000)
        await element(SaveTemplateResults).isDisplayed().then(async function (result) {
            expect(result).toBe(true);
        }) 
    }

    this.clickViewAllTemplatesBtn = async function () {
        await GUILib.clickLinkWait(ViewAllTemplatesBtn)  
    }

    this.verifyYourTemplates = async function () {
        await element.all(TemplateEvidence).count().then(async function (count) {
            expect(count).toBeGreaterThan(0);
        }) 
    }







}



module.exports = new Quote;