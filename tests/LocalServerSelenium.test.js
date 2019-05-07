var username = 'JohannC'; //replace with your email address 
var authkey = '22e26941-27d1-4713-aa3a-cacb0fd80ae7'; //replace with your authkey
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 30


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
    it("Simple google test - "+browser.browserName, async function () {
        try {
            var driver = new webdriver.Builder()
                .usingServer(remoteHub)
                .withCapabilities(caps)
                .build();

            await driver.getSession().then(function (session) {
                var sessionId = session.id_; //need for API calls
                console.log('Session ID: ', sessionId);
                //console.log('See your test run at: https://app.crossbrowsertesting.com/selenium/' + sessionId)
            });

            await driver.get('http://www.google.com');
            var element = await driver.findElement(webdriver.By.name('q'));
            await element.sendKeys('cross browser testing');
            await element.submit();
            await driver.getTitle().then(function (title) {
                console.log("The title is: " + title);
                if (title !== ('cross browser testing - Google Search')) {
                    throw Error('Unexpected title: ' + title);
                }
            });
            driver.quit();

        }
        catch (err) {
            console.error('Exception!\n', err.stack, '\n');
            driver.quit();
            throw err;
        }
    });
});