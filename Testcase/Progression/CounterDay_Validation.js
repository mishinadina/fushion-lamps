var GUILibrary = require('../../Resources/Utility/GUILibrary_await.js');
var CounterDay = require('../../Resources/PageObjects/CounterDay.js');
var Home_Page = require('../../Resources/PageObjects/HomePage.js');

var EC = protractor.ExpectedConditions;

describe('Verification <Counter Day> Module', function () {

	var GUILib = new GUILibrary();


	beforeAll(function () {
	});

	beforeEach(async function () {
		await GUILib.goToURL_nonAngular(browser.params.URL);
		await GUILib.logIn(browser.params.Username, browser.params.Password);
        await browser.sleep(1000);
        await Home_Page.clickEventCounterTab();
		
	});

	//-----------------------------------------25-50 Attendees--------------------------//

	it('Module 1. Breakfast: Click on All Products from Bundle and verify that no Error 404 appears', async function () {
        await CounterDay.clickBreakfast(1);
        await CounterDay.checkProductsPage();
    });

    it('Module 1. Breakfast: Click "Add to Cart" button without filling Bundle Info', async function () {
        await CounterDay.clickBreakfast(1);
		await CounterDay.clickAddToCart();
    });

    it('Module 1. Breakfast: Fill Bundle Info and check if it possible to use non-numeric selections for Hours and Minutes', async function () {
        await CounterDay.clickBreakfast(1);
		await CounterDay.fillNonNumericOptions();
    });

    it('Module 1. Breakfast: Fill Bundle Info with the correct Inputes, add Bundle to the Cart and verify results', async function () {
        await CounterDay.clickBreakfast(1);
		await CounterDay.addBundleCartPositive();
    });

    it('Module 1. Breakfast: Delete Bundle Items from the Cart', async function () {
        await CounterDay.clickBreakfast(1);
		await CounterDay.deleteBundleCartPositive();
    });

    it('Module 1. Breakfast: Verify that name of the "Add to Cart" button was changed after adding Bundle to the Cart', async function () {
        await CounterDay.clickBreakfast(1);
		await CounterDay.checkAddtoCartBtn();
    });

    it('Module 1. BBQ: Click on All Products from Bundle and verify that no Error 404 appears', async function () {
        await CounterDay.clickBBQ(1);
        await CounterDay.checkProductsPage();
    });

    it('Module 1. BBQ: Click "Add to Cart" button without filling Bundle Info', async function () {
        await CounterDay.clickBBQ(1);
		await CounterDay.clickAddToCart();
    });

    it('Module 1. BBQ: Fill Bundle Info and check if it possible to use non-numeric selections for Hours and Minutes', async function () {
        await CounterDay.clickBBQ(1);
		await CounterDay.fillNonNumericOptions();
    });

    it('Module 1. BBQ: Fill Bundle Info with the correct Inputes, add Bundle to the Cart and verify results', async function () {
        await CounterDay.clickBreakfast(1);
		await CounterDay.addBundleCartPositive();
    });

    it('Module 1. BBQ: Delete Bundle Items from the Cart', async function () {
        await CounterDay.clickBreakfast(1);
		await CounterDay.deleteBundleCartPositive();
    });

    it('Module 1. BBQ: Verify that name of the "Add to Cart" button was changed after adding Bundle to the Cart', async function () {
        await CounterDay.clickBBQ(1);
		await CounterDay.checkAddtoCartBtn();
    });

    it('Module 1. Lunch: Click on All Products from Bundle and verify that no Error 404 appears', async function () {
        await CounterDay.clickLunch(1);
        await CounterDay.checkProductsPage();
    });

    it('Module 1. Lunch: Click "Add to Cart" button without filling Bundle Info', async function () {
        await CounterDay.clickLunch(1);
		await CounterDay.clickAddToCart();
    });

    it('Module 1. Lunch: Fill Bundle Info and check if it possible to use non-numeric selections for Hours and Minutes', async function () {
        await CounterDay.clickLunch(1);
		await CounterDay.fillNonNumericOptions();
    });

    it('Module 1. Lunch: Fill Bundle Info with the correct Inputes, add Bundle to the Cart and verify results', async function () {
        await CounterDay.clickBreakfast(1);
		await CounterDay.addBundleCartPositive();
    });

    it('Module 1. Lunch: Delete Bundle Items from the Cart', async function () {
        await CounterDay.clickBreakfast(1);
		await CounterDay.deleteBundleCartPositive();
    });

    it('Module 1. Lunch: Verify that name of the "Add to Cart" button was changed after adding Bundle to the Cart', async function () {
        await CounterDay.clickLunch(1);
		await CounterDay.checkAddtoCartBtn();
    });

    //-----------------------------------------50-75 Attendees--------------------------//

    it('Module 2. Breakfast: Click on All Products from Bundle and verify that no Error 404 appears', async function () {
        await CounterDay.clickBreakfast(2);
        await CounterDay.checkProductsPage();
    });

    it('Module 2. Breakfast: Click "Add to Cart" button without filling Bundle Info', async function () {
        await CounterDay.clickBreakfast(2);
		await CounterDay.clickAddToCart();
    });

    it('Module 2. Breakfast: Fill Bundle Info and check if it possible to use non-numeric selections for Hours and Minutes', async function () {
        await CounterDay.clickBreakfast(2);
		await CounterDay.fillNonNumericOptions();
    });

    it('Module 2. Breakfast: Fill Bundle Info with the correct Inputes, add Bundle to the Cart and verify results', async function () {
        await CounterDay.clickBreakfast(2);
		await CounterDay.addBundleCartPositive();
    });

    it('Module 2. Breakfast: Delete Bundle Items from the Cart', async function () {
        await CounterDay.clickBreakfast(2);
		await CounterDay.deleteBundleCartPositive();
    });

    it('Module 2. Breakfast: Verify that name of the "Add to Cart" button was changed after adding Bundle to the Cart', async function () {
        await CounterDay.clickBreakfast(2);
		await CounterDay.checkAddtoCartBtn();
    });

    it('Module 2. BBQ: Click on All Products from Bundle and verify that no Error 404 appears', async function () {
        await CounterDay.clickBBQ(2);
        await CounterDay.checkProductsPage();
    });

    it('Module 2. BBQ: Click "Add to Cart" button without filling Bundle Info', async function () {
        await CounterDay.clickBBQ(2);
		await CounterDay.clickAddToCart();
    });

    it('Module 2. BBQ: Fill Bundle Info and check if it possible to use non-numeric selections for Hours and Minutes', async function () {
        await CounterDay.clickBBQ(2);
		await CounterDay.fillNonNumericOptions();
    });

    it('Module 2. BBQ: Fill Bundle Info with the correct Inputes, add Bundle to the Cart and verify results', async function () {
        await CounterDay.clickBreakfast(2);
		await CounterDay.addBundleCartPositive();
    });

    it('Module 2. BBQ: Delete Bundle Items from the Cart', async function () {
        await CounterDay.clickBreakfast(2);
		await CounterDay.deleteBundleCartPositive();
    });

    it('Module 2. BBQ: Verify that name of the "Add to Cart" button was changed after adding Bundle to the Cart', async function () {
        await CounterDay.clickBBQ(2);
		await CounterDay.checkAddtoCartBtn();
    });

    it('Module 2. Lunch: Click on All Products from Bundle and verify that no Error 404 appears', async function () {
        await CounterDay.clickLunch(2);
        await CounterDay.checkProductsPage();
    });

    it('Module 2. Lunch: Click "Add to Cart" button without filling Bundle Info', async function () {
        await CounterDay.clickLunch(2);
		await CounterDay.clickAddToCart();
    });

    it('Module 2. Lunch: Fill Bundle Info and check if it possible to use non-numeric selections for Hours and Minutes', async function () {
        await CounterDay.clickLunch(2);
		await CounterDay.fillNonNumericOptions();
    });

    it('Module 2. Lunch: Fill Bundle Info with the correct Inputes, add Bundle to the Cart and verify results', async function () {
        await CounterDay.clickBreakfast(2);
		await CounterDay.addBundleCartPositive();
    });

    it('Module 2. Lunch: Delete Bundle Items from the Cart', async function () {
        await CounterDay.clickBreakfast(2);
		await CounterDay.deleteBundleCartPositive();
    });

    it('Module 2. Lunch: Verify that name of the "Add to Cart" button was changed after adding Bundle to the Cart', async function () {
        await CounterDay.clickLunch(2);
		await CounterDay.checkAddtoCartBtn();
    });

    //-----------------------------------------75+ Attendees--------------------------//

    it('Module 3. Breakfast: Click on All Products from Bundle and verify that no Error 404 appears', async function () {
        await CounterDay.clickBreakfast(3);
        await CounterDay.checkProductsPage();
    });

    it('Module 3. Breakfast: Click "Add to Cart" button without filling Bundle Info', async function () {
        await CounterDay.clickBreakfast(3);
		await CounterDay.clickAddToCart();
    });

    it('Module 3. Breakfast: Fill Bundle Info and check if it possible to use non-numeric selections for Hours and Minutes', async function () {
        await CounterDay.clickBreakfast(3);
		await CounterDay.fillNonNumericOptions();
    });

    it('Module 3. Breakfast: Fill Bundle Info with the correct Inputes, add Bundle to the Cart and verify results', async function () {
        await CounterDay.clickBreakfast(3);
		await CounterDay.addBundleCartPositive();
    });

    it('Module 3. Breakfast: Delete Bundle Items from the Cart', async function () {
        await CounterDay.clickBreakfast(3);
		await CounterDay.deleteBundleCartPositive();
    });

    it('Module 3. Breakfast: Verify that name of the "Add to Cart" button was changed after adding Bundle to the Cart', async function () {
        await CounterDay.clickBreakfast(3);
		await CounterDay.checkAddtoCartBtn();
    });

    it('Module 3. BBQ: Click on All Products from Bundle and verify that no Error 404 appears', async function () {
        await CounterDay.clickBBQ(3);
        await CounterDay.checkProductsPage();
    });

    it('Module 3. BBQ: Click "Add to Cart" button without filling Bundle Info', async function () {
        await CounterDay.clickBBQ(3);
		await CounterDay.clickAddToCart();
    });

    it('Module 3. BBQ: Fill Bundle Info and check if it possible to use non-numeric selections for Hours and Minutes', async function () {
        await CounterDay.clickBBQ(3);
		await CounterDay.fillNonNumericOptions();
    });

    it('Module 3. BBQ: Fill Bundle Info with the correct Inputes, add Bundle to the Cart and verify results', async function () {
        await CounterDay.clickBreakfast(3);
		await CounterDay.addBundleCartPositive();
    });

    it('Module 3. BBQ: Delete Bundle Items from the Cart', async function () {
        await CounterDay.clickBreakfast(3);
		await CounterDay.deleteBundleCartPositive();
    });

    it('Module 3. BBQ: Verify that name of the "Add to Cart" button was changed after adding Bundle to the Cart', async function () {
        await CounterDay.clickBBQ(3);
		await CounterDay.checkAddtoCartBtn();
    });

    it('Module 3. Lunch: Click on All Products from Bundle and verify that no Error 404 appears', async function () {
        await CounterDay.clickLunch(3);
        await CounterDay.checkProductsPage();
    });

    it('Module 3. Lunch: Click "Add to Cart" button without filling Bundle Info', async function () {
        await CounterDay.clickLunch(3);
		await CounterDay.clickAddToCart();
    });

    it('Module 3. Lunch: Fill Bundle Info and check if it possible to use non-numeric selections for Hours and Minutes', async function () {
        await CounterDay.clickLunch(3);
		await CounterDay.fillNonNumericOptions();
    });

    it('Module 3. Lunch: Fill Bundle Info with the correct Inputes, add Bundle to the Cart and verify results', async function () {
        await CounterDay.clickBreakfast(3);
		await CounterDay.addBundleCartPositive();
    });

    it('Module 3. Lunch: Delete Bundle Items from the Cart', async function () {
        await CounterDay.clickBreakfast(3);
		await CounterDay.deleteBundleCartPositive();
    });

    it('Module 3. Lunch: Verify that name of the "Add to Cart" button was changed after adding Bundle to the Cart', async function () {
        await CounterDay.clickLunch(3);
		await CounterDay.checkAddtoCartBtn();
    });

    afterEach(function () {
		browser.sleep(500);
	});

});
