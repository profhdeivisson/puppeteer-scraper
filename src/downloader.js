const fs = require('fs');
const https = require('https');
const path = require('path');
const { MAX_RETRIES, RETRY_DELAY, RETRY_ROUND_DELAY } = require('./constants');
const { isFileDownloaded } = require('./utils');

const downloadFile = (url, filePath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            const totalBytes = parseInt(response.headers['content-length'], 10);
            let downloadedBytes = 0;

            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const percent = ((downloadedBytes / totalBytes) * 100).toFixed(2);
                process.stdout.write(`\r📥 Baixando ${path.basename(filePath)}: ${percent}%`);
            });

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`\n✅ Download concluído: ${path.basename(filePath)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            console.error(`❌ Erro ao baixar o arquivo ${filePath}: ${err.message}`);
            reject(err);
        });
    });
};

const downloadWithRetry = async (link, fileName, filePath, retryCount = 0) => {
    try {
        await downloadFile(link, filePath);
        return true;
    } catch (err) {
        if (retryCount < MAX_RETRIES) {
            console.log(`⏳ Tentativa ${retryCount + 1}/${MAX_RETRIES} falhou para ${fileName}. Tentando novamente...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return await downloadWithRetry(link, fileName, filePath, retryCount + 1);
        } else {
            console.error(`❌ Falha definitiva após ${MAX_RETRIES} tentativas: ${fileName}`);
            return false;
        }
    }
};

const processDownloads = async (links, downloadFolder) => {
    let downloadedCount = 0;
    const failedDownloads = [];

    console.log(`\n🚀 Iniciando downloads de ${links.length} arquivo(s)...\n`);

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const fileName = link.split('/').pop() || `arquivo_${Date.now()}_${i}`;
        const filePath = path.join(downloadFolder, fileName);

        if (isFileDownloaded(filePath)) {
            console.log(`⏭️  [${i + 1}/${links.length}] Arquivo já baixado: ${fileName}`);
            continue;
        }

        console.log(`📥 [${i + 1}/${links.length}] Baixando: ${fileName}`);

        const success = await downloadWithRetry(link, fileName, filePath);

        if (success) {
            downloadedCount++;
        } else {
            failedDownloads.push({ link, fileName, filePath, index: i });
        }
    }

    return { downloadedCount, failedDownloads };
};

const processRetryRounds = async (failedDownloads) => {
    if (failedDownloads.length === 0) {
        return [];
    }

    console.log(`\n🔄 ${failedDownloads.length} arquivo(s) falharam. Iniciando sistema de retry...\n`);

    let currentFailedDownloads = [...failedDownloads];
    let retryRound = 1;

    while (currentFailedDownloads.length > 0 && retryRound <= MAX_RETRIES) {
        console.log(`\n📋 Tentativa de retry ${retryRound}/${MAX_RETRIES} para ${currentFailedDownloads.length} arquivo(s) falho(s)...`);

        const stillFailed = [];

        for (let i = 0; i < currentFailedDownloads.length; i++) {
            const { link, fileName, filePath, index } = currentFailedDownloads[i];

            console.log(`🔄 [${index + 1}] Retry ${retryRound}/${MAX_RETRIES}: ${fileName}`);

            const success = await downloadWithRetry(link, fileName, filePath, 0);

            if (!success) {
                stillFailed.push(currentFailedDownloads[i]);
            }
        }

        currentFailedDownloads = stillFailed;
        retryRound++;

        if (currentFailedDownloads.length > 0) {
            console.log(`\n⏳ ${currentFailedDownloads.length} arquivo(s) ainda falharam. Aguardando antes da próxima tentativa...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_ROUND_DELAY));
        }
    }

    return currentFailedDownloads;
};

module.exports = {
    processDownloads,
    processRetryRounds
};
