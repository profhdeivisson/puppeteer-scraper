const { createReadlineInterface } = require('./utils');

const showWelcomeScreen = () => {
    console.log('\n' + '='.repeat(60));
    console.log('🤖 PUPPETEER SCRAPER - Download Automatizado');
    console.log('='.repeat(60));
    console.log('📋 Este programa irá:');
    console.log('   • Acessar uma página web');
    console.log('   • Extrair links de arquivos (ZIP, PDF, imagens, etc.)');
    console.log('   • Fazer download automático com sistema de retry');
    console.log('   • Mostrar progresso em tempo real');
    console.log('   • Retentar downloads que falharam automaticamente');
    console.log('='.repeat(60));
    console.log('📁 Tipos de arquivos suportados:');
    console.log('   • ZIP - Arquivos compactados');
    console.log('   • PDF - Documentos PDF');
    console.log('   • IMG - Imagens (JPG, PNG, GIF, WEBP, SVG)');
    console.log('   • MP4 - Vídeos MP4');
    console.log('   • MP3 - Arquivos de áudio MP3');
    console.log('='.repeat(60));
};

const getUrlFromUser = (rl) => {
    return new Promise((resolve) => {
        rl.question('\n🌐 Digite a URL do site para scraping: ', (url) => {
            resolve(url.trim());
        });
    });
};

const getDownloadTypeFromUser = (rl) => {
    return new Promise((resolve) => {
        console.log('\n📁 Qual tipo de arquivo você deseja baixar?');
        console.log('   1 - ZIP (Arquivos compactados)');
        console.log('   2 - PDF (Documentos PDF)');
        console.log('   3 - IMG (Imagens - JPG, PNG, GIF, WEBP, SVG)');
        console.log('   4 - MP4 (Vídeos MP4)');
        console.log('   5 - MP3 (Arquivos de áudio MP3)');

        rl.question('\nEscolha uma opção (1-5): ', (choice) => {
            const validChoices = ['1', '2', '3', '4', '5'];
            if (validChoices.includes(choice)) {
                resolve(choice);
            } else {
                console.log('❌ Opção inválida! Escolha um número de 1 a 5.');
                resolve(getDownloadTypeFromUser(rl));
            }
        });
    });
};

const showProgress = (current, total, fileName) => {
    console.log(`📥 [${current}/${total}] Baixando: ${fileName}`);
};

const showSkipped = (current, total, fileName) => {
    console.log(`⏭️  [${current}/${total}] Arquivo já baixado: ${fileName}`);
};

const showRetry = (index, retryCount, maxRetries, fileName) => {
    console.log(`🔄 [${index}] Retry ${retryCount}/${maxRetries}: ${fileName}`);
};

const showRetryRound = (round, maxRetries, failedCount) => {
    console.log(`\n📋 Tentativa de retry ${round}/${maxRetries} para ${failedCount} arquivo(s) falho(s)...`);
};

const showFinalResults = (downloadedCount, totalFiles, fileTypeName, failedFiles) => {
    const successRate = ((downloadedCount / totalFiles) * 100).toFixed(1);

    console.log(`\n🎉 CONCLUÍDO: ${downloadedCount}/${totalFiles} arquivo(s) ${fileTypeName} baixado(s) com sucesso!`);
    console.log(`📊 Taxa de sucesso: ${successRate}%`);
    console.log(`📂 Arquivos salvos em: ${require('path').join(__dirname, '..', 'downloads')}`);

    if (failedFiles.length > 0) {
        console.log(`\n❌ ${failedFiles.length} arquivo(s) falharam definitivamente após ${require('./constants').MAX_RETRIES} tentativas:`);
        failedFiles.forEach(({ fileName }) => {
            console.log(`   • ${fileName}`);
        });
    }
};

const showNoFilesFound = (fileTypeName) => {
    console.log(`📭 Nenhum arquivo ${fileTypeName} encontrado para download.`);
};

const showStartingDownloads = (totalFiles) => {
    console.log(`\n🚀 Iniciando downloads de ${totalFiles} arquivo(s)...\n`);
};

const showRetrySystemStarting = (failedCount) => {
    console.log(`\n🔄 ${failedCount} arquivo(s) falharam. Iniciando sistema de retry...\n`);
};

const showWaitingBetweenRetries = (remainingFiles) => {
    console.log(`\n⏳ ${remainingFiles} arquivo(s) ainda falharam. Aguardando antes da próxima tentativa...`);
};

module.exports = {
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
};
