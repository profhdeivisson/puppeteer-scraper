const FILE_TYPES = {
    ZIP: '1',
    PDF: '2',
    IMG: '3',
    MP4: '4',
    MP3: '5'
};

const FILE_EXTENSIONS = {
    [FILE_TYPES.ZIP]: '.zip',
    [FILE_TYPES.PDF]: '.pdf',
    [FILE_TYPES.IMG]: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    [FILE_TYPES.MP4]: '.mp4',
    [FILE_TYPES.MP3]: '.mp3'
};

const FILE_TYPE_NAMES = {
    [FILE_TYPES.ZIP]: 'ZIP',
    [FILE_TYPES.PDF]: 'PDF',
    [FILE_TYPES.IMG]: 'imagens',
    [FILE_TYPES.MP4]: 'MP4',
    [FILE_TYPES.MP3]: 'MP3'
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const RETRY_ROUND_DELAY = 3000;

const CHROME_PATHS = {
    linux: [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium'
    ],
    darwin: [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium'
    ],
    win32: [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ]
};

const BROWSER_CONFIG = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
    ]
};

module.exports = {
    FILE_TYPES,
    FILE_EXTENSIONS,
    FILE_TYPE_NAMES,
    MAX_RETRIES,
    RETRY_DELAY,
    RETRY_ROUND_DELAY,
    CHROME_PATHS,
    BROWSER_CONFIG
};
