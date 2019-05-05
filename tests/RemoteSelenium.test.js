var username = 'JohannC'; //replace with your email address 
var authkey = '22e26941-27d1-4713-aa3a-cacb0fd80ae7'; //replace with your authkey  

var webdriver = require('selenium-webdriver'),
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,
    request = require('request');

var remoteHub = "http://" + username + ":" + authkey + "@localhost:4445";
var browsers = [
    { browserName: 'Chrome', platform: 'Windows 10', version: '64', screen_resolution: '1366x768' },
    //{ browserName: 'Chrome', platform: 'Mac OSX 10.14', version: '71x64', screen_resolution: '1366x768' },
    //{ browserName: 'Internet Explorer', platform: 'Windows 8.1', version: '11', screen_resolution: '1366x768' }
];

var flows = browsers.map(function (browser) {

    var caps = {
        name: 'Node Parallel Example',
        browserName: browser.browserName,
        version: browser.version,
        platform: browser.platform,
        screen_resolution: browser.screen_resolution,
        username: username,
        password: authkey
    };
    it("Simple google test", async function parallelExample() {
        try {
            var driver = new webdriver.Builder()
                .usingServer(remoteHub)
                .withCapabilities(caps)
                .build();

            await driver.getSession().then(function (session) {
                var sessionId = session.id_; //need for API calls
                console.log('Session ID: ', sessionId);
                console.log('See your test run at: https://app.crossbrowsertesting.com/selenium/' + sessionId)
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
        }
    });
});