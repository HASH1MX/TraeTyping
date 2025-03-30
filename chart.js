// Simple line chart implementation for typing test results
class SimpleChart {
    constructor(container, options = {}) {
        this.container = container;
        this.options = Object.assign({
            width: container.clientWidth || 400,
            height: container.clientHeight || 200,
            padding: 20,
            lineColor: '#4dd0e1', // Teal color similar to the image
            pointColor: '#fff',
            pointRadius: 4,
            gridColor: 'rgba(255, 255, 255, 0.1)',
            textColor: 'rgba(255, 255, 255, 0.7)',
            fontSize: 12,
            yAxisTicks: 5,
            xAxisTicks: 5,
            animate: true,
            animationDuration: 1000
        }, options);

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.data = [];
    }

    setData(data) {
        this.data = data;
        this.render();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        const { ctx, options, canvas } = this;
        const { padding, gridColor, textColor, fontSize, yAxisTicks, xAxisTicks } = options;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        ctx.strokeStyle = gridColor;
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'right';

        // Y-axis grid lines and labels
        const yStep = chartHeight / (yAxisTicks - 1);
        const maxValue = Math.max(...this.data.map(d => d.y), 0);
        const yValueStep = maxValue / (yAxisTicks - 1);

        for (let i = 0; i < yAxisTicks; i++) {
            const y = padding + i * yStep;
            const value = Math.round(maxValue - i * yValueStep);

            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();

            ctx.fillText(value, padding - 5, y + fontSize / 3);
        }

        // X-axis grid lines and labels
        const xStep = chartWidth / (xAxisTicks - 1);
        const dataLength = this.data.length;

        ctx.textAlign = 'center';
        for (let i = 0; i < xAxisTicks; i++) {
            const x = padding + i * xStep;
            const value = i * (dataLength - 1) / (xAxisTicks - 1);
            const label = Math.round(value);

            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, canvas.height - padding);
            ctx.stroke();

            if (i === 0 || i === xAxisTicks - 1 || i === Math.floor(xAxisTicks / 2)) {
                ctx.fillText(label, x, canvas.height - padding + fontSize + 5);
            }
        }
    }

    drawLine() {
        const { ctx, options, canvas, data } = this;
        const { padding, lineColor, pointColor, pointRadius, animate, animationDuration } = options;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        if (data.length < 2) return;

        const maxValue = Math.max(...data.map(d => d.y), 0);
        const startTime = performance.now();

        const drawFrame = (progress) => {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 2;
            ctx.beginPath();

            data.forEach((point, index) => {
                const x = padding + (index / (data.length - 1)) * chartWidth;
                const y = padding + chartHeight - (point.y / maxValue) * chartHeight;

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    if (animate) {
                        const prevPoint = data[index - 1];
                        const prevX = padding + ((index - 1) / (data.length - 1)) * chartWidth;
                        const prevY = padding + chartHeight - (prevPoint.y / maxValue) * chartHeight;
                        
                        const currentProgress = Math.min(index / (data.length - 1), progress);
                        const currentX = prevX + (x - prevX) * currentProgress;
                        const currentY = prevY + (y - prevY) * currentProgress;
                        
                        ctx.lineTo(currentX, currentY);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            });

            ctx.stroke();

            // Draw points
            data.forEach((point, index) => {
                if (!animate || index / (data.length - 1) <= progress) {
                    const x = padding + (index / (data.length - 1)) * chartWidth;
                    const y = padding + chartHeight - (point.y / maxValue) * chartHeight;

                    ctx.fillStyle = lineColor;
                    ctx.beginPath();
                    ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = pointColor;
                    ctx.beginPath();
                    ctx.arc(x, y, pointRadius / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            if (animate && progress < 1) {
                requestAnimationFrame(() => {
                    const elapsed = performance.now() - startTime;
                    const newProgress = Math.min(elapsed / animationDuration, 1);
                    this.clear();
                    this.drawGrid();
                    drawFrame(newProgress);
                });
            }
        };

        drawFrame(animate ? 0 : 1);
    }

    render() {
        this.clear();
        this.drawGrid();
        this.drawLine();
    }
}