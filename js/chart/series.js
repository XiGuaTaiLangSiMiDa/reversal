// TradingView chart series configuration
class SeriesManager {
    constructor(chart) {
        this.chart = chart;
    }

    createMarker(point, type) {
        const style = MARKER_STYLES[type];
        return {
            time: point.timestamp / 1000,
            price: point.price,
            text: type === 'up' ? '↑' : '↓',
            overrides: style
        };
    }

    drawReversalPoints(reversalPoints) {
        // Remove existing markers
        this.chart.removeAllShapes();

        // Draw new markers
        reversalPoints.forEach(point => {
            const type = point.type === 'upward' ? 'up' : 'down';
            const marker = this.createMarker(point, type);
            
            this.chart.createShape(marker, {
                shape: type === 'up' ? 'arrow_up' : 'arrow_down',
                zOrder: 'top',
                lock: true,
                disableSelection: true
            });
        });
    }
}
