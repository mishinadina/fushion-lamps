var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var convertTimestamp = function (timestamp) {
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    } else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    } else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};

//</editor-fold>

app.controller('ScreenshotReportController', ['$scope', '$http', 'TitleService', function ($scope, $http, titleService) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    this.warningTime = 1400;
    this.dangerTime = 1900;
    this.totalDurationFormat = clientDefaults.totalDurationFormat;
    this.showTotalDurationIn = clientDefaults.showTotalDurationIn;

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
        if (initialColumnSettings.warningTime) {
            this.warningTime = initialColumnSettings.warningTime;
        }
        if (initialColumnSettings.dangerTime) {
            this.dangerTime = initialColumnSettings.dangerTime;
        }
    }


    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };
    this.hasNextScreenshot = function (index) {
        var old = index;
        return old !== this.getNextScreenshotIdx(index);
    };

    this.hasPreviousScreenshot = function (index) {
        var old = index;
        return old !== this.getPreviousScreenshotIdx(index);
    };
    this.getNextScreenshotIdx = function (index) {
        var next = index;
        var hit = false;
        while (next + 2 < this.results.length) {
            next++;
            if (this.results[next].screenShotFile && !this.results[next].pending) {
                hit = true;
                break;
            }
        }
        return hit ? next : index;
    };

    this.getPreviousScreenshotIdx = function (index) {
        var prev = index;
        var hit = false;
        while (prev > 0) {
            prev--;
            if (this.results[prev].screenShotFile && !this.results[prev].pending) {
                hit = true;
                break;
            }
        }
        return hit ? prev : index;
    };

    this.convertTimestamp = convertTimestamp;


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };

    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.totalDuration = function () {
        var sum = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.duration) {
                sum += result.duration;
            }
        }
        return sum;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };


    var results = [
    {
        "description": "Check Product Menu|Product page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 45530,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.132"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136784838,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://mc.us18.list-manage.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136785358,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://us18.list-manage.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136785359,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://list-manage.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136785359,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://list-manage.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136785359,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136786929,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136788190,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136788218,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-carabiner/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136789612,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-carabiner/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136789817,
                "type": ""
            }
        ],
        "timestamp": 1584136783677,
        "duration": 6232
    },
    {
        "description": "Add More Items by Clicking Plus Sign|Product page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 45530,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.132"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136790225,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136790226,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136792812,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136792823,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/tanning/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136794222,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/tanning/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136794814,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunless-deep-dark-8oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136795248,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunless-deep-dark-8oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136795352,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunless-deep-dark-8oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136796901,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunless-deep-dark-8oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136796911,
                "type": ""
            }
        ],
        "timestamp": 1584136789922,
        "duration": 7229
    },
    {
        "description": "Add Less Items by Clicking Minus Sign|Product page Verification",
        "passed": false,
        "pending": false,
        "os": "mac os x",
        "instanceId": 45530,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.132"
        },
        "message": [
            "Expected '10' to be greater than '9'."
        ],
        "trace": [
            "Error: Expected '10' to be greater than '9'.\n    at <Jasmine>\n    at /Users/dinamcherepanova/fruits-master/Resources/PageObjects/Product.js:151:42\n    at process._tickCallback (internal/process/next_tick.js:68:7)"
        ],
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136797445,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136797525,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136800149,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136800161,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-gel-20oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136800590,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-gel-20oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136800691,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-gel-20oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136803391,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-gel-20oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136803414,
                "type": ""
            }
        ],
        "screenShotFile": "images/0098006c-000c-00aa-0032-00c700750008.png",
        "timestamp": 1584136797156,
        "duration": 6467
    },
    {
        "description": "Fill Quantity and Check Number in Minicart|Product page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 45530,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.132"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136804350,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136804416,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136807111,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136807125,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-lotion-with-blood-orange-and-essential-oils/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136807735,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-lotion-with-blood-orange-and-essential-oils/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136807843,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-lotion-with-blood-orange-and-essential-oils/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136809879,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-lotion-with-blood-orange-and-essential-oils/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136809892,
                "type": ""
            }
        ],
        "timestamp": 1584136804058,
        "duration": 6061
    },
    {
        "description": "Fill Quantity and Check Number in Cart|Product page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 45530,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.132"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136810436,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136810442,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136813010,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136813023,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-mentha-and-essential-oils-spf-50-lotion/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136813593,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-mentha-and-essential-oils-spf-50-lotion/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136813612,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-mentha-and-essential-oils-spf-50-lotion/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136815816,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-mentha-and-essential-oils-spf-50-lotion/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136815831,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136817442,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136817475,
                "type": ""
            }
        ],
        "timestamp": 1584136810122,
        "duration": 8039
    },
    {
        "description": "Click Reviews Rating Stars|Product page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 45530,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.132"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136818499,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136818499,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136821097,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136821110,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunless-tan-med-dark-8oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136821655,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunless-tan-med-dark-8oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136821673,
                "type": ""
            }
        ],
        "timestamp": 1584136818165,
        "duration": 3998
    },
    {
        "description": "Check if Your Review is Required Field|Product page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 45530,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.132"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136822460,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136822533,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136825141,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136825154,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-clear-gel-20oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136826740,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-clear-gel-20oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136826754,
                "type": ""
            }
        ],
        "timestamp": 1584136822166,
        "duration": 4804
    },
    {
        "description": "Check if Name is Required Field|Product page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 45530,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.132"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136827283,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136827284,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136829858,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136829871,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-clear-gel-20oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136830434,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-clear-gel-20oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136830452,
                "type": ""
            }
        ],
        "timestamp": 1584136826974,
        "duration": 3684
    },
    {
        "description": "Check if Your Review is Required Field|Product page Verification",
        "passed": false,
        "pending": false,
        "os": "mac os x",
        "instanceId": 45530,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.132"
        },
        "message": [
            "ElementClickInterceptedError: element click intercepted: Element <a href=\"#tab-reviews\" class=\"nav-link p-0 mr-4\">...</a> is not clickable at point (1649, 386). Other element would receive the click: <div class=\"mc-modal-bg\" data-dojo-attach-point=\"modalOverlay\" style=\"display: block; opacity: 0.65;\"></div>\n  (Session info: chrome=80.0.3987.132)"
        ],
        "trace": [
            "error properties: Object({ remoteStacktrace: '0   chromedriver_79.0.3945.16           0x000000010314d199 chromedriver_79.0.3945.16 + 3813785\n1   chromedriver_79.0.3945.16           0x00000001030e12a3 chromedriver_79.0.3945.16 + 3371683\n2   chromedriver_79.0.3945.16           0x0000000102e61f6f chromedriver_79.0.3945.16 + 753519\n3   chromedriver_79.0.3945.16           0x0000000102dd314c chromedriver_79.0.3945.16 + 168268\n4   chromedriver_79.0.3945.16           0x0000000102dd1b68 chromedriver_79.0.3945.16 + 162664\n5   chromedriver_79.0.3945.16           0x0000000102dcfe03 chromedriver_79.0.3945.16 + 155139\n6   chromedriver_79.0.3945.16           0x0000000102dcf05e chromedriver_79.0.3945.16 + 151646\n7   chromedriver_79.0.3945.16           0x0000000102dc6866 chromedriver_79.0.3945.16 + 116838\n8   chromedriver_79.0.3945.16           0x0000000102dea942 chromedriver_79.0.3945.16 + 264514\n9   chromedriver_79.0.3945.16           0x0000000102dc65d6 chromedriver_79.0.3945.16 + 116182\n10  chromedriver_79.0.3945 ...\n    at <Jasmine>\n    at Object.throwDecodedError (/Users/dinamcherepanova/fruits-master/node_modules/selenium-webdriver/lib/error.js:550:15)\n    at parseHttpResponse (/Users/dinamcherepanova/fruits-master/node_modules/selenium-webdriver/lib/http.js:563:13)\n    at Executor.execute (/Users/dinamcherepanova/fruits-master/node_modules/selenium-webdriver/lib/http.js:489:26)\n    at <Jasmine>\n    at ElementArrayFinder.applyAction_ (/Users/dinamcherepanova/fruits-master/node_modules/protractor/built/element.js:459:29)\n    at <Jasmine>\n    at GUILibrary.clickObject (/Users/dinamcherepanova/fruits-master/Resources/Utility/GUILibrary_await.js:72:28)\n    at Product_Form.checkEmailRequired (/Users/dinamcherepanova/fruits-master/Resources/PageObjects/Product.js:233:22)\n    at UserContext.<anonymous> (/Users/dinamcherepanova/fruits-master/Testcase/Progression/Product_Validation.js:68:23)\n    at process._tickCallback (internal/process/next_tick.js:68:7)"
        ],
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136830968,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136830969,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136833551,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/shop/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136833565,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-rose-petal-gel-6oz-tube/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136834161,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-rose-petal-gel-6oz-tube/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584136834216,
                "type": ""
            }
        ],
        "screenShotFile": "images/00c9002e-008e-00e7-00a5-004600d900c2.png",
        "timestamp": 1584136830663,
        "duration": 4703
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});

    };

    this.setTitle = function () {
        var title = $('.report-title').text();
        titleService.setTitle(title);
    };

    // is run after all test data has been prepared/loaded
    this.afterLoadingJobs = function () {
        this.sortSpecs();
        this.setTitle();
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    } else {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.afterLoadingJobs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.afterLoadingJobs();
    }

}]);

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

//formats millseconds to h m s
app.filter('timeFormat', function () {
    return function (tr, fmt) {
        if(tr == null){
            return "NaN";
        }

        switch (fmt) {
            case 'h':
                var h = tr / 1000 / 60 / 60;
                return "".concat(h.toFixed(2)).concat("h");
            case 'm':
                var m = tr / 1000 / 60;
                return "".concat(m.toFixed(2)).concat("min");
            case 's' :
                var s = tr / 1000;
                return "".concat(s.toFixed(2)).concat("s");
            case 'hm':
            case 'h:m':
                var hmMt = tr / 1000 / 60;
                var hmHr = Math.trunc(hmMt / 60);
                var hmMr = hmMt - (hmHr * 60);
                if (fmt === 'h:m') {
                    return "".concat(hmHr).concat(":").concat(hmMr < 10 ? "0" : "").concat(Math.round(hmMr));
                }
                return "".concat(hmHr).concat("h ").concat(hmMr.toFixed(2)).concat("min");
            case 'hms':
            case 'h:m:s':
                var hmsS = tr / 1000;
                var hmsHr = Math.trunc(hmsS / 60 / 60);
                var hmsM = hmsS / 60;
                var hmsMr = Math.trunc(hmsM - hmsHr * 60);
                var hmsSo = hmsS - (hmsHr * 60 * 60) - (hmsMr*60);
                if (fmt === 'h:m:s') {
                    return "".concat(hmsHr).concat(":").concat(hmsMr < 10 ? "0" : "").concat(hmsMr).concat(":").concat(hmsSo < 10 ? "0" : "").concat(Math.round(hmsSo));
                }
                return "".concat(hmsHr).concat("h ").concat(hmsMr).concat("min ").concat(hmsSo.toFixed(2)).concat("s");
            case 'ms':
                var msS = tr / 1000;
                var msMr = Math.trunc(msS / 60);
                var msMs = msS - (msMr * 60);
                return "".concat(msMr).concat("min ").concat(msMs.toFixed(2)).concat("s");
        }

        return tr;
    };
});


function PbrStackModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;
    ctrl.convertTimestamp = convertTimestamp;
    ctrl.isValueAnArray = isValueAnArray;
    ctrl.toggleSmartStackTraceHighlight = function () {
        var inv = !ctrl.rootScope.showSmartStackTraceHighlight;
        ctrl.rootScope.showSmartStackTraceHighlight = inv;
    };
    ctrl.applySmartHighlight = function (line) {
        if ($rootScope.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return '';
    };
}


app.component('pbrStackModal', {
    templateUrl: "pbr-stack-modal.html",
    bindings: {
        index: '=',
        data: '='
    },
    controller: PbrStackModalController
});

function PbrScreenshotModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;

    /**
     * Updates which modal is selected.
     */
    this.updateSelectedModal = function (event, index) {
        var key = event.key; //try to use non-deprecated key first https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
        if (key == null) {
            var keyMap = {
                37: 'ArrowLeft',
                39: 'ArrowRight'
            };
            key = keyMap[event.keyCode]; //fallback to keycode
        }
        if (key === "ArrowLeft" && this.hasPrevious) {
            this.showHideModal(index, this.previous);
        } else if (key === "ArrowRight" && this.hasNext) {
            this.showHideModal(index, this.next);
        }
    };

    /**
     * Hides the modal with the #oldIndex and shows the modal with the #newIndex.
     */
    this.showHideModal = function (oldIndex, newIndex) {
        const modalName = '#imageModal';
        $(modalName + oldIndex).modal("hide");
        $(modalName + newIndex).modal("show");
    };

}

app.component('pbrScreenshotModal', {
    templateUrl: "pbr-screenshot-modal.html",
    bindings: {
        index: '=',
        data: '=',
        next: '=',
        previous: '=',
        hasNext: '=',
        hasPrevious: '='
    },
    controller: PbrScreenshotModalController
});

app.factory('TitleService', ['$document', function ($document) {
    return {
        setTitle: function (title) {
            $document[0].title = title;
        }
    };
}]);


app.run(
    function ($rootScope, $templateCache) {
        //make sure this option is on by default
        $rootScope.showSmartStackTraceHighlight = true;
        
  $templateCache.put('pbr-screenshot-modal.html',
    '<div class="modal" id="imageModal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="imageModalLabel{{$ctrl.index}}" ng-keydown="$ctrl.updateSelectedModal($event,$ctrl.index)">\n' +
    '    <div class="modal-dialog modal-lg m-screenhot-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="imageModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="imageModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <img class="screenshotImage" ng-src="{{$ctrl.data.screenShotFile}}">\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <div class="pull-left">\n' +
    '                    <button ng-disabled="!$ctrl.hasPrevious" class="btn btn-default btn-previous" data-dismiss="modal"\n' +
    '                            data-toggle="modal" data-target="#imageModal{{$ctrl.previous}}">\n' +
    '                        Prev\n' +
    '                    </button>\n' +
    '                    <button ng-disabled="!$ctrl.hasNext" class="btn btn-default btn-next"\n' +
    '                            data-dismiss="modal" data-toggle="modal"\n' +
    '                            data-target="#imageModal{{$ctrl.next}}">\n' +
    '                        Next\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" href="{{$ctrl.data.screenShotFile}}" target="_blank">\n' +
    '                    Open Image in New Tab\n' +
    '                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>\n' +
    '                </a>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

  $templateCache.put('pbr-stack-modal.html',
    '<div class="modal" id="modal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="stackModalLabel{{$ctrl.index}}">\n' +
    '    <div class="modal-dialog modal-lg m-stack-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="stackModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="stackModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <div ng-if="$ctrl.data.trace.length > 0">\n' +
    '                    <div ng-if="$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer" ng-repeat="trace in $ctrl.data.trace track by $index"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                    <div ng-if="!$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in $ctrl.data.trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-if="$ctrl.data.browserLogs.length > 0">\n' +
    '                    <h5 class="modal-title">\n' +
    '                        Browser logs:\n' +
    '                    </h5>\n' +
    '                    <pre class="logContainer"><div class="browserLogItem"\n' +
    '                                                   ng-repeat="logError in $ctrl.data.browserLogs track by $index"><div><span class="label browserLogLabel label-default"\n' +
    '                                                                                                                             ng-class="{\'label-danger\': logError.level===\'SEVERE\', \'label-warning\': logError.level===\'WARNING\'}">{{logError.level}}</span><span class="label label-default">{{$ctrl.convertTimestamp(logError.timestamp)}}</span><div ng-repeat="messageLine in logError.message.split(\'\\\\n\') track by $index">{{ messageLine }}</div></div></div></pre>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <button class="btn btn-default"\n' +
    '                        ng-class="{active: $ctrl.rootScope.showSmartStackTraceHighlight}"\n' +
    '                        ng-click="$ctrl.toggleSmartStackTraceHighlight()">\n' +
    '                    <span class="glyphicon glyphicon-education black"></span> Smart Stack Trace\n' +
    '                </button>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

    });
