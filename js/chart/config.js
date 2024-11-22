// TradingView chart configuration
const CHART_CONFIG = {
    // Chart appearance
    theme: 'Light',
    style: '1', // Candlestick style
    toolbar_bg: '#f1f3f6',
    
    // Chart features
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
    
    // Chart colors and styles
    overrides: {
        "paneProperties.background": "#ffffff",
        "paneProperties.vertGridProperties.color": "#e6e6e6",
        "paneProperties.horzGridProperties.color": "#e6e6e6",
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#333333",
        "scalesProperties.backgroundColor": "#ffffff",
        "paneProperties.topMargin": 15,
        "paneProperties.bottomMargin": 15
    },
    
    // Volume indicator colors
    studies_overrides: {
        "volume.volume.color.0": "#ef5350",
        "volume.volume.color.1": "#26a69a"
    }
};

// Marker styles
const MARKER_STYLES = {
    up: {
        backgroundColor: '#2196F3',
        borderColor: '#1976D2',
        text: { color: '#FFFFFF' },
        fontsize: 20,
        bold: true
    },
    down: {
        backgroundColor: '#FF5252',
        borderColor: '#D32F2F',
        text: { color: '#FFFFFF' },
        fontsize: 20,
        bold: true
    }
};
