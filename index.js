const {
    showWelcomeScreen,
    getUrlFromUser,
    getDownloadTypeFromUser,
    showProgress,
    showSkipped,
    showRetry,
    showRetryRound,
    showFinalResults,
    showNoFilesFound,
    showStartingDownloads,
    showRetrySystemStarting,
    showWaitingBetweenRetries
} = require('./src/ui');

const {
    createReadlineInterface,
    isValidUrl,
    createDownloadFolder,
    isFileDownloaded,
    convertToAbsoluteUrl
} = require('./src/utils');

const {
    setupBrowser,
    closeBrowser,
    waitForContent,
    navigateToPage
} = require('./src/browser');

const {
    getExtractionFunction,
    processLinks
} = require('./src/extractor');

const {
    processDownloads,
    processRetryRounds
} = require('./src/downloader');

const { FILE_TYPE_NAMES } = require('./src/constants');

const main = async () => {
    try {
        showWelcomeScreen();

        const rl = createReadlineInterface();

        let url;
        do {
            url = await getUrlFromUser(rl);

            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
                console.log(`🔗 Protocolo adicionado automaticamente: ${url}`);
            }

            if (!isValidUrl(url)) {
                console.log('❌ URL inválida! Por favor, digite uma URL válida (ex: https://exemplo.com)');
            }
        } while (!isValidUrl(url));

        const downloadType = await getDownloadTypeFromUser(rl);

        rl.close();

        const fileTypeName = FILE_TYPE_NAMES[downloadType];
        console.log(`\n🔍 Iniciando scraping em: ${url}`);
        console.log(`📁 Tipo de arquivo selecionado: ${fileTypeName}`);
        console.log('⏳ Carregando página...\n');

        const { browser, page } = await setupBrowser();

        await navigateToPage(page, url);
        await waitForContent(page, downloadType);

        const extractFunction = getExtractionFunction(downloadType);
        let links = await extractFunction(page);

        const baseUrl = new URL(url);
        links = processLinks(links, baseUrl);

        console.log(`📊 Links de ${fileTypeName} encontrados: ${links.length}`);
        if (links.length > 0) {
            console.log('Links:', links.slice(0, 5), links.length > 5 ? '...e mais' : '');
        }

        if (links.length === 0) {
            showNoFilesFound(fileTypeName);
            await closeBrowser(browser);
            return;
        }

        const downloadFolder = createDownloadFolder('downloads');

        const { downloadedCount, failedDownloads } = await processDownloads(links, downloadFolder);

        const finalFailedFiles = await processRetryRounds(failedDownloads);

        await closeBrowser(browser);

        showFinalResults(downloadedCount, links.length, fileTypeName, finalFailedFiles);

    } catch (error) {
        console.error('💥 Erro durante a execução:', error.message);
        process.exit(1);
    }
};

main();
