var Request = require("request");
var fs = require('fs');

var APILibrary = function () {


	this.CallRestGet = function (baseUrl, resource) {
		var deferred = protractor.promise.defer();
		var url = baseUrl + resource;
		console.log("API get request- url: " + url);

		Request.get(
			{
				"headers": { "content-type": "application/json" },
				"url": url

			}, (error, response, body) => {
				if (error) {
					console.dir(error);
					// return console.dir(error);
					deferred.reject("failed to connect : " + error);
				}
				var returnedBody = JSON.parse(body);
				console.log("\n\n status Code is :" + response.statusCode);
				deferred.fulfill({
					statusCode: response.statusCode,
					body: returnedBody});
			});
		return deferred.promise;
	};

	//***********************PUT Method****************************

	this.CallRestPut = function (baseUrl, resource, jsonBody) {
		var deferred = protractor.promise.defer();
		var url = baseUrl + resource;
		console.log("API put request- url: " + url);

		Request.put({
			"headers": { "content-type": "application/json" },
			"url": url,
			"body": JSON.stringify(jsonBody)
		}, (error, response, body) => {
			if (error) {
				//return console.dir(error);
				deferred.reject("failed with error msg: " + error);
			}

			//console.log(response.headers);
			var returnedBody = JSON.parse(body);
			console.log("\n\n status Code is :" + response.statusCode);
			deferred.fulfill({
				statusCode: response.statusCode,
				body: returnedBody});
		});
		return deferred.promise;
	};


	//***********************POST Method*********************************************
	this.CallRestPost = function (baseUrl, resource, jsonBody) {
		var deferred = protractor.promise.defer();
		var url = baseUrl + resource;
		console.log("API post request- url: " + url);
		Request.post({
			"headers": { "content-type": "application/json" },
			"url": url,
			"body": JSON.stringify(jsonBody)
		}, (error, response, body) => {
			if (error) {
				deferred.reject("failed with error msg: " + error);

			}
			//console.log("\n\nHeader ****:")
			//console.log(response.headers)
			//var returnedBody=JSON.parse(response.body);
			//console.log("\n\n status Code is :"+response.statusCode);
			deferred.fulfill({
				statusCode: response.statusCode,
				body: body});

		});
		return deferred.promise;
	};


	//******************************************Traceability*********************

	this.logToTestSpace = function (testCaseId, appId, projectId, status, module, fullName, warnings, excTime) {	
		var object = {
			testCaseName: fullName,
			jiraID: testCaseId,
			status: status,
			module: module,
			errors: warnings,
			duration: excTime

		};
		fs.appendFileSync('Reports/results.json', JSON.stringify(object));
		fs.appendFileSync('Reports/results.json', ',');

		var deferred = protractor.promise.defer();
		var postCall = new APILibrary();
		var baseUrl = "http://testspace.ebiz.verizon.com";
		var resource = ":5050/api/v1/test-logs";
		var rightNow = new Date();
		var ISOTime = rightNow.toISOString();
		var jsonBody = {
			"status": status,
			//"filename": "SrlgIdCheck.java",
			"environment": process.env.OS,
			"technology": "JavaScript",
			"testCaseId": testCaseId,
			"projectId": projectId,
			"epicId": "NA",
			"epicSummary": "NA",
			//"storyId": "UIAM-8580",
			//"storyName": "NA",
			"appId": appId,
			"module": module,
			"executedEnv": process.env.ENVIRONMENT,
			"buildId": process.env.BUILD_NUMBER,
			"buildName": process.env.JOB_NAME,
			//				"executedEnv":"SIT",
			//				"buildId":"76",
			//				"buildName":"NTS.TCEV.VES.SOM.SIT.XO_PROTRACTOR"
			"tcExecutionTime": ISOTime //ISO date
		};
		if (process.env.JOB_NAME != null && process.env.BUILD_NUMBER != null) {
			postCall.CallRestPost(baseUrl, resource, jsonBody)
				.then(function (result) {
					//console.log(result);
					if (result.statusCode == 200) {
						deferred.fulfill('successfully logged ' + testCaseId + ' to Traceability');
					}
					else if (result.statusCode == 500) {
						console.log(result);
						deferred.fulfill('FAILED logging ' + testCaseId + ' to Traceability ');
					}
					else {
						console.log(result);
						deferred.reject('FAILED logging ' + testCaseId + ' to Traceability ');

					}

				});
		}
		return deferred.promise;
	};

	// has array key helper 
	this.matchItToName = function (itName) {
		for (var key in globalTestArray.TestCases) {
			if (key.includes('data_provider')){
				if(globalTestArray.TestCases[key][itName]){					
					return globalTestArray.TestCases[key][itName];
				}
				
			}
			else{				
			}
		}
	}
};
module.exports = APILibrary;