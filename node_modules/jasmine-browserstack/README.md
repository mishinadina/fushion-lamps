## Automatic browser testing with Jasmine and BrowserStack

This Jasmine reporter allows you to run your unit tests automatically on one or multiple BrowserStack instances.

## Installation

    $ npm install jasmine-browserstack

## Usage

Include the reporter in your HTML test page. The reporter can be used in addition to any other reporter, so your tests will continue to work as expected locally.

    <script src="node_modules/jasmine-browserstack/lib/jasmine-browserstack.js"></script>

And then add it to your Jasmine reporters:

    env.addReporter(new jasmine.BrowserStackReporter());

## License

The jasmine-browserstack code is licensed under the three-clause BSD license.
