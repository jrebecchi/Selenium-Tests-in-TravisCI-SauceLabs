
const webdriver = require('selenium-webdriver');
const { launchSeleniumTest } = require('./Utils');
const port = process.env.PORT || 80
const localURL = 'http://localhost:' + port;
const url = process.env.HEROKU_STAGING_DEPLOYMENT || localURL;


    it("End-to-end test this simple app", async function () {
        await launchSeleniumTest(async driver => {
            await driver.get(url);
            await driver.getSession().then(function (session) {
                var sessionId = session.id_; //need for API calls
                console.log('Session ID: ', sessionId);
            });
            const element = await driver.findElement(webdriver.By.name('search'));
            await element.sendKeys('cross browser testing');
            const searchButton = await driver.findElement(webdriver.By.id('search_button'));
            await searchButton.click();
            await driver.findElement(webdriver.By.id('result'));
            await driver.quit();
        });
    });


        