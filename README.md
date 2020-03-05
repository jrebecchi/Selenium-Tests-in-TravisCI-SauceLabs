[![Build Status](https://travis-ci.org/jrebecchi/Selenium-Tests-in-TravisCI-SauceLabs.svg?branch=master)](https://travis-ci.org/jrebecchi/Selenium-Tests-in-TravisCI-SauceLabs)

## End-to-end test your Node.JS app with Travis-CI - using Sauce Labs & Heroku

This repo aims to give a very simple example of end-to-end tests performed on a Node.JS webapp, with a continuous integration service like Travis-CI.

End-to-end test a webapp means to perform automatic tests of your app in a web browser, with the exact same conditions as a real user.

This version uses [Sauce Labs](https://saucelabs.com) & [Heroku](https://heroku.com) to run your end-to-end tests during your Travis-CI builds. Thanks to [Sauce Labs](https://saucelabs.com) it is run on multiple web browsers (you will find the customizable list in `tests/Utils.js` line 16).

However, you will have to adapt the Travis configuration with your own [Sauce Labs](https://saucelabs.com) / [Heroku](https://heroku.com) credentials and adapt the environment variables. If you don't want to do any kind of configuration please check my other [tutorial](https://github.com/JohannC/Travis-CI-Selenium-Xvfb-E2E-Testing), where I use Xvfb & Docker instead. This one works straight out of the box, but the test suit is only run in the Chrome Web Browser.

## How does it work ?
The strategy used here to perform the end-to-end tests of your app either in your local environment or with Travis-CI, is based on the following technologies :
* Jest: the JS test framework 
* Selenium: the JS Library to perform web browser actions
* Travis-CI: the continuous integration tool
* Heroku: to deploy the app for testing purposes
* Sauce Labs: giving access to a graphical environment to Selenium

In your local environment:
* You will launch your web app locally
* In another terminal, you will execute the Jest test suit
* Jest will execute Selenium to perform the end-to-end tests
* Selenium will open the Chrome web browser and perform the tests on your local app

In your Travis-CI builds:
* Travis will first deploy your app on Heroku for staging
* Then it will launch your test suit with Jest
* Jest will execute Selenium to perform the end-to-end tests
* Selenium will communicate with Sauce Labs to have access to a graphical environment (which is not available in the Travis-CI virtual machines)
* You will see the video capture of your e2e tests on [Sauce Labs](https://saucelabs.com)

## Installation

### Install and run the end-to-end test suit on your local environment  
```bash
#Clone repo
git clone https://github.com/JohannC/Travis-CI-Selenium-Sauce-Labs-E2E-Testing.git
cd Travis-CI-Selenium-Sauce-Labs-E2E-Testing
git remote add origin https://github.com/$YOUR_USERNAME/$YOUR_REMOTE_REPO.git
#Install dependencies
npm install
#Run this minimalist app on you local environment
npm run start
```
Open another terminal and type the following:
```bash
#Launch the end-to-end test suit
npm run test
```
### Configure Travis-CI to run the end-to-end test suit

You will need to adapt the `.travis.yml` file to allow Travis-CI to run this end-to-end test suit. Indeed, it uses [Heroku](https://heroku.com) to deploy a staging version of this app. Sauce Labs will then perform the end-to-end tests on this [Heroku](https://heroku.com) deployment.
1. Create an [Heroku](https://heroku.com) account
2. Create a [Sauce Labs](https://saucelabs.com) account
<br/>**Tip:** for both services you can use your GitHub account.
3. Install the [Travis-CI Command Line tool](https://docs.travis-ci.com/user/encryption-keys/#usage)
4. Configure Heroku
<br />Encrypt your Heroku access key:
```bash
#Replace with your own Heroku access key
travis encrypt xxxxxxxx-xxxx-xxxx-xxxxxxxxx
```
This command will generate you a hash that you will copy in the `.travis.yml` file:
```yaml
#line 10
    deploy:
      provider: heroku
      app: travis-ci-selenium-sauce-labs
      api_key:
        secure: $REPLACE-WITH-YOUR-GENERATED-HASH-HERE
```
Create an app on Heroku.com where will be deployed the staging app. You will enter in the public HTTP address of your heroku deployed app in the `.travis.yml` file:
```yaml
#line 24
env:
  global:
    - HEROKU_STAGING_DEPLOYMENT=$REPLACE-WITH-YOUR-HEROKU_APP_URL
```
6. Configure Sauce Labs:
<br />Encrypt your Sauce Labs access key
```bash
#Replace with your own Sauce Labs access key
travis encrypt xxxxxxxx-xxxx-xxxx-xxxxxxxxx
```
This command will generate you a hash that you will copy in the `.travis.yml` file:
```yaml
#line 20
sauce_connect:
    username: $REPLACE-WITH-YOUR-SAUCE-LABS-USERNAME
    access_key:
      secure: $REPLACE-WITH-YOUR-GENERATED-HASH-HERE
```
Set the environment variables with your own Sauce Labs credentials:
```bash
#Replace with your own Sauce Labs access key
travis encrypt SAUCE_LABS_TOKEN=xxxxxxxx-xxxx-xxxx-xxxxxxxxx
```
This command will generate you a hash that you will copy in the `.travis.yml` file:
```yaml
#line 24
env:
  global:
    - HEROKU_STAGING_DEPLOYMENT=http://...herokuapp.com/
    - SAUCE_LABS_USERNAME=$REPLACE-WITH-YOUR-SAUCE-LABS-USERNAME
    - secure: $REPLACE-WITH-YOUR-GENERATED-HASH-HERE
```

The configuration is now finished. Commit your changes and push it to your GitHub repo. You will have your end-to-end tests running on Travis-CI.

Go check the video capture of those tests on [Sauce Labs](https://saucelabs.com).

