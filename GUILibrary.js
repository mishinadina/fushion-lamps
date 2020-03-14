var fs = require('fs');
var {browser, element, By, ExpectedConditions} = require('protractor');

var GUILibrary = function () {

	//http://www.protractortest.org/#/api

	var EC = ExpectedConditions;
	var EC_TIMEOUT = 20000;
	var EC_Error_msg = "Could not find element: ";

	this.goToURL = function (URL) {
		browser.manage().deleteAllCookies();
		browser.manage().window().maximize();
		browser.get(URL);
	};

	this.refreshAngular = function (timeout) {
		browser.refresh(timeout).then(function () {
			console.log("refreshed page")
		})
	};

	this.goToURL_nonAngular = function (URL) {
		browser.manage().deleteAllCookies();
		browser.driver.manage().window().maximize();
		browser.driver.get(URL).then(function (btnG) {
			//console.log("Logged In");
		})
	}

	this.getPageTitle = function () {
		return browser.getTitle();
	};

	this.getPageURL = function () {
		return browser.getCurrentUrl();
	};

	this.getPageSource = function () {
		return browser.getPageSource();
	};

	this.acceptAlert = function () {
		browser.switchTo().alert().accept().then(function () {
			console.log("Accepted Alert");
		});
	};

	this.AngularEnabled = function (text) {
		return browser.waitForAngularEnabled(text).then(function () {
			console.log("Angular Enabled set to " + text);
		});
	};


	this.clickObject = function (byObject, desc, index) {
		if (index != null) {
			element.all(byObject).get(index).click().then(function () {
				if (desc != null) {
					console.log("Clicked on element- " + desc);
				}
				else {
					console.log("clicked on element- " + byObject + ' at index ' + index);
				}
			})
		}
		else (

			element(byObject).click().then(function () {
				if (desc != null) {
					console.log("Clicked on element- " + desc);
				}
				else {
					console.log("Clicked on element- " + byObject);
				}
			})
		)
	};



	this.typeValue = function (byObject, textToWrite, desc, index) {
		if (index != null) {
			element.all(byObject).get(index).sendKeys(textToWrite).then(function () {
				if (desc != null) {
					console.log("Sent Keys- " + desc);
				}
				else {
					console.log("Sent Keys " + byObject + ' at index ' + index);
				}
			})
		}
		else (

			element(byObject).sendKeys(textToWrite).then(function () {
				if (desc != null) {
					console.log("Sent Keys- " + desc);
				}
				else {
					console.log("Sent Keys " + byObject);
				}
			})
		)
	};


	// there is an issue with the webdriver js in Clear functinality 
	// to work around doing ctrt+A and backsapce instead 
	this.clearText = function (byObject, desc, index) {
		if (index != null) {
			element.all(byObject).get(index).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a")).sendKeys(protractor.Key.BACK_SPACE).then(function () {
				if (desc != null) {
					console.log("cleared field- " + desc + index);
				}
				else {
					console.log("cleared field " + byObject + index);
				}
			})
		}
		else {
			element(byObject).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a")).sendKeys(protractor.Key.BACK_SPACE).then(function () {
				if (desc != null) {
					console.log("cleared field- " + desc);
				}
				else {
					console.log("cleared field " + byObject);
				}
			})
		}
	};

	this.elementPresent = function (byObject, desc) {
		element(byObject).isPresent().then(function (result) {
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

	this.isDisplayed = function (byObject, desc) {
		element(byObject).isDisplayed().then(function (result) {
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

	this.waitforSpinner = function (byObject) {
		browser.wait(EC.not(EC.visibilityOf(element(byObject))), 50000, 'page took too long to load').then(function () {
			console.log('page load spinner is gone ')
		}/*,function(){
		browser.refresh().then(function(){
			element(searchField).sendKeys(data+"\n").then(function() {
		        console.log("Sent Keys");
		        delay(5);
		    })
		});
	}*/);
	};

	this.checkPageLoadStatus = function () {
		return browser.executeScript("return window.document.readyState ;")
	};

	this.WaitPagetoLoad = function () {
		browser.wait((browser.executeScript("return window.document.readyState ;") == 'complete'), 50000, 'page took too long to load').then(function () {
			console.log('Page took too long to load')
		});
	}


	this.getText = function (byObject, index) {
		//		browser.wait(EC.visibilityOf(element(byObject)), EC_TIMEOUT, EC_Error_msg.concat(byObject)).then(function(){
		if (index!=null){
			return element.all(byObject).get(index).getText();
		}
		else{
			return element(byObject).getText();
		}

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

	this.delay = function (secondsDelay) {
		browser.sleep(secondsDelay * 1000).then(function (text) {
			console.log('delayed ' + secondsDelay + ' seconds');
		});
	};

	this.getNumElements = function (locator) {
		return element.all(locator).count();
	};

	this.scrollUp = function () {

		browser.executeScript('window.scrollTo(0,0);').then(function () {
			console.log('****Scrolled Up****');
		});
	};

	this.scrollDown = function () {
		browser.executeScript('window.scrollTo(0,document.body.scrollHeight)').then(function () {
			console.log('****Scrolled Down****');
		});
	};

	this.takeScreenShot = function (folderName, fileName) {
		browser.takeScreenshot().then(function (png) {
			console.log('A screenshot was taken and saved in ' + fileName);
			//path= './Reports/screenshots/'+folderName+'/'+fileName+'.png';
			//console.log(path);
			var stream = fs.createWriteStream('./Reports/tempScreenshots/' + fileName + '.png');
			stream.write(new Buffer(png, 'base64'));
			stream.end();
		})
	};

	this.selectFromDropdown = function (byObject, optionNum) {
		if (optionNum) {
			element.all(byObject).get(0).click();
			element(byObject).all(by.tagName('option'))
				.then(function (options) {
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
		today = dd + '/' + mm + '/' + yyyy;
		return today;
	};

	this.scrollToElement = function (byObject) {
		element(byObject).getLocation().then(function (location) {
			var x = Math.round(location.x);
			var y = Math.round(location.y);
			browser.executeScript('window.scrollTo(arguments[0],arguments[1]);', x, y).then(function () {
				console.log('Scrolled to Element ' + byObject);
			});
		})
	};

	//Add For Loop
	//Basic function

};
module.exports = GUILibrary;