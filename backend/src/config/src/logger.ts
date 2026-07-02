// ANSI color codes for terminal output
export const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    
    // Text colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    
    // Background colors
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
};

// Get timestamp in HH:MM:SS format
const getTimestamp = () => {
    const now = new Date();
    return `${colors.gray}[${now.toTimeString().split(' ')[0]}]${colors.reset}`;
};

// Helper functions for colorful logging with timestamps
export const log = {
    success: (msg: string) => console.log(`${getTimestamp()} ${colors.green}✓ ${msg}${colors.reset}`),
    error: (msg: string) => console.log(`${getTimestamp()} ${colors.red}✗ ${msg}${colors.reset}`),
    warning: (msg: string) => console.log(`${getTimestamp()} ${colors.yellow}⚠ ${msg}${colors.reset}`),
    info: (msg: string) => console.log(`${getTimestamp()} ${colors.cyan}ℹ ${msg}${colors.reset}`),
    debug: (msg: string) => console.log(`${getTimestamp()} ${colors.gray}${msg}${colors.reset}`),
    header: (msg: string) => console.log(`\n${colors.bright}${colors.blue}═══ ${msg} ═══${colors.reset}\n`),
    subheader: (msg: string) => console.log(`${colors.bright}${colors.cyan}─── ${msg} ───${colors.reset}`),
    api: (msg: string) => console.log(`${getTimestamp()} ${colors.cyan}🌐 ${msg}${colors.reset}`),
    database: (msg: string) => console.log(`${getTimestamp()} ${colors.magenta}💾 ${msg}${colors.reset}`),
};
