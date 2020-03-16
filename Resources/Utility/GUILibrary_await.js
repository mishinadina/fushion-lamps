var fs = require('fs');
var ExpectedConditions = require('protractor');


var GUILibrary = function () {

	//http://www.protractortest.org/#/api

	var EC = protractor.ExpectedConditions;
	var EC_TIMEOUT = 20000;
	var EC_Error_msg = "Could not find element: ";

	this.goToURL = async function (URL) {
		await browser.manage().deleteAllCookies();
		await browser.manage().window().maximize();
		await browser.get(URL);

	};

	this.refreshAngular = async function (timeout) {
		await browser.refresh(timeout).then(function () {
			console.log("refreshed page")
		})
	};

	this.goToURL_nonAngular = async function (URL) {
		await browser.manage().deleteAllCookies();
		await browser.driver.manage().window().maximize();
		await browser.executeScript("document.body.style.zoom='100%';");
		await browser.driver.get(URL).then(function (btnG) {
			//console.log("Logged In");
		})
	}

	this.getPageTitle = async function () {
		return browser.getTitle();
	};

	this.getPageURL = function () {
		return browser.getCurrentUrl();
	};

	this.getPageSource = function () {
		return browser.getPageSource();
	};

	this.acceptAlert = async function () {
		await browser.switchTo().alert().accept().then(function () {
			console.log("Accepted Alert");
		});
	};

	this.AngularEnabled = function (text) {
		return browser.waitForAngularEnabled(text).then(function () {
			console.log("Angular Enabled set to " + text);
		});
	};

	this.clickObject = async function (byObject, desc, index) {
		if (index != null) {
			await element.all(byObject).get(index).click().then(function () {
				if (desc != null) {
					console.log("Clicked on element- " + desc);
				}
				else {
					console.log("clicked on element- " + byObject + ' at index ' + index);
				}
			})
		}
		else (

			await element(byObject).click().then(function () {
				if (desc != null) {
					console.log("Clicked on element- " + desc);
				}
				else {
					console.log("Clicked on element- " + byObject);
				}
			})
		)
	};


	this.typeValue = async function (byObject, textToWrite) {
		await element(byObject).click().then(async function () {
			element(byObject).sendKeys(textToWrite);
		})

	};


	// there is an issue with the webdriver js in Clear functinality 
	// to work around doing ctrt+A and backsapce instead 
	this.clearText = async function (byObject, desc, index) {
		if (index != null) {
			await element.all(byObject).get(index).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a")).sendKeys(protractor.Key.BACK_SPACE).then(function () {
				if (desc != null) {
					console.log("cleared field- " + desc + index);
				}
				else {
					console.log("cleared field " + byObject + index);
				}
			})
		}
		else {
			await element(byObject).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a")).sendKeys(protractor.Key.BACK_SPACE).then(function () {
				if (desc != null) {
					console.log("cleared field- " + desc);
				}
				else {
					console.log("cleared field " + byObject);
				}
			})
		}
	};

	this.elementPresent = async function (byObject, desc) {
		await element(byObject).isPresent().then(function (result) {
			if (desc != null) {
				console.log("check element present " + desc + result);
				return element(byObject).isPresent();
			}
			else {
				console.log("Check of element is present " + result);
				return element(byObject).isPresent();
			}

		})
	};

	this.isDisplayed = async function (byObject, desc) {
		await element(byObject).isDisplayed().then(function (result) {
			if (desc != null) {
				console.log("check element is displayed " + desc + result);
				return element(byObject).isDisplayed();
			}
			else {
				console.log("Check of element is displayed " + result);
				return element(byObject).isDisplayed();
			}

		})
	};

	this.waitforElement = async function (byObject) {
		await browser.wait(EC.visibilityOf(element(byObject)), 30000).then(async function () {
			console.log('Element is visible')
		});
	};

	this.checkPageLoadStatus = function () {
		return browser.executeScript("return window.document.readyState ;")
	};

	this.WaitPagetoLoad = async function () {
		await browser.wait((browser.executeScript("return window.document.readyState ;") == 'complete'), 50000, 'page took too long to load').then(function () {
			console.log('Page took too long to load')
		});
	}


	this.getText = function (byObject) {
		//		browser.wait(EC.visibilityOf(element(byObject)), EC_TIMEOUT, EC_Error_msg.concat(byObject)).then(function(){
		return browser.findElement(byObject).getText();

		//			})
	};

	this.getAttribute = function (byObject, attribute) {
		return browser.findElement(byObject).getAttribute(attribute);
	};

	/*
	this.getForm = function(byObject){
        return element(byObject).getText().then(function (text) {
		    console.log(text);
		});
	};
	*/
	this.printText = function (byObject) {
		return element(byObject).getText().then(function (text) {
			console.log(text);
		});
	};

	this.delay = async function (secondsDelay) {
		await browser.sleep(secondsDelay * 1000).then(function (text) {
			console.log('delayed ' + secondsDelay + ' seconds');
		});
	};

	this.getNumElements = function (locator) {
		return element.all(locator).count();
	};

	this.scrollUp = async function () {

		await browser.executeScript('window.scrollTo(0,0);').then(function () {
			console.log('****Scrolled Up****');
		});
	};

	this.scrollDown = async function () {
		await browser.executeScript('window.scrollTo(0,document.body.scrollHeight)').then(function () {
			console.log('****Scrolled Down****');
		});
	};

	this.takeScreenShot = async function (folderName, fileName) {
		await browser.takeScreenshot().then(function (png) {
			console.log('A screenshot was taken and saved in ' + fileName);
			//path= './Reports/screenshots/'+folderName+'/'+fileName+'.png';
			//console.log(path);
			var stream = fs.createWriteStream('./Reports/tempScreenshots/' + fileName + '.png');
			stream.write(new Buffer(png, 'base64'));
			stream.end();
		})
	};

	this.selectFromDropdown = async function (byObject, optionNum) {
		if (optionNum) {
			await element.all(byObject).get(0).click();
			await element(byObject).all(by.tagName('option'))
				.then(async function (options) {
					options[optionNum].click().then(function () {
						console.log('selected option ' + optionNum + ' from dropdown ' + byObject + '');
					})
				});
		}
	};

	this.selectElement = function (byObject, index) {
		return element.all(byObject).get(index);
	};

	this.getDate = function () {
		var today = new Date();
		var dd = today.getDate();
		var month = today.toLocaleString('en-us', { month: 'long' });
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}
		today = mm + '/' + dd + '/' + yyyy;
		return today;
	};

	this.scrollToElement = async function (byObject) {
		var elmnt = element(byObject);
		await browser.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });", elmnt).then(async function () {
			await
				await console.log("Scrolled to element");
			await browser.sleep(500);
		})
		await browser.wait(EC.visibilityOf(element(byObject)), 30000);
	};

	this.getLinkText = async function (WebAddress, byObject1, byObject2, byObject3) {
		var startLink = WebAddress;
		if (byObject1 != null && byObject2 == null && byObject3 == null) {
			var text1 = await element(byObject1).getText();
			var link1 = text1.toLowerCase();
			var LastLetter = await link1.substr(-1);
			if (LastLetter == " ") {
				await console.log(link1);
				link1 = await link1.slice(0, -1);
				await console.log(link1);
			}
			var link = (startLink + link1 + '/').replace(/ /g, "-").replace(/-&/g, "-");
			return link;
		}
		if (byObject1 != null && byObject2 !== null && byObject3 == null) {
			var text1 = await element(byObject1).getText();
			var link1 = await text1.toLowerCase();
			var LastLetter = await link1.substr(-1);
			if (LastLetter == " ") {
				await console.log(link1);
				link1 = await link1.slice(0, -1);
				await console.log(link1);
			}
			var text2 = await element(byObject2).getAttribute("textContent")
			var link2 = await text2.toLowerCase();
			var LastLetter = await link2.substr(-1);
			if (LastLetter == " ") {
				link2 = await link2.slice(0, -1);
			}
			if (link1 !== "discover") {
				var link = await (startLink + link1 + '/' + link2 + '/').replace(/ /g, "-").replace(/-&-/g, "-");
			} else {
				var link = await (startLink + link2 + '/').replace(/ /g, "-").replace(/-&-/g, "-");
			}
			return link;
		}
		if (byObject1 != null && byObject2 !== null && byObject3 !== null) {
			var text1 = await element(byObject1).getText();;
			var link1 = text1.toLowerCase();
			var text2 = await element(byObject2).getAttribute("textContent")
			var link2 = text2.toLowerCase();
			var text3 = await element(byObject3).getAttribute("textContent")
			var link3 = text3.toLowerCase();
			var link = (startLink + link1 + '/' + link2 + '/' + link3 + '/').replace(/ /g, "-").replace(/-&/g, "-");
			return link;
		}
	}

	this.moveToElement = async function (byObject) {
		await browser.findElement(byObject).then(async function (result) {
			await browser.actions({ bridge: true }).move({ duration: 500, origin: result, x: 0, y: 0 }).perform();
		})
	}

	this.writeJSON = function (Product, ElementText) {
		var obj = {
			table: []
		};

		obj.table.push({ Product: Product, ElementText: ElementText});
		var json = JSON.stringify(obj);

		fs.writeFileSync('myjsonfile.json', json, 'utf8');

	}

	//Add For Loop
	//Basic function

};
module.exports = GUILibrary;