class ChartManager {
    constructor() {
        if (!document.getElementById('chart')) {
            throw new Error('Chart element not found');
        }
        
        this.widget = new TradingView.widget({
            container: 'chart',
            autosize: true,
            symbol: 'BINANCE:BTCUSDT',
            interval: '60',
            timezone: 'Etc/UTC',
            theme: 'Light',
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: false,
            studies: [],
            drawings: [],
            disabled_features: [
                'header_symbol_search',
                'header_settings',
                'header_compare',
                'header_undo_redo',
                'header_screenshot',
                'use_localstorage_for_settings',
                'show_logo_on_all_charts',
                'caption_buttons_text_if_possible',
                'header_indicators',
                'header_chart_type',
                'header_resolutions',
                'timeframes_toolbar',
                'volume_force_overlay',
                'header_fullscreen_button'
            ],
            enabled_features: [],
            charts_storage_url: 'https://saveload.tradingview.com',
            client_id: 'tradingview.com',
            user_id: 'public_user',
            fullscreen: false,
            width: '100%',
            height: '600',
            library_path: 'https://s3.tradingview.com/tv.js',
            custom_css_url: '',
            loading_screen: { backgroundColor: "#ffffff" }
        });

        this.ready = false;
        this.widget.onChartReady(() => {
            console.log('Chart is ready');
            this.ready = true;
            this.chart = this.widget.chart();
            this.drawQueuedPoints();
        });

        this.queuedPoints = null;
    }

    updateSymbol(symbol) {
        if (this.ready) {
            const newSymbol = `BINANCE:${symbol}USDT`;
            console.log('Updating symbol to:', newSymbol);
            this.chart.setSymbol(newSymbol);
        }
    }

    drawQueuedPoints() {
        if (this.queuedPoints) {
            this.drawReversalPoints(this.queuedPoints);
            this.queuedPoints = null;
        }
    }

    drawReversalPoints(reversalPoints) {
        if (!this.ready) {
            console.log('Chart not ready, queueing points');
            this.queuedPoints = reversalPoints;
            return;
        }

        console.log('Drawing reversal points:', reversalPoints.length);

        // Remove existing drawings
        this.chart.removeAllShapes();

        reversalPoints.forEach(point => {
            const isUpward = point.type === 'upward';
            const shape = {
                time: point.timestamp / 1000,
                price: point.price,
                text: isUpward ? '↑' : '↓',
                shape: isUpward ? 'arrow_up' : 'arrow_down',
                overrides: {
                    backgroundColor: isUpward ? '#2196F3' : '#FF5252',
                    borderColor: isUpward ? '#1976D2' : '#D32F2F',
                    textColor: '#FFFFFF',
                    fontsize: 20,
                    bold: true
                },
                zOrder: 'top',
                lock: true,
                disableSelection: true,
                disableSave: true,
                disableUndo: true
            };

            this.chart.createShape(shape);
        });
    }

    isReady() {
        return this.ready;
    }
}

// Initialize chart manager when DOM is ready
window.app = window.app || {};

function initChartManager() {
    try {
        if (typeof TradingView === 'undefined') {
            console.log('Waiting for TradingView...');
            setTimeout(initChartManager, 100);
            return;
        }
        window.app.chartManager = new ChartManager();
        console.log('Chart manager initialized');
    } catch (error) {
        console.error('Failed to initialize chart manager:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChartManager);
} else {
    initChartManager();
}
