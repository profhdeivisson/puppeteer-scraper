# Puppeteer Scraper - Download Automatizado

Este projeto utiliza o [Puppeteer](https://github.com/puppeteer/puppeteer) para automatizar a extração de links e o download de arquivos `.zip` de uma página web. Ele é configurado para baixar os arquivos em uma pasta chamada `downloads` e exibir uma barra de progresso no console durante o download.

## Funcionalidades
- Extrai automaticamente links de arquivos `.zip` de uma página.
- Cria uma pasta para armazenar os downloads.
- Exibe o progresso do download no console.
- Faz uma verificação se aquele arquivo já foi baixado para caso ocorra erro durante o download, não baixar um arquivo que já foi baixado novamente.
- Mostra uma mensagem de "CONCLUÍDO" após o término de todos os downloads.

## Requisitos
Antes de começar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) (vem junto com o Node.js)

## Como executar o projeto

Siga as etapas abaixo para configurar e executar o projeto na sua máquina:

### 1. Clone o repositório

```bash
git clone https://github.com/profhdeivisson/puppeteer-scraper.git
cd puppeteer-scraper
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute o script

```bash
node scraper.js
```

### 4. Veja os downloads
Após a execução do script, os arquivos .zip extraídos serão salvos na pasta downloads no mesmo diretório do projeto.

## Configuração do script
- URL da página: Modifique a variável url para o site que deseja acessar.
- Filtro de links: Apenas links que terminam com .zip são baixados. Se precisar de outro tipo de arquivo, ajuste o filtro no trecho:

```bash
.filter((href) => href.endsWith('.zip'))
```

## Dependências do projeto
- puppeteer: Biblioteca usada para automatizar o navegador.
- fs: Módulo do Node.js para manipular o sistema de arquivos.
- https: Módulo do Node.js para realizar requisições HTTPS.

## Estrutura do projeto

```bash
puppeteer-scraper/
├── downloads/         # Pasta onde os arquivos baixados serão salvos
├── scraper.js         # Script principal
├── package.json       # Configurações do projeto e dependências
└── README.md          # Documentação do projeto
```

## Observações
- Certifique-se de verificar os Termos de Serviço do site antes de realizar automações.
- Este projeto foi criado para fins educacionais.

## Licença
Este projeto está licenciado sob a MIT License.