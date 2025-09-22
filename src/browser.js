const puppeteer = require('puppeteer');
const { getChromeExecutablePath, isChromeAvailable } = require('./utils');
const { BROWSER_CONFIG } = require('./constants');

const setupBrowser = async () => {
    if (!isChromeAvailable()) {
        console.log('⚠️  AVISO: Chrome não encontrado no sistema!');
        console.log('📋 O programa tentará usar o Chromium incluído no Puppeteer.');
        console.log('   Para melhor compatibilidade, instale o Google Chrome:');
        console.log('   • Windows: https://www.google.com/chrome/');
        console.log('   • macOS: https://www.google.com/chrome/');
        console.log('   • Linux: sudo apt install google-chrome-stable (Ubuntu/Debian)');
        console.log('');
    }

    const browserConfig = { ...BROWSER_CONFIG };

    const chromePath = getChromeExecutablePath();
    if (chromePath) {
        browserConfig.executablePath = chromePath;
        console.log(`✅ Usando Chrome em: ${chromePath}`);
    } else {
        console.log('✅ Usando Chromium incluído no Puppeteer');
    }

    const browser = await puppeteer.launch(browserConfig);
    const page = await browser.newPage();

    return { browser, page };
};

const closeBrowser = async (browser) => {
    await browser.close();
};

const waitForContent = async (page, downloadType) => {
    if (downloadType === '3') {
        await page.waitForSelector('img', { timeout: 10000 });
    } else {
        await page.waitForSelector('a', { timeout: 10000 });
    }
};

const navigateToPage = async (page, url) => {
    await page.goto(url, { waitUntil: 'networkidle2' });
};

module.exports = {
    setupBrowser,
    closeBrowser,
    waitForContent,
    navigateToPage
};
