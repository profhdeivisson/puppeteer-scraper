const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { CHROME_PATHS } = require('./constants');

const createReadlineInterface = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
};

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const createDownloadFolder = (folderName) => {
    const folderPath = path.join(__dirname, '..', folderName);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`📁 Pasta criada: ${folderPath}`);
    }
    return folderPath;
};

const isFileDownloaded = (filePath) => {
    return fs.existsSync(filePath);
};

const getChromeExecutablePath = () => {
    const platform = process.platform;

    if (!CHROME_PATHS[platform]) {
        return null;
    }

    for (const chromePath of CHROME_PATHS[platform]) {
        if (fs.existsSync(chromePath)) {
            return chromePath;
        }
    }

    return null;
};

const isChromeAvailable = () => {
    const chromePath = getChromeExecutablePath();
    return chromePath !== null;
};

const convertToAbsoluteUrl = (link, baseUrl) => {
    if (link.startsWith('http://') || link.startsWith('https://')) {
        return link;
    } else if (link.startsWith('//')) {
        return baseUrl.protocol + link;
    } else if (link.startsWith('/')) {
        return baseUrl.origin + link;
    } else {
        return baseUrl.origin + '/' + link;
    }
};

const getFileNameFromUrl = (url, index) => {
    const baseName = url.split('/').pop();
    return baseName || `arquivo_${Date.now()}_${index}`;
};

module.exports = {
    createReadlineInterface,
    isValidUrl,
    createDownloadFolder,
    isFileDownloaded,
    getChromeExecutablePath,
    isChromeAvailable,
    convertToAbsoluteUrl,
    getFileNameFromUrl
};
