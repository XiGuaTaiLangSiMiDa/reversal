// Create global app namespace
window.app = window.app || {};

// Initialize chart
const chartElement = document.getElementById('chart');
const chart = LightweightCharts.createChart(chartElement, {
    width: 800,
    height: 400,
    layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
    },
    grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
        borderColor: '#cccccc',
    },
    timeScale: {
        borderColor: '#cccccc',
        timeVisible: true,
    },
});

// Create candlestick series
const candlestickSeries = chart.addCandlestickSeries({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350'
});

// Expose fetchAndAnalyze globally
window.app.fetchAndAnalyze = async function() {
    try {
        const symbol = document.getElementById('tokenSelect').value;
        console.log(`Starting analysis for ${symbol}`);
        log(`Fetching data for ${symbol}...`);
        
        // Fetch kline data
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=100`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        log(`Received ${data.length} klines from Binance`);

        // Format klines data
        const klines = data.map(k => ({
            openTime: k[0],
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            volume: parseFloat(k[5]),
            closeTime: k[6]
        }));

        // Format data for chart
        const candleData = klines.map(k => ({
            time: k.openTime / 1000,
            open: k.open,
            high: k.high,
            low: k.low,
            close: k.close
        }));

        // Detect reversal points
        log('Detecting reversal points...');
        const reversalPoints = detectReversalPoints(klines);
        log(`Found ${reversalPoints.length} reversal points`);

        // Format markers
        const markers = reversalPoints.map(point => {
            const isUpward = point.type === 'upward';
            return {
                time: point.timestamp / 1000,
                position: isUpward ? 'belowBar' : 'aboveBar',
                color: isUpward ? '#2196F3' : '#FF5252',
                shape: isUpward ? 'arrowUp' : 'arrowDown',
                text: isUpward ? '↑' : '↓'
            };
        });

        // Update chart data with markers
        candlestickSeries.setData(candleData);
        candlestickSeries.setMarkers(markers);

        // Fit content
        chart.timeScale().fitContent();
        
        log('Analysis complete');
    } catch (error) {
        log(`Error: ${error.message}`, true);
        console.error('Analysis error:', error);
    }
};

// Initialize when DOM is ready
function initialize() {
    try {
        console.log('Initializing application...');
        
        // Add change event listener to token select
        document.getElementById('tokenSelect').addEventListener('change', () => {
            window.app.fetchAndAnalyze();
        });

        // Initial load
        window.app.fetchAndAnalyze();

        console.log('Initialization complete');
    } catch (error) {
        console.error('Initialization error:', error);
        log(`Initialization error: ${error.message}`, true);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Add global error handler
window.onerror = function(msg, url, line, col, error) {
    console.error('Global error:', { msg, url, line, col, error });
    log(`Global error: ${msg}`, true);
    return false;
};
