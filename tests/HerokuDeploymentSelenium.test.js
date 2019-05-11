var username = process.env.SAUCE_LABS_USERNAME; //replace with your Sauce Labs email address or Username 
var authkey = process.env.SAUCE_LABS_TOKEN; //replace with your own Sauce Labs authkey
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 30
const rootURL = "https://travis-ci-selenium-sauce-labs.herokuapp.com/";

var webdriver = require('selenium-webdriver'),
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,
    request = require('request');

var remoteHub = "http://" + username + ":" + authkey + "@localhost:4445/wd/hub";

var browsers = [
    { browserName: 'Chrome', platform: 'Windows 10', version: '64', screen_resolution: '1920x1080' },
    { browserName: 'Safari', platform: 'macOS 10.14', version: '12', screen_resolution: '1920x1440' },
    { browserName: 'Internet Explorer', platform: 'Windows 8.1', version: '11', screen_resolution: '1920x1080' },
    { browserName: 'Firefox', platform: 'Windows 10', version: '59', screen_resolution: '1920x1080' },
];

browsers.map(function (browser) {

    var caps = {
        name: 'Node Example',
        browserName: browser.browserName,
        version: browser.version,
        platform: browser.platform,
        screen_resolution: browser.screen_resolution,
        username: username,
        password: authkey,
        'tunnel-identifier': process.env.TUNNEL_IDENTIFIER,
    };
    it("Test Foo Bar Research Engine - " + browser.browserName, async function () {
        var driver = new webdriver.Builder()
            .usingServer(remoteHub)
            .withCapabilities(caps)
            .build();

        await driver.getSession().then(function (session) {
            var sessionId = session.id_; //need for API calls
            console.log('Session ID: ', sessionId);
            //console.log('See your test run at: https://app.crossbrowsertesting.com/selenium/' + sessionId)
        });
        
        await driver.get(rootURL);
        const element = await driver.findElement(webdriver.By.name('search'));
        await element.sendKeys('cross browser testing');
        const searchButton = await driver.findElement(webdriver.By.id('search_button'));
        await searchButton.click();
        await driver.findElement(webdriver.By.id('result'));
    });
});