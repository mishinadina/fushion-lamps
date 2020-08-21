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
        "description": "Click Logo|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983700149,
        "duration": 7515
    },
    {
        "description": "Click Account|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983708404,
        "duration": 4734
    },
    {
        "description": "Click Cart|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983713208,
        "duration": 6045
    },
    {
        "description": "Click Home Tab|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983719325,
        "duration": 5800
    },
    {
        "description": "Click Our Barands - TamCo|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://tamcogroup.com/favicon.ico - Failed to load resource: the server responded with a status of 404 (Not Found)",
                "timestamp": 1597983736994,
                "type": ""
            }
        ],
        "timestamp": 1597983725459,
        "duration": 13073
    },
    {
        "description": "Click About Us|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983738603,
        "duration": 5090
    },
    {
        "description": "Click All Products|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983743803,
        "duration": 5098
    },
    {
        "description": "Click Spec Sheets|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983749338,
        "duration": 9536
    },
    {
        "description": "Click Where To Buy|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983759057,
        "duration": 8092
    },
    {
        "description": "Click New Articles|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983767250,
        "duration": 4726
    },
    {
        "description": "Click Contact Us|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983772077,
        "duration": 4987
    },
    {
        "description": "Click Led Lamps|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983777373,
        "duration": 5014
    },
    {
        "description": "Click Led Tubes|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983782462,
        "duration": 5560
    },
    {
        "description": "Click Fluorescent Tubes|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983788099,
        "duration": 4733
    },
    {
        "description": "Click Compact Fluorescent|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983792904,
        "duration": 5795
    },
    {
        "description": "Click Incandescent|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983798792,
        "duration": 4788
    },
    {
        "description": "Click Halogen|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983803749,
        "duration": 5101
    },
    {
        "description": "Click HID Lamps|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983808993,
        "duration": 6604
    },
    {
        "description": "Click Ballast & Acc|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983815691,
        "duration": 5837
    },
    {
        "description": "Verify Tel Link opens Tel application|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983821724,
        "duration": 2497
    },
    {
        "description": "Click Footer Led Lamps|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983824311,
        "duration": 6121
    },
    {
        "description": "Click Footer Led Tubes|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983830512,
        "duration": 5835
    },
    {
        "description": "Click Footer Fluorescent Tubes|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983836666,
        "duration": 4581
    },
    {
        "description": "Click Footer Compact Fluorescent|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983841332,
        "duration": 5422
    },
    {
        "description": "Click FooterIncandescent|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983846842,
        "duration": 5956
    },
    {
        "description": "Click Footer Halogen|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983853050,
        "duration": 6287
    },
    {
        "description": "Click Footer HID Lamps|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983859467,
        "duration": 4384
    },
    {
        "description": "Click Footer Ballast & Acc|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983864016,
        "duration": 5069
    },
    {
        "description": "Click Footer Home Tab|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983869164,
        "duration": 4604
    },
    {
        "description": "Click Footer About Us|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983873879,
        "duration": 4563
    },
    {
        "description": "Click Footer All Products|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983878507,
        "duration": 5917
    },
    {
        "description": "Click Footer Spec Sheets|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983884513,
        "duration": 7852
    },
    {
        "description": "Click Footer Where To Buy|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983892621,
        "duration": 7802
    },
    {
        "description": "Click Footer New Articles|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983900567,
        "duration": 4874
    },
    {
        "description": "Click Footer Contact Us|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983905625,
        "duration": 4048
    },
    {
        "description": "Click Facebook icon|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983909762,
        "duration": 9526
    },
    {
        "description": "Click Linkedin icon|Clicking on Home Page buttons",
        "passed": false,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": [
            "Expected 'https://fusion-lamps.com/' to contain 'linkedin.com/company/tamco-group'."
        ],
        "trace": [
            "Error: Expected 'https://fusion-lamps.com/' to contain 'linkedin.com/company/tamco-group'.\n    at <Jasmine>\n    at /Users/dinamcherepanova/fusion_lamps-master/Resources/Utility/GUILibrary_await.js:145:55\n    at process._tickCallback (internal/process/next_tick.js:68:7)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.linkedin.com/authwall?trk=ripf&trkInfo=AQHn2_TG5RRG4wAAAXQPQ5s4E_P0uCnmrI3vRyTKxDV1a2qqURqdYAEyMPxXhq20rwRQB0t-WYyrU09Zw2lHFuWYggMHUZ9OFe9Q3VQeeV81ov8Wtn55bGzjGSvxMvmlw7-BvW8=&originalReferer=https://fusion-lamps.com/&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Ftamco-group%2F 0 [Report Only] Refused to execute inline script because it violates the following Content Security Policy directive: \"script-src 'sha256-PyCXNcEkzRWqbiNr087fizmiBBrq9O6GGD8eV3P09Ik=' 'sha256-2SQ55Erm3CPCb+k03EpNxU9bdV3XL9TnVTriDs7INZ4=' 'sha256-S/KSPe186K/1B0JEjbIXcCdpB97krdzX05S+dHnQjUs=' platform.linkedin.com platform-akam.linkedin.com platform-ecst.linkedin.com platform-azur.linkedin.com static.licdn.com static-exp1.licdn.com static-exp2.licdn.com static-exp3.licdn.com\". Either the 'unsafe-inline' keyword, a hash ('sha256-sV9jZa797T0QWBzcU/CNd4tpBhTnh+TFdLnfjlitl28='), or a nonce ('nonce-...') is required to enable inline execution.\n",
                "timestamp": 1597983929994,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.linkedin.com/directory/api/ingraphs/gauge - Failed to load resource: the server responded with a status of 999 ()",
                "timestamp": 1597983929998,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://static-exp1.licdn.com/sc/h/a8qbwp95qwmm9qc9s66hsaya5 0:39215 Uncaught (in promise)",
                "timestamp": 1597983930002,
                "type": ""
            }
        ],
        "screenShotFile": "images/00c70094-00c9-0050-0005-008c009500c4.png",
        "timestamp": 1597983919500,
        "duration": 12291
    },
    {
        "description": "Click Footer Tamco Group Link|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983932725,
        "duration": 13372
    },
    {
        "description": "Click Footer Terms Conditions|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983946215,
        "duration": 5770
    },
    {
        "description": "Click Footer Privacy Policy|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983952085,
        "duration": 6533
    },
    {
        "description": "Click Footer Eighty Three Creative|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "WINDOWS",
        "instanceId": 69081,
        "browser": {
            "name": "chrome",
            "version": "78.0.3904.70"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://eightythreecreative.com/wp-content/themes/etc/assets/dist/img/8.png - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1597983970010,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://eightythreecreative.com/ - Access to XMLHttpRequest at 'https://eightythreecreative.bamboohr.com/jobs/embed2.php' from origin 'https://eightythreecreative.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.",
                "timestamp": 1597983970010,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://eightythreecreative.com/wp-content/themes/etc/assets/js/dependencies.js 0:31489 Uncaught",
                "timestamp": 1597983970012,
                "type": ""
            }
        ],
        "timestamp": 1597983958729,
        "duration": 10131
    },
    {
        "description": "Click Logo|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983985576,
        "duration": 5203
    },
    {
        "description": "Click Account|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983990795,
        "duration": 4170
    },
    {
        "description": "Click Cart|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983994967,
        "duration": 4839
    },
    {
        "description": "Click Home Tab|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597983999810,
        "duration": 5795
    },
    {
        "description": "Click Our Barands - TamCo|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984005611,
        "duration": 10095
    },
    {
        "description": "Click About Us|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984015710,
        "duration": 4076
    },
    {
        "description": "Click All Products|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984019791,
        "duration": 4017
    },
    {
        "description": "Click Spec Sheets|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984023812,
        "duration": 10823
    },
    {
        "description": "Click Where To Buy|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984034638,
        "duration": 6109
    },
    {
        "description": "Click New Articles|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984040752,
        "duration": 4951
    },
    {
        "description": "Click Contact Us|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984045706,
        "duration": 4479
    },
    {
        "description": "Click Led Lamps|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984050188,
        "duration": 5602
    },
    {
        "description": "Click Led Tubes|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984055794,
        "duration": 4818
    },
    {
        "description": "Click Fluorescent Tubes|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984060615,
        "duration": 6810
    },
    {
        "description": "Click Compact Fluorescent|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984067429,
        "duration": 8418
    },
    {
        "description": "Click Incandescent|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984075852,
        "duration": 3989
    },
    {
        "description": "Click Halogen|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984079846,
        "duration": 8061
    },
    {
        "description": "Click HID Lamps|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984087913,
        "duration": 3925
    },
    {
        "description": "Click Ballast & Acc|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984091844,
        "duration": 4454
    },
    {
        "description": "Verify Tel Link opens Tel application|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984096303,
        "duration": 2560
    },
    {
        "description": "Click Footer Led Lamps|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984098869,
        "duration": 6027
    },
    {
        "description": "Click Footer Led Tubes|Clicking on Home Page buttons",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "bce5efd940ad2526cba73043ad77c08c9b356bb8",
        "instanceId": 69178,
        "browser": {
            "name": "firefox",
            "version": "70.0"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "timestamp": 1597984104901,
        "duration": 5146
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
