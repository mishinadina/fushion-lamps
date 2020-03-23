var browserstack = require('browserstack-local');
var HtmlReporter = require('protractor-beautiful-reporter');

var rimraf = require("rimraf");
var fs = require('fs');

var basePath = __dirname;
var path = require('path');
var downloadsPath = path.resolve(__dirname, './Downloads');


var specArray = ['Testcase/Progression/HomePage_Validation.js', 'Testcase/Progression/ShopAll_Validation.js', 'Testcase/Progression/Product_Validation.js', 'Testcase/Progression/MiniCart_Validation.js', 'Testcase/Progression/Checkout_Validation.js', 'Testcase/Progression/Checkout_Validation.js'];
//var specArray = ['Testcase/Progression/HomePage_Validation.js']
//var specArray = ['Testcase/Progression/ShopAll_Validation.js']
//var specArray = ['Testcase/Progression/Product_Validation.js']
//var specArray = ['Testcase/Progression/Checkout_Validation.js']

exports.config = {

	params: {
		URL: 'https://fotedev.wpengine.com/',
	},

	specs: specArray,

	allScriptsTimeout: 100000,
	getPageTimeout: 70000,
	jasmineNodeOpts: {
		defaultTimeoutInterval: 12000000,
		showColors: true // Use colors in the command line report.
	},

	browserstackUser: process.env.BROWSERSTACK_USERNAME || 'dinacherepanova1',
	browserstackKey: process.env.BROWSERSTACK_ACCESS_KEY || 'EYGN69dBPRyMe2kyXVh7',



	commonCapabilities: {
		project: 'Fruits',
		build: 'Fruits_Test',
		'browserstack.debug': 'true',
		name: 'Chrome_OS_test',
		os: 'OS X',
		os_version: 'Mojave',
		resolution: '1920x1080',
		'browserstack.use_w3c': 'true',
		'browserstack.local': 'false',
		'browserstack.console': 'errors',
		'browserstack.networkLogs': 'false',
		'browserstack.use_w3c': 'true',
		browserName: 'Chrome',
		chromeOptions: {
			//'args': ['incognito']
			args: ['--no-sandbox', '--test-type=browser'],
			excludeSwitches: ["disable-popup-blocking"],
			prefs: {
				'download': {
					'prompt_for_download': false,
					'directory_upgrade': true,
					'default_directory': downloadsPath
				}
			}
		},
	},



	multiCapabilities: [
		{
			project: 'Fruits',
			build: 'Fruits_Test',
			name: 'Chrome_OS_test',
			browserName: 'chrome',
			'browserstack.console': 'errors',
			'browserstack.networkLogs': 'false',
			'browserstack.debug': 'true',
			'browser_version': '78.0',
			'browserstack.local': 'false',
			'browserstack.selenium_version': '3.5.2',
		},
		{	project: 'Fruits',
			build: 'Fruits_Test',
			name: 'Firefox_OS_test',
			browserName: 'Firefox',
			'browserstack.console': 'errors',
			'browserstack.networkLogs': 'false',
			'browserstack.debug': 'true',
			'browser_version': '69.0',
			'browserstack.local': 'false',
			'browserstack.selenium_version': '3.12.0',
			'moz:firefoxOptions': {
				prefs: {
					'browser.download.folderList': 2,
					'browser.download.dir': process.cwd(),
					'services.sync.prefs.sync.browser.download.useDownloadDir': true,
					'browser.download.useDownloadDir': true,
					'browser.download.manager.alertOnEXEOpen': false,
					'browser.download.manager.closeWhenDone': true,
					'browser.download.manager.focusWhenStarting': false,
					'browser.download.manager.showWhenStarting': false,
					'browser.helperApps.alwaysAsk.force': false,
					'browser.download.manager.showAlertOnComplete': false,
					'browser.download.manager.useWindow': false,
					'browser.helperApps.neverAsk.saveToDisk': 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'browser.helperApps.neverAsk.openFile': 'application/pdf	,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'pdfjs.disabled': true,
					'network.protocol-handler.external.tel': false,
				},
			},
		}

		// ,{
		// 	build: 'Fruits_Final',
		// 	name: 'Safari_OS_final',
		// 	browserName: 'Safari',
		// 	'browserstack.safari.enablePopups' : 'true',
		// 	'browserstack.console': 'errors',
		// 	'browserstack.networkLogs': 'true',
		// 	'browserstack.debug': 'true',
		// 	'browser_version': '12.1',
		// 	'browserstack.local': 'false',
		// 	'browserstack.selenium_version': '3.141.0',
		// },
],


	beforeLaunch: async function () {

		await rimraf('./FruitsReport', async function () {
			console.log("clearing html report directory")

		})

		await fs.writeFileSync('./email.txt', ' ' + '<br>');
		await fs.appendFileSync('./email.txt', '<p><b>BUILD STATUS : <font color="blue">ABORTED</b></font></p>');

	},

	onPrepare: async function () {
		// 	console.log('on prepare');
		// 	browser.driver.manage().window().maximize();
		browser.ignoreSynchronization = true;
		browser.waitForAngularEnabled(false);
		browser.getBrowserName = function () {
			return browser.getCapabilities().then(function (caps) {
				browser.browserName = caps.get('browserName');
			})
		}
		// resolve the promised so the browser name is obtained.
		browser.getBrowserName();
		// 	global.requireUtil = function (relativePath) {
		// 		return require(basePath + relativePath);
		// 	};

		// 	var testdata = require(browser.params.TestDataPath);
		// 	global.globalTestArray = testdata;


		browser.manage().deleteAllCookies();

		jasmine.getEnv().addReporter(new HtmlReporter({
			baseDirectory: './FruitsReport',
			takeScreenShotsOnlyForFailedSpecs: true,
			screenshotsSubfolder: 'images',
			jsonsSubfolder: 'jsons',
			preserveDirectory: true,
			gatherBrowserLogs: false,
			// clientDefaults: {
			// 	columnSettings: {
			// 		displayTime: true,
			// 		displayBrowser: true,
			// 		displaySessionId: true,
			// 		inlineScreenshots: true
			// 	}
			// }
			// 		// , pathBuilder: function pathBuilder(spec, descriptions, results,
			// 		// capabilities) {
			// 		// Return '<browser>/<specname>' as path for screenshots:
			// 		// Example: 'firefox/list-should work'.
			// 		// return path.join(capabilities.caps_.browser, descriptions.join('-'));
			// 		// }

		}).getJasmine2Reporter());
		// 	// added custom reporter 
		// 	jasmine.getEnv().addReporter(myReporter);

	},

	onComplete: async function () {
		await fs.writeFileSync('./email.txt', ' ' + '<br>');
		var response = await fs.readFileSync('FruitsReport/combined.json', 'utf8')
		var data = await ((response.split("\\\"").join("\"")).trim()).slice(1, -1);
		data = await ((data.split("\\\\\"").join("\\\"")).trim());
		//await console.log("good looking response : " + data);
		var valuesArray = await JSON.parse(data);
		let pass = 0;
		let fail = 0;
		let pending = 0;
		let build;
		await console.log('=========================');
		await valuesArray.forEach(item => {
			if (item.passed === true) {
				pass++;
			}
			if (item.passed === false && item.pending === false) {
				fail++;
			}
			if (item.pending === true) {
				pending++;
			}
		});

		let Total = await (pass + fail + pending)
		let PassStatistic = await ((pass * 100) / Total)
		let PassStatisticFinal = await Math.round(PassStatistic);

		await console.log(pass, fail, pending)
		if (PassStatisticFinal < 80) {
			build = "FAILURE";
			await fs.appendFileSync('./email.txt', '<p><b>BUILD STATUS : <font color="red">' + build + '</b></font></p>')
		} if (PassStatisticFinal == 100) {
			build = "SUCCESS";
			await fs.appendFileSync('./email.txt', '<p><b>BUILD STATUS : <font color="green">' + build + '</b></font></p>')
		} if (PassStatisticFinal >= 80 && PassStatisticFinal < 100) {
			build = "MOSTLY SUCCESSFUL";
			await console.log(PassStatisticFinal)
			await fs.appendFileSync('./email.txt', '<p><b>BUILD STATUS : <font color="orange">' + build + '</b></font></p>')
			await fs.appendFileSync('./email.txt', '<p><b>BUILD IS SUCCESSFUL FOR :' + ' ' + PassStatisticFinal + '%' + '</b></font></p>')
		}

		var d = await Date(Date.now());
		a = d.toString()
		await fs.appendFileSync('./email.txt', ' ');
		await fs.appendFileSync('./email.txt', 'Time of build: ' + a + '<br>');
		await fs.appendFileSync('./email.txt', ' ');
		await fs.appendFileSync('./email.txt', '<table border="1" cellpadding="5">' + '\n')
		await fs.appendFileSync('./email.txt', '<tbody>' + '\n')
		await fs.appendFileSync('./email.txt', '<tr>' + '\n')
		await fs.appendFileSync('./email.txt', '<td> PASSED: </td>' + '\n')
		await fs.appendFileSync('./email.txt', '<td>' + pass + '</td>' + '\n')
		await fs.appendFileSync('./email.txt', '</tr>' + '\n')
		await fs.appendFileSync('./email.txt', '<tr>' + '\n')
		await fs.appendFileSync('./email.txt', '<td> FAILED: </td>' + '\n')
		await fs.appendFileSync('./email.txt', '<td>' + fail + '</td>' + '\n')
		await fs.appendFileSync('./email.txt', '</tr>' + '\n')
		await fs.appendFileSync('./email.txt', '<tr>' + '\n')
		await fs.appendFileSync('./email.txt', '<td> PENDING: </td>' + '\n')
		await fs.appendFileSync('./email.txt', '<td>' + pending + '</td>' + '\n')
		await fs.appendFileSync('./email.txt', '</tr>' + '\n')
		await fs.appendFileSync('./email.txt', '</tbody>' + '\n')
		await fs.appendFileSync('./email.txt', '</table>' + '\n')

		if (fail > 10) {
			await rimraf('./FruitsReport/images', async function () {
				await fs.appendFileSync('./email.txt', '<p><font color="blue">SCREENSHOTS WERE DETACHED NOT TO EXCEED EMAIL LIMITS</p></font>');
			})
		}

		await fs.writeFileSync('./jenkins.txt', '');
		await fs.appendFileSync('./jenkins.txt', 'PASSED: ' + pass + '\n')
		await fs.appendFileSync('./jenkins.txt', 'FAILED: ' + fail + '\n')
		await fs.appendFileSync('./jenkins.txt', 'PENDING: ' + pending + '\n')


	},

	afterLaunch: async function () {

	}

};
exports.config.multiCapabilities.forEach(function (caps) {
	for (var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});
