const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const path = require('path');

// Função para criar a pasta de downloads
const createDownloadFolder = (folderName) => {
    const folderPath = path.join(__dirname, folderName);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Pasta criada: ${folderPath}`);
    }
    return folderPath;
};

// Função para verificar se o arquivo já foi baixado
const isFileDownloaded = (filePath) => {
    return fs.existsSync(filePath);
};

// Função para fazer o download de arquivos com barra de progresso
const downloadFile = (url, filePath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            const totalBytes = parseInt(response.headers['content-length'], 10);
            let downloadedBytes = 0;

            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const percent = ((downloadedBytes / totalBytes) * 100).toFixed(2);
                process.stdout.write(`\rBaixando ${path.basename(filePath)}: ${percent}%`);
            });

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`\nDownload concluído: ${path.basename(filePath)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => { }); // Remove o arquivo corrompido
            console.error(`Erro ao baixar o arquivo ${filePath}: ${err.message}`);
            reject(err);
        });
    });
};

(async () => {
    // Inicia o Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Acessa a página com o conteúdo
    const url = 'LINK_DO_SITE_AQUI';
    await page.goto(url);

    // Aguarda até que todos os links estejam carregados
    await page.waitForSelector('a');

    // Extrai os links dos arquivos ZIP
    const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
            .map((a) => a.href)
            .filter((href) => href.endsWith('.zip'))
    );

    console.log('Links encontrados:', links);

    if (links.length === 0) {
        console.log('Nenhum arquivo .zip encontrado para download.');
        await browser.close();
        return;
    }

    // Cria a pasta de downloads
    const downloadFolder = createDownloadFolder('downloads');

    // Faz o download de cada arquivo
    for (const link of links) {
        const fileName = link.split('/').pop(); // Extrai o nome do arquivo do link
        const filePath = path.join(downloadFolder, fileName);

        if (isFileDownloaded(filePath)) {
            console.log(`Arquivo já baixado: ${fileName}`);
            continue; // Pula o download se o arquivo já existe
        }

        try {
            await downloadFile(link, filePath);
        } catch (err) {
            console.error(`Erro ao baixar o arquivo ${fileName}:`, err);
        }
    }

    // Fecha o navegador
    await browser.close();

    console.log('\nCONCLUÍDO: Todos os downloads foram finalizados.');
})();
