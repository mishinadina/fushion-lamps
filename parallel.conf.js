var browserstack = require('browserstack-local');
var HtmlReporter = require('protractor-beautiful-reporter');
//var myReporter = require('./Reports/myReporter');
var rimraf = require("rimraf");
var fs = require('fs');

var specArray = ['Testcase/Progression/HomePage_Validation.js', 'Testcase/Progression/ContactUs_Validation.js'];
//var specArray = ['Testcase/Progression/Doors_Validation.js', 'Testcase/Progression/Windows_Validation.js', 'Testcase/Progression/Floors_Validation.js'];
//var specArray = ['Testcase/Progression/ContactUs_Validation.js'];
//var specArray = ['Testcase/Progression/Doors_Validation.js'];
//var specArray = ['Testcase/Progression/Windows_Validation.js']; 
//var specArray = ['Testcase/Progression/Floors_Validation.js'];
//var specArray = ['Testcase/Progression/Blog_Validation.js'];
//var specArray = ['Testcase/Progression/Test.js'];
//var credentials = require('./Testdata/credentials.json');

exports.config = {

  params: {
    TestDataPath: './Testdata/eASR_Test_Data.json',
    Username: 'cherdi1',
    //Password: credentials.password,
    URL: 'https://claritdevelop.wpengine.com',
  },
  
	specs: specArray,

  browserstackUser: process.env.BROWSERSTACK_USERNAME || 'dinacherepanova2',
  browserstackKey: process.env.BROWSERSTACK_ACCESS_KEY || 'WTq4xdw3GXx8bSm5yK5P',
  
  commonCapabilities: {
    build: 'protractor-browserstack',
    name: 'parallel_test',
    'browserstack.debug': 'true',
    browserName: 'Chrome'
  },

  multiCapabilities: [{
    browserName: 'Chrome'
  },{
    browserName: 'Safari'
  },{
    browserName: 'Firefox'
  },
  {
  //   browserName: 'IE'
  }],

  beforeLaunch: function () {
		//no need to do that when running locally; comment below line
		rimraf("./Reports/screenshots", function () { console.log("clearing html report directory"); });
		fs.writeFileSync('Reports/results.json', '');


	},

  onPrepare: async function () {
    console.log('on prepare');
    //browser.driver.manage().window().maximize();
    browser.ignoreSynchronization = true;
    browser.waitForAngularEnabled(false);
    //browser.get('https://claritdevelop.wpengine.com');
		// global.requireUtil = function (relativePath) {
		// 	return require(basePath + relativePath);
		// };
		//var testdata = require(browser.params.TestDataPath);
	//	global.globalTestArray = testdata;

		//old way of getting testData thur Excel
		/* var excelData = new Excel_Input();
		   excelData.fetchExcelData('dir','EASR').then(function (result) { 
		 	 global.globalTestArray = result;
		 	//console.log(result);
		 }) */

		browser.manage().deleteAllCookies();
		jasmine.getEnv().addReporter(new HtmlReporter({
			baseDirectory: './Reports/screenshots',
			screenshotsSubfolder: 'images',
			jsonsSubfolder: 'jsons',
			preserveDirectory: true,
			gatherBrowserLogs: true,
			clientDefaults: {
				columnSettings: {
					displayTime: true,
					displayBrowser: true,
					displaySessionId: true,
					inlineScreenshots: true
				}
			}
			// , pathBuilder: function pathBuilder(spec, descriptions, results,
			// capabilities) {
			// // Return '<browser>/<specname>' as path for screenshots:
			// // Example: 'firefox/list-should work'.
			// return path.join(capabilities.caps_.browser, descriptions.join('-'));
			// }

		}).getJasmine2Reporter());
		// added custom reporter 
		//jasmine.getEnv().addReporter(myReporter);
		
	},
	onComplete: function () {
		console.log('On Complete');
	},
};

exports.config.multiCapabilities.forEach(function(caps){
  for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});
