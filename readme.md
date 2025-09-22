# Puppeteer Scraper - Download Automatizado

Este projeto utiliza o [Puppeteer](https://github.com/puppeteer/puppeteer) para automatizar a extração de links e o download de múltiplos tipos de arquivos de uma página web. O programa possui uma interface interativa que solicita a URL do usuário, permite escolher o tipo de arquivo desejado e exibe uma barra de progresso durante o download.

## Funcionalidades ✨

- 🖥️ **Interface Interativa**: Tela de apresentação e entrada de URL pelo usuário
- 📁 **Múltiplos Tipos de Arquivo**: Suporte para ZIP, PDF, imagens, MP4 e MP3
- 🎯 **Seleção Interativa**: Menu para escolher o tipo de arquivo a baixar
- 🔍 **Extração Inteligente**: Busca automática baseada no tipo selecionado
- 📊 **Barra de Progresso**: Exibe progresso em tempo real com porcentagem
- 🗂️ **Gerenciamento de Downloads**: Cria pasta automaticamente e organiza os arquivos
- ✅ **Verificação de Duplicatas**: Evita baixar arquivos já existentes
- 🔗 **URLs Inteligentes**: Converte URLs relativas para absolutas automaticamente
- 🛡️ **Validação de URL**: Verifica se a URL digitada é válida
- ✨ **Protocolo Automático**: Adiciona "https://" automaticamente se não especificado
- 🎨 **Interface Amigável**: Emojis e mensagens coloridas para melhor UX

## Tipos de Arquivo Suportados 📁

O scraper pode extrair e baixar os seguintes tipos de arquivo:

- **ZIP** - Arquivos compactados (.zip)
- **PDF** - Documentos PDF (.pdf)
- **IMG** - Imagens (JPG, PNG, GIF, WEBP, SVG)
- **MP4** - Vídeos MP4 (.mp4)
- **MP3** - Arquivos de áudio MP3 (.mp3)

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
node scrapper.js
```

### 4. Veja os downloads

Após a execução do script, os arquivos extraídos serão salvos na pasta `downloads` no mesmo diretório do projeto.

## Como usar

1. **Execute o programa**: `node scrapper.js`
2. **Digite a URL**: Insira o endereço do site (https:// será adicionado automaticamente se não informado)
3. **Escolha o tipo de arquivo**: Selecione uma opção do menu (1-5):
   - 1 - ZIP (Arquivos compactados)
   - 2 - PDF (Documentos PDF)
   - 3 - IMG (Imagens)
   - 4 - MP4 (Vídeos MP4)
   - 5 - MP3 (Arquivos de áudio MP3)
4. **Aguarde o download**: O programa fará a extração e download automaticamente

## Funcionalidades Técnicas 🔧

### Extração Inteligente
- **ZIP/PDF/MP4/MP3**: Busca em links (`<a>` tags) com as extensões correspondentes
- **Imagens**: Busca em tags `<img>` com suporte a múltiplos formatos
- **URLs Relativas**: Converte automaticamente para URLs absolutas
- **Validação**: Verifica se os links são válidos antes do download

### Gerenciamento de Downloads
- Cria pasta `downloads` automaticamente
- Evita downloads duplicados
- Suporte a nomes de arquivo especiais
- Barra de progresso em tempo real

### Compatibilidade
- **Cross-platform**: Funciona em Windows, macOS e Linux
- **Chrome/Chromium**: Detecta e usa automaticamente o navegador disponível
- **Headless**: Executa em modo background para melhor performance

## Dependências do projeto

- **puppeteer**: Biblioteca usada para automatizar o navegador
- **fs**: Módulo do Node.js para manipular o sistema de arquivos
- **https**: Módulo do Node.js para realizar requisições HTTPS
- **path**: Módulo do Node.js para trabalhar com caminhos de arquivo
- **readline**: Módulo do Node.js para interface interativa
- **os**: Módulo do Node.js para detectar o sistema operacional

## Estrutura do projeto

```bash
puppeteer-scraper/
├── downloads/         # Pasta onde os arquivos baixados serão salvos
├── scrapper.js        # Script principal com todas as funcionalidades
├── package.json       # Configurações do projeto e dependências
└── README.md          # Documentação do projeto
```

## Observações

- Certifique-se de verificar os Termos de Serviço do site antes de realizar automações
- Este projeto foi criado para fins educacionais
- Respeite os limites de taxa de download dos sites
- Alguns sites podem bloquear automação com Puppeteer
- O programa detecta automaticamente se o Chrome está instalado e usa o Chromium incluído como fallback

## Licença

Este projeto está licenciado sob a MIT License.
