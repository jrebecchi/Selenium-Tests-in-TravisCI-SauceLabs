const webdriver = require('selenium-webdriver'),
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,
    request = require('request');
require('selenium-webdriver/chrome');
require('chromedriver')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 30

const herokuURL = "https://travis-ci-selenium-sauce-labs.herokuapp.com/";
const port = process.env.PORT || 80
const localURL = 'http://localhost:' + port;

const launchSeleniumTest = async testCallBack => {

    if (process.env.CONTINUOUS_INTEGRATION) {
        const username = process.env.SAUCE_LABS_USERNAME; //replace with your Sauce Labs email address or Username 
        const authkey = process.env.SAUCE_LABS_TOKEN; //replace with your own Sauce Labs authkey
        const remoteHub = "http://" + username + ":" + authkey + "@localhost:4445/wd/hub";

        const browsers = [
            { browserName: 'Chrome', platform: 'Windows 10', version: '64', screen_resolution: '1920x1080' },
            { browserName: 'Safari', platform: 'macOS 10.14', version: '12', screen_resolution: '1920x1440' },
            { browserName: 'Internet Explorer', platform: 'Windows 8.1', version: '11', screen_resolution: '1920x1080' },
            { browserName: 'Firefox', platform: 'Windows 10', version: '59', screen_resolution: '1920x1080' },
        ];

        browsers.map(async (browser) => {

            const caps = {
                name: 'Node Example',
                browserName: browser.browserName,
                version: browser.version,
                platform: browser.platform,
                screen_resolution: browser.screen_resolution,
                username: username,
                password: authkey,
                'tunnel-identifier': process.env.TUNNEL_IDENTIFIER,
            };

            const driver = new webdriver.Builder()
                .usingServer(remoteHub)
                .withCapabilities(caps)
                .build();
            
            await driver.get(herokuURL);
            await testCallBack(driver);
            await driver.quit();
        })
    } else {
        const driver = await new webdriver.Builder().forBrowser('chrome').build();
        await driver.get(localURL);
        await testCallBack(driver);
        driver.quit();
    }
}

module.exports = { launchSeleniumTest: launchSeleniumTest }