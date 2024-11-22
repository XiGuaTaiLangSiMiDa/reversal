// Global configuration
const ANALYSIS_CONFIG = {
    // Reversal detection parameters
    REVERSAL_THRESHOLD: 0.01,
    LOOKBACK_PERIOD: 3,
    FORWARD_PERIOD: 5,
    
    // Indicator parameters
    TREND: {
        ADX_PERIOD: 14,
        MACD: {
            FAST_PERIOD: 12,
            SLOW_PERIOD: 26,
            SIGNAL_PERIOD: 9
        },
        RSI_PERIOD: 14,
        STOCH_RSI_PERIOD: 14
    },
    
    MOMENTUM: {
        MOMENTUM_PERIOD: 10,
        ROC_PERIOD: 10,
        OBV_PERIOD: 20
    },
    
    VOLATILITY: {
        ATR_PERIOD: 14,
        BBANDS: {
            PERIOD: 20,
            STD_DEV: 2
        }
    },
    
    VOLUME: {
        CMF_PERIOD: 20,
        OBV_SMOOTH_PERIOD: 10
    }
};

// Initialize logging system
window.app = window.app || {};
window.app.logQueue = [];

// Queue logs until DOM is ready
function log(message, isError = false) {
    const logEntry = { message, isError, time: new Date().toLocaleTimeString() };
    
    if (document.readyState === 'loading') {
        window.app.logQueue.push(logEntry);
    } else {
        writeLog(logEntry);
    }
    console.log(message);
}

// Process log entry
function writeLog(logEntry) {
    const logDiv = document.getElementById('log');
    if (logDiv) {
        const entry = document.createElement('div');
        entry.style.color = logEntry.isError ? 'red' : 'black';
        entry.textContent = `${logEntry.time}: ${logEntry.message}`;
        logDiv.appendChild(entry);
        logDiv.scrollTop = logDiv.scrollHeight;
    }
}

// Process queued logs when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    while (window.app.logQueue.length > 0) {
        writeLog(window.app.logQueue.shift());
    }
});
