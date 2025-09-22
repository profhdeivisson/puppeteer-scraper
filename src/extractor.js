const { FILE_EXTENSIONS } = require('./constants');

const extractZipLinks = async (page) => {
    return await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
            .map((a) => a.href)
            .filter((href) => href.endsWith('.zip'))
    );
};

const extractPdfLinks = async (page) => {
    return await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
            .map((a) => a.href)
            .filter((href) => href.endsWith('.pdf'))
    );
};

const extractImageLinks = async (page) => {
    return await page.evaluate(() =>
        Array.from(document.querySelectorAll('img'))
            .map((img) => img.src)
            .filter((src) => src && (
                src.endsWith('.jpg') || src.endsWith('.jpeg') ||
                src.endsWith('.png') || src.endsWith('.gif') ||
                src.endsWith('.webp') || src.endsWith('.svg')
            ))
    );
};

const extractMp4Links = async (page) => {
    return await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
            .map((a) => a.href)
            .filter((href) => href.endsWith('.mp4'))
    );
};

const extractMp3Links = async (page) => {
    return await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
            .map((a) => a.href)
            .filter((href) => href.endsWith('.mp3'))
    );
};

const getExtractionFunction = (choice) => {
    const functions = {
        '1': extractZipLinks,
        '2': extractPdfLinks,
        '3': extractImageLinks,
        '4': extractMp4Links,
        '5': extractMp3Links
    };
    return functions[choice];
};

const processLinks = (links, baseUrl) => {
    return links.map(link => {
        if (link.startsWith('http://') || link.startsWith('https://')) {
            return link;
        } else if (link.startsWith('//')) {
            return baseUrl.protocol + link;
        } else if (link.startsWith('/')) {
            return baseUrl.origin + link;
        } else {
            return baseUrl.origin + '/' + link;
        }
    });
};

module.exports = {
    getExtractionFunction,
    processLinks
};
