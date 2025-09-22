const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const path = require('path');
const readline = require('readline');
const os = require('os');

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
    console.log('   • Extrair links de arquivos (ZIP, PDF, imagens, etc.)');
    console.log('   • Fazer download automático');
    console.log('   • Mostrar progresso em tempo real');
    console.log('='.repeat(60));
    console.log('📁 Tipos de arquivos suportados:');
    console.log('   • ZIP - Arquivos compactados');
    console.log('   • PDF - Documentos PDF');
    console.log('   • IMG - Imagens (JPG, PNG, GIF, WEBP, SVG)');
    console.log('   • MP4 - Vídeos MP4');
    console.log('   • MP3 - Arquivos de áudio MP3');
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

// Função para obter o caminho do Chrome baseado no sistema operacional
const getChromeExecutablePath = () => {
    const platform = os.platform();
    
    switch (platform) {
        case 'linux':
            // Tenta caminhos comuns do Chrome no Linux
            const linuxPaths = [
                '/usr/bin/google-chrome',
                '/usr/bin/google-chrome-stable',
                '/usr/bin/chromium-browser',
                '/usr/bin/chromium'
            ];
            
            for (const chromePath of linuxPaths) {
                if (fs.existsSync(chromePath)) {
                    return chromePath;
                }
            }
            return null; // Deixa o Puppeteer usar o Chromium bundled
            
        case 'darwin': // macOS
            const macPaths = [
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                '/Applications/Chromium.app/Contents/MacOS/Chromium'
            ];
            
            for (const chromePath of macPaths) {
                if (fs.existsSync(chromePath)) {
                    return chromePath;
                }
            }
            return null;
            
        case 'win32': // Windows
            const windowsPaths = [
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
                process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
                process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe'
            ];
            
            for (const chromePath of windowsPaths) {
                if (fs.existsSync(chromePath)) {
                    return chromePath;
                }
            }
            return null;
            
        default:
            return null;
    }
};

// Função para verificar se o Chrome/Chromium está disponível
const isChromeAvailable = () => {
    const chromePath = getChromeExecutablePath();
    return chromePath !== null;
};

// Função para perguntar ao usuário qual tipo de arquivo baixar
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
                resolve(getDownloadTypeFromUser(rl)); // Recursão para tentar novamente
            }
        });
    });
};

// Função para extrair links de arquivos ZIP
const extractZipLinks = async (page) => {
    return await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
            .map((a) => a.href)
            .filter((href) => href.endsWith('.zip'))
    );
};

// Função para extrair links de arquivos PDF
const extractPdfLinks = async (page) => {
    return await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
            .map((a) => a.href)
            .filter((href) => href.endsWith('.pdf'))
    );
};

// Função para extrair links de imagens
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

// Função para extrair links de vídeos MP4
const extractMp4Links = async (page) => {
    return await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
            .map((a) => a.href)
            .filter((href) => href.endsWith('.mp4'))
    );
};

// Função para extrair links de arquivos MP3
const extractMp3Links = async (page) => {
    return await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
            .map((a) => a.href)
            .filter((href) => href.endsWith('.mp3'))
    );
};

// Função para obter a função de extração baseada na escolha do usuário
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

// Função para obter o nome do tipo de arquivo para mensagens
const getFileTypeName = (choice) => {
    const names = {
        '1': 'ZIP',
        '2': 'PDF',
        '3': 'imagens',
        '4': 'MP4',
        '5': 'MP3'
    };
    return names[choice];
};

// Função principal
const main = async () => {
    try {
        // Exibir tela de apresentação
        showWelcomeScreen();

        // Verificar se o Chrome está disponível
        if (!isChromeAvailable()) {
            console.log('⚠️  AVISO: Chrome não encontrado no sistema!');
            console.log('📋 O programa tentará usar o Chromium incluído no Puppeteer.');
            console.log('   Para melhor compatibilidade, instale o Google Chrome:');
            console.log('   • Windows: https://www.google.com/chrome/');
            console.log('   • macOS: https://www.google.com/chrome/');
            console.log('   • Linux: sudo apt install google-chrome-stable (Ubuntu/Debian)');
            console.log('');
        }

        // Criar interface de leitura
        const rl = createReadlineInterface();

        // Solicitar URL do usuário
        let url;
        do {
            url = await getUrlFromUser(rl);

            // Adicionar "https://" se o usuário não especificou o protocolo
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
                console.log(`🔗 Protocolo adicionado automaticamente: ${url}`);
            }

            if (!isValidUrl(url)) {
                console.log('❌ URL inválida! Por favor, digite uma URL válida (ex: https://exemplo.com)');
            }
        } while (!isValidUrl(url));

        // Perguntar qual tipo de arquivo baixar
        const downloadType = await getDownloadTypeFromUser(rl);

        // Fechar interface de leitura
        rl.close();

        const fileTypeName = getFileTypeName(downloadType);
        console.log(`\n🔍 Iniciando scraping em: ${url}`);
        console.log(`📁 Tipo de arquivo selecionado: ${fileTypeName}`);
        console.log('⏳ Carregando página...\n');

        // Inicia o Puppeteer com configuração cross-platform
        const browserConfig = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        };

        // Adiciona o caminho do Chrome se disponível
        const chromePath = getChromeExecutablePath();
        if (chromePath) {
            browserConfig.executablePath = chromePath;
            console.log(`✅ Usando Chrome em: ${chromePath}`);
        } else {
            console.log('✅ Usando Chromium incluído no Puppeteer');
        }

        const browser = await puppeteer.launch(browserConfig);
        const page = await browser.newPage();

        // Acessa a página com o conteúdo
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Aguarda até que os elementos estejam carregados
        if (downloadType === '3') {
            // Para imagens, aguardar elementos 'img'
            await page.waitForSelector('img', { timeout: 10000 });
        } else {
            // Para outros tipos, aguardar elementos 'a'
            await page.waitForSelector('a', { timeout: 10000 });
        }

        // Obter a função de extração baseada na escolha
        const extractFunction = getExtractionFunction(downloadType);
        let links = await extractFunction(page);

        // Converter URLs relativas para absolutas
        const baseUrl = new URL(url);
        links = links.map(link => {
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

        console.log(`📊 Links de ${fileTypeName} encontrados: ${links.length}`);
        if (links.length > 0) {
            console.log('Links:', links.slice(0, 5), links.length > 5 ? '...e mais' : '');
        }

        if (links.length === 0) {
            console.log(`📭 Nenhum arquivo ${fileTypeName} encontrado para download.`);
            await browser.close();
            return;
        }

        // Cria a pasta de downloads
        const downloadFolder = createDownloadFolder('downloads');

        // Faz o download de cada arquivo
        let downloadedCount = 0;
        for (const link of links) {
            const fileName = link.split('/').pop() || `arquivo_${Date.now()}`;
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

        console.log(`\n🎉 CONCLUÍDO: ${downloadedCount} arquivo(s) ${fileTypeName} baixado(s) com sucesso!`);
        console.log(`📂 Arquivos salvos em: ${path.join(__dirname, 'downloads')}`);

    } catch (error) {
        console.error('💥 Erro durante a execução:', error.message);
        process.exit(1);
    }
};

// Executar o programa
main();
