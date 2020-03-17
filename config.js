var HtmlReporter = require('protractor-beautiful-reporter');
var rimraf = require("rimraf");
var fs = require('fs');

var basePath = __dirname;
var path = require('path');
var downloadsPath = path.resolve(__dirname, './Downloads');



//var specArray = ['Testcase/Progression/HomePage_Validation.js', 'Testcase/Progression/ShopAll_Validation.js', 'Testcase/Progression/Product_Validation.js'];
var specArray = ['Testcase/Progression/HomePage_Validation.js']
//var specArray = ['Testcase/Progression/ShopAll_Validation.js']
//var specArray = ['Testcase/Progression/Product_Validation.js']

exports.config = {
	//chromeDriver: './chromedriver.exe',
	directConnect: true,
	//seleniumAddress: 'http://localhost:4444/wd/hub',


	specs: specArray,

	//SELENIUM_PROMISE_MANAGER: false,
	/* uncomment below line and comment above, to run only the specs set as 'Yes' in the result.json file*/
	// specs: excelData.isEnabled(data),

	allScriptsTimeout: 100000,
	getPageTimeout: 70000,
	jasmineNodeOpts: {
		defaultTimeoutInterval: 600000,
		showColors: true // Use colors in the command line report.
	},

	params: {
		URL: 'https://fotedev.wpengine.com/',
	},


	//restartBrowserBetweenTests: true,
	capabilities: {
		//browserName: 'chrome',
		browserName: 'chrome',
		chromeOptions: {
			//'args': ['incognito']
			args: ['--no-sandbox', '--test-type=browser'],
			prefs: {
				'download': {
					'prompt_for_download': false,
					'directory_upgrade': true,
					'default_directory': downloadsPath
				}
			}
		},
		//  count:1,
		shardTestFiles: true,
		maxInstances: 1,
		//browserName: 'internet explorer',
		//ignoreProtectedModeSettings: true


	},

	/*	  multiCapabilities: [{
					browserName: 'internet explorer',
					'ignoreProtectedModeSettings': true
				}, {
					browserName: 'chrome'
				}],*/

	beforeLaunch: async function () {

		await rimraf('./FruitsReport', async function () {
			console.log("clearing html report directory")

		})
		await fs.writeFileSync('./email.txt', ' ' + '<br>');
		await fs.appendFileSync('./email.txt', '<p><b>BUILD STATUS : <font color="blue">ABORTED</b></font></p>')
		
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


		//browser.manage().deleteAllCookies();

		jasmine.getEnv().addReporter(new HtmlReporter({
			baseDirectory: './FruitsReport',
			takeScreenShotsOnlyForFailedSpecs: true,
			screenshotsSubfolder: 'images',
			jsonsSubfolder: 'jsons',
			//preserveDirectory: true,
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

		})
		.getJasmine2Reporter());
		// 	// added custom reporter 
		// 	jasmine.getEnv().addReporter(myReporter);

	},
	// onComplete: function () {
	// 	console.log('On Complete');
	// },

	onComplete: async function () {

		await fs.writeFileSync('./email.txt', '');

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
				await fs.appendFileSync('./email.txt', '<p>SCREENSHOTS WERE DETACHED NOT TO EXCEED EMAIL LIMITS</p>');
			})
		}

		await fs.writeFileSync('./jenkins.txt', ' ');
		await fs.appendFileSync('./jenkins.txt', 'PASSED: ' + pass + '\n')
		await fs.appendFileSync('./jenkins.txt', 'FAILED: ' + fail + '\n')
		await fs.appendFileSync('./jenkins.txt', 'PENDING: ' + pass + '\n')

	},

	afterLaunch: async function () {


	}

};
