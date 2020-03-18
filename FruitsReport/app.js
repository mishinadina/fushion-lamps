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
        "description": "Add Products in Cart|View Cart Page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 71681,
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
                "timestamp": 1584561903339,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561904560,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/skin/face/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561907227,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/skin/face/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561908212,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-scrub-6oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561909129,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-scrub-6oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561909387,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-scrub-6oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561911753,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-scrub-6oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561911790,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/skin/face/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561913225,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/skin/face/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561913236,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-face-cleanser/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561914062,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-face-cleanser/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561914077,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-face-cleanser/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561914987,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-face-cleanser/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561914994,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/skin/face/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561915537,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/skin/face/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561915553,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-firming-facial-mask/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561916370,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-firming-facial-mask/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561916386,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-firming-facial-mask/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561917364,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-firming-facial-mask/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561917379,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/skin/face/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561917927,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/skin/face/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561917940,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-scrub-6oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561918814,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-scrub-6oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561918827,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-scrub-6oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561919808,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/vitamin-e-daily-scrub-6oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561919815,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/skin/face/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561920350,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/skin/face/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561920366,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561922405,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561922433,
                "type": ""
            }
        ],
        "timestamp": 1584561901872,
        "duration": 22456
    },
    {
        "description": "Delete Products from Cart|View Cart Page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 71681,
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
                "timestamp": 1584561924668,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561924773,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561928406,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561928457,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-8-travel-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561928913,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-8-travel-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561928928,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-8-travel-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561929879,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-8-travel-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561929892,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561930509,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561930541,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561931982,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561932001,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561933303,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561933324,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561933929,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561933952,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/block-up-sport-spf-50-cspray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561934808,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/block-up-sport-spf-50-cspray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561934824,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561935456,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561935483,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-lotion/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561936328,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-lotion/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561936343,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-lotion/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561937515,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-lotion/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561937534,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561938205,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561938244,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561939233,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561939254,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/?removed_item=1 - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561940791,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/?removed_item=1 - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561940814,
                "type": ""
            }
        ],
        "timestamp": 1584561924341,
        "duration": 16722
    },
    {
        "description": "Check Number of Item in Cart Icon after deleting Product from Cart|View Cart Page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 71681,
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
                "timestamp": 1584561941386,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561941393,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/household/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561945006,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/household/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561945047,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561945563,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561945580,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561946591,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561946604,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/household/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561947119,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/household/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561947143,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561949033,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561949048,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561949992,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561950006,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/household/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561950522,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/household/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561950545,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-hand-soap/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561951368,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-hand-soap/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561951378,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-hand-soap/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561952305,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-hand-soap/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561952318,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/household/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561952848,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/household/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561952874,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561953802,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561953815,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561954982,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/meyer-lemon-counter-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561954996,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/household/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561955550,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/household/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561955573,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561956555,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561956572,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/?removed_item=1 - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561958210,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/?removed_item=1 - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561958254,
                "type": ""
            }
        ],
        "timestamp": 1584561941067,
        "duration": 17378
    },
    {
        "description": "Check Name of deleting Item in Green Alert|View Cart Page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 71681,
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
                "timestamp": 1584561958788,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561958789,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561962439,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561962487,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-clear-gel-20oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561963149,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-clear-gel-20oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561963165,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561963452,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561963456,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561963912,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561963929,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561964972,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561964986,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561965700,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561965701,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-mist-100-pure-gel-spray-travel-size/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561967286,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-mist-100-pure-gel-spray-travel-size/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561967310,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-mist-100-pure-gel-spray-travel-size/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561968538,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-mist-100-pure-gel-spray-travel-size/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561968552,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561970538,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561970539,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-lotion-with-mentha-and-essential-oils/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561971460,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-lotion-with-mentha-and-essential-oils/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561971476,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-lotion-with-mentha-and-essential-oils/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561973318,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-lotion-with-mentha-and-essential-oils/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561973345,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561973959,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561973977,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561975024,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561975093,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/?removed_item=1 - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561976819,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/?removed_item=1 - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561976841,
                "type": ""
            }
        ],
        "timestamp": 1584561958451,
        "duration": 18550
    },
    {
        "description": "Click Undo Button from Green Alert|View Cart Page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 71681,
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
                "timestamp": 1584561977369,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561977371,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561981001,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561981045,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-gel-20oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561981551,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-gel-20oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561981575,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-gel-20oz/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561982871,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-gel-20oz/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561982887,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561983625,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561983626,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-gel-with-mentha-and-essential-oils-travel-size/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561984499,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-gel-with-mentha-and-essential-oils-travel-size/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561984515,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-gel-with-mentha-and-essential-oils-travel-size/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561985893,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/after-sun-aloe-vera-gel-with-mentha-and-essential-oils-travel-size/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561985912,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561986489,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561986490,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561987439,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561987457,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561988491,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561988498,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561989440,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561989458,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561990298,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561990314,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561991264,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/aloe-vera-gel-24-oz-bottle/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561991270,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561991902,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/after-sun/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561991919,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561993283,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561993352,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/?removed_item=1 - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561994839,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/?removed_item=1 - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561994863,
                "type": ""
            }
        ],
        "timestamp": 1584561977008,
        "duration": 20118
    },
    {
        "description": "Check Number of Items in Cart Icon after clicking Undo Button from Green Alert|View Cart Page Verification",
        "passed": true,
        "pending": false,
        "os": "mac os x",
        "instanceId": 71681,
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
                "timestamp": 1584561997472,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584561997582,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562001213,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562001259,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562001781,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562001805,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562003031,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-manuka-honey-and-essential-oils-spf-50-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562003047,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562003716,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562003736,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-8-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562004638,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-8-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562004640,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-8-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562006084,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-8-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562006094,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562006727,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562006745,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-50-travel-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562007748,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-50-travel-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562007764,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-50-travel-spray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562008780,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/sunscreen-with-blood-orange-and-essential-oils-spf-50-travel-spray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562008797,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562009389,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562009405,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/block-up-sport-spf-30-cspray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562010297,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/block-up-sport-spf-30-cspray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562010308,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/block-up-sport-spf-30-cspray/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562011334,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product/block-up-sport-spf-30-cspray/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562011349,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562011946,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/product-category/sun/sprays-lotions/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562011964,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562013184,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/ - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562013203,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/?removed_item=1 - A cookie associated with a cross-site resource at https://instagram.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562014809,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://fotedev.wpengine.com/cart/?removed_item=1 - A cookie associated with a cross-site resource at http://www.facebook.com/ was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at https://www.chromestatus.com/feature/5088147346030592 and https://www.chromestatus.com/feature/5633521622188032.",
                "timestamp": 1584562014834,
                "type": ""
            }
        ],
        "timestamp": 1584561997135,
        "duration": 19957
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
