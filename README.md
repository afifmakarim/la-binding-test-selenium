# LA Binding Automation Test
LA binding automation dev test using selenium

### Environment Variable
```sh

TERMINAL_ID=""
USER_KEY=""
PASSWORD=""
SIGNATURE=""

MSISDN=""
SUCCESS_URL="http://localhost/broker/wco/successUrl"
FAILED_URL="http://localhost/broker/wco/failedUrl"

# DEV BINDING URL
GENERATE_TOKEN=""
BINDING_URL=""

# SELENIUM CONFIG
PATH_TO_DRIVER="/path/to/webdriver/chromedriver"
PATH_TO_HTML="file:///path/to/wco_redirect.html"

```

### How To

```sh
make .env file using above parameter
npm install

run using:
node index.js
```
