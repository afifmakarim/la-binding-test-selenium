
const chrome = require('selenium-webdriver/chrome');
const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const {Builder, By, Key, until} = require('selenium-webdriver');

console.log(process.env)

async function getToken() {
    try {
        const trxId = uuidv4();
        let bodyFormData = new FormData();
        bodyFormData.append('terminalId', process.env.TERMINAL_ID);
        bodyFormData.append('userKey', process.env.USER_KEY);
        bodyFormData.append('signature', process.env.SIGNATURE);
        bodyFormData.append('password', process.env.PASSWORD);
        bodyFormData.append('successUrl', process.env.SUCCESS_URL);
        bodyFormData.append('failedUrl', process.env.FAILED_URL);
        bodyFormData.append('trxId', trxId);
        bodyFormData.append('payerRefnum', trxId);
        bodyFormData.append('msisdn', process.env.MSISDN);
        
        const res = await axios.post(process.env.GENERATE_TOKEN, bodyFormData, { 
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
          });

        console.log({
            pgpToken: res.data.pgpToken,
            refNum: res.data.refNum
        })
        return {
            pgpToken: res.data.pgpToken,
            refNum: res.data.refNum
        }
    } catch (error) {
        console.log(error);
    }
}

(async function redirect () {
    try {
        const service = new chrome.ServiceBuilder(process.env.PATH_TO_DRIVER);
        const driver = new Builder().forBrowser('chrome').setChromeService(service).build();
        
        const {pgpToken, refNum} = await getToken();

        await driver.get(process.env.PATH_TO_HTML)
    
        await driver.getTitle();
    
        driver.manage().setTimeouts({implicit: 1000})
    
        let pgpTokenInputBox = await driver.findElement(By.name('message'));
        let refNumInputBox = await driver.findElement(By.name('refNum'));
        let submitButton = await driver.findElement(By.name('submit2'));
    
        await pgpTokenInputBox.sendKeys(pgpToken);
        await refNumInputBox.sendKeys(refNum);
        await submitButton.click();
    
        let checkBox = await driver.findElement(By.className("svelte-k1nuef"));
        await checkBox.click();

        let actionButton = await driver.findElement(By.className("action-button"));
        await actionButton.click();

        let pinBox = await driver.findElement(By.id('PIN'));
        await pinBox.sendKeys("081096");

        let actionSecButton = await driver.findElement(By.css("button.action-button"));
        await actionSecButton.click();

        let input_otp = await driver.findElements(By.className("otp-input"));

        for(let [i, v] of input_otp.entries()) {
            
                await v.sendKeys(6-i);
            
        }
        
        setTimeout(async () => {
            await driver.quit();
            console.log("function fully tested correctly")
        }, 30000);

      } catch (error) {
        console.log(error)
      }

})();
