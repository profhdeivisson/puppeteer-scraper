const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const path = require('path');
const readline = require('readline');

// Função para criar interface de entrada
const createReadlineInterface = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
};

// Função para exibir tela de apresentação
const showWelcomeScreen = () => {
    console.log('\n' + '='.repeat(60));
    console.log('🤖 PUPPETEER SCRAPER - Download Automatizado');
    console.log('='.repeat(60));
    console.log('📋 Este programa irá:');
    console.log('   • Acessar uma página web');
    console.log('   • Extrair links de arquivos .zip');
    console.log('   • Fazer download automático');
    console.log('   • Mostrar progresso em tempo real');
    console.log('='.repeat(60));
};

// Função para solicitar URL do usuário
const getUrlFromUser = (rl) => {
    return new Promise((resolve) => {
        rl.question('\n🌐 Digite a URL do site para scraping: ', (url) => {
            resolve(url.trim());
        });
    });
};

// Função para validar URL
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Função para criar a pasta de downloads
const createDownloadFolder = (folderName) => {
    const folderPath = path.join(__dirname, folderName);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`📁 Pasta criada: ${folderPath}`);
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
                process.stdout.write(`\r📥 Baixando ${path.basename(filePath)}: ${percent}%`);
            });

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`\n✅ Download concluído: ${path.basename(filePath)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => { }); // Remove o arquivo corrompido
            console.error(`❌ Erro ao baixar o arquivo ${filePath}: ${err.message}`);
            reject(err);
        });
    });
};

// Função principal
const main = async () => {
    try {
        // Exibir tela de apresentação
        showWelcomeScreen();

        // Criar interface de leitura
        const rl = createReadlineInterface();

        // Solicitar URL do usuário
        let url;
        do {
            url = await getUrlFromUser(rl);

            if (!isValidUrl(url)) {
                console.log('❌ URL inválida! Por favor, digite uma URL válida (ex: https://exemplo.com)');
            }
        } while (!isValidUrl(url));

        // Fechar interface de leitura
        rl.close();

        console.log(`\n🔍 Iniciando scraping em: ${url}`);
        console.log('⏳ Carregando página...\n');

        // Inicia o Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Acessa a página com o conteúdo
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Aguarda até que todos os links estejam carregados
        await page.waitForSelector('a', { timeout: 10000 });

        // Extrai os links dos arquivos ZIP
        const links = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a'))
                .map((a) => a.href)
                .filter((href) => href.endsWith('.zip'))
        );

        console.log(`📊 Links .zip encontrados: ${links.length}`);
        console.log('Links:', links);

        if (links.length === 0) {
            console.log('📭 Nenhum arquivo .zip encontrado para download.');
            await browser.close();
            return;
        }

        // Cria a pasta de downloads
        const downloadFolder = createDownloadFolder('downloads');

        // Faz o download de cada arquivo
        let downloadedCount = 0;
        for (const link of links) {
            const fileName = link.split('/').pop(); // Extrai o nome do arquivo do link
            const filePath = path.join(downloadFolder, fileName);

            if (isFileDownloaded(filePath)) {
                console.log(`⏭️  Arquivo já baixado: ${fileName}`);
                continue; // Pula o download se o arquivo já existe
            }

            try {
                await downloadFile(link, filePath);
                downloadedCount++;
            } catch (err) {
                console.error(`❌ Erro ao baixar o arquivo ${fileName}:`, err.message);
            }
        }

        // Fecha o navegador
        await browser.close();

        console.log(`\n🎉 CONCLUÍDO: ${downloadedCount} arquivo(s) baixado(s) com sucesso!`);
        console.log(`📂 Arquivos salvos em: ${path.join(__dirname, 'downloads')}`);

    } catch (error) {
        console.error('💥 Erro durante a execução:', error.message);
        process.exit(1);
    }
};

// Executar o programa
main();
