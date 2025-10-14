// Mock Data
const appliancesData = [
    {
        id: 'ac',
        name: '冷氣',
        icon: '❄️',
        status: true,
        power: 2.8
    },
    {
        id: 'light',
        name: '燈光',
        icon: '💡',
        status: true,
        power: 0.15
    },
    {
        id: 'tv',
        name: '電視',
        icon: '📺',
        status: false,
        power: 0.0
    },
    {
        id: 'fridge',
        name: '冰箱',
        icon: '🧊',
        status: true,
        power: 0.45
    },
    {
        id: 'washer',
        name: '洗衣機',
        icon: '🌀',
        status: false,
        power: 0.0
    },
    {
        id: 'heater',
        name: '熱水器',
        icon: '🔥',
        status: true,
        power: 1.2
    }
];

// Weekly usage data (kWh per day)
const weeklyUsageData = [
    { day: '週一', usage: 28.5 },
    { day: '週二', usage: 32.1 },
    { day: '週三', usage: 25.8 },
    { day: '週四', usage: 30.2 },
    { day: '週五', usage: 35.6 },
    { day: '週六', usage: 40.3 },
    { day: '週日', usage: 38.7 }
];

// Monthly usage data (kWh per day)
const monthlyUsageData = [
    { day: '1日', usage: 28.5 },
    { day: '2日', usage: 32.1 },
    { day: '3日', usage: 25.8 },
    { day: '4日', usage: 30.2 },
    { day: '5日', usage: 35.6 },
    { day: '6日', usage: 40.3 },
    { day: '7日', usage: 38.7 },
    { day: '8日', usage: 29.4 },
    { day: '9日', usage: 31.8 },
    { day: '10日', usage: 27.6 },
    { day: '11日', usage: 33.9 },
    { day: '12日', usage: 36.2 },
    { day: '13日', usage: 34.5 },
    { day: '14日', usage: 32.8 },
    { day: '15日', usage: 30.1 },
    { day: '16日', usage: 28.7 },
    { day: '17日', usage: 31.4 },
    { day: '18日', usage: 35.8 },
    { day: '19日', usage: 37.2 },
    { day: '20日', usage: 39.6 },
    { day: '21日', usage: 41.3 },
    { day: '22日', usage: 38.9 },
    { day: '23日', usage: 36.5 },
    { day: '24日', usage: 33.2 },
    { day: '25日', usage: 31.7 },
    { day: '26日', usage: 34.9 },
    { day: '27日', usage: 37.8 },
    { day: '28日', usage: 40.2 },
    { day: '29日', usage: 42.5 },
    { day: '30日', usage: 39.1 }
];

// Hourly usage data for today (kW)
const hourlyUsageData = [
    { hour: '0時', usage: 0.8 },
    { hour: '1時', usage: 0.6 },
    { hour: '2時', usage: 0.5 },
    { hour: '3時', usage: 0.5 },
    { hour: '4時', usage: 0.6 },
    { hour: '5時', usage: 0.9 },
    { hour: '6時', usage: 1.5 },
    { hour: '7時', usage: 2.3 },
    { hour: '8時', usage: 2.8 },
    { hour: '9時', usage: 2.1 },
    { hour: '10時', usage: 1.8 },
    { hour: '11時', usage: 2.0 },
    { hour: '12時', usage: 2.5 },
    { hour: '13時', usage: 2.2 },
    { hour: '14時', usage: 2.4 },
    { hour: '15時', usage: 2.6 },
    { hour: '16時', usage: 2.8 },
    { hour: '17時', usage: 3.2 },
    { hour: '18時', usage: 4.5 },
    { hour: '19時', usage: 4.8 },
    { hour: '20時', usage: 4.2 },
    { hour: '21時', usage: 3.5 },
    { hour: '22時', usage: 2.8 },
    { hour: '23時', usage: 1.5 }
];

// Global variables
let currentPeriod = 'week';
let usageChart = null;
let hourlyChart = null;

// Initialize Dashboard
function initDashboard() {
    updateTime();
    setInterval(updateTime, 1000);

    renderAppliances();
    calculateTotalPower();
    updatePeakUsage();
    updateHighestConsumer();

    initUsageChart();
    initHourlyChart();

    setupToggleButtons();
}

// Update current time
function updateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    document.getElementById('currentTime').textContent = now.toLocaleString('zh-TW', options);
}

// Render appliances
function renderAppliances() {
    const grid = document.getElementById('appliancesGrid');
    grid.innerHTML = '';

    appliancesData.forEach(appliance => {
        const card = document.createElement('div');
        card.className = `appliance-card ${appliance.status ? 'on' : 'off'}`;
        card.onclick = () => toggleAppliance(appliance.id);

        card.innerHTML = `
            <div class="appliance-header">
                <span class="appliance-icon">${appliance.icon}</span>
                <div class="appliance-status ${appliance.status ? 'on' : 'off'}"></div>
            </div>
            <div class="appliance-info">
                <div class="appliance-name">${appliance.name}</div>
                <div class="appliance-power">
                    <span class="value">${appliance.power}</span> kW
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Toggle appliance status
function toggleAppliance(id) {
    const appliance = appliancesData.find(a => a.id === id);
    if (!appliance) return;

    appliance.status = !appliance.status;

    if (appliance.status) {
        // Set power based on appliance type
        switch(id) {
            case 'ac':
                appliance.power = 2.8;
                break;
            case 'light':
                appliance.power = 0.15;
                break;
            case 'tv':
                appliance.power = 0.18;
                break;
            case 'fridge':
                appliance.power = 0.45;
                break;
            case 'washer':
                appliance.power = 1.5;
                break;
            case 'heater':
                appliance.power = 1.2;
                break;
        }
    } else {
        appliance.power = 0;
    }

    renderAppliances();
    calculateTotalPower();
    updateHighestConsumer();
}

// Calculate total power
function calculateTotalPower() {
    const total = appliancesData.reduce((sum, appliance) => sum + appliance.power, 0);
    document.getElementById('totalPower').textContent = total.toFixed(2);
}

// Update peak usage
function updatePeakUsage() {
    const peakData = hourlyUsageData.reduce((max, current) =>
        current.usage > max.usage ? current : max
    );

    document.getElementById('peakHour').textContent = peakData.hour;
    document.getElementById('peakValue').textContent = peakData.usage.toFixed(1);
}

// Update highest consumer
function updateHighestConsumer() {
    const activeAppliances = appliancesData.filter(a => a.status);
    if (activeAppliances.length === 0) {
        document.getElementById('consumerIcon').innerHTML = '<span>🏠</span>';
        document.getElementById('consumerName').textContent = '--';
        document.getElementById('consumerPower').textContent = '0';
        return;
    }

    const highest = activeAppliances.reduce((max, current) =>
        current.power > max.power ? current : max
    );

    document.getElementById('consumerIcon').innerHTML = `<span>${highest.icon}</span>`;
    document.getElementById('consumerName').textContent = highest.name;
    document.getElementById('consumerPower').textContent = highest.power.toFixed(2);
}

// Initialize usage chart
function initUsageChart() {
    const data = currentPeriod === 'week' ? weeklyUsageData : monthlyUsageData;

    usageChart = Highcharts.chart('usageChart', {
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            height: 300
        },
        title: {
            text: null
        },
        xAxis: {
            categories: data.map(d => d.day),
            labels: {
                style: {
                    color: '#a0aec0'
                }
            },
            lineColor: 'rgba(255, 255, 255, 0.1)',
            tickColor: 'rgba(255, 255, 255, 0.1)'
        },
        yAxis: {
            title: {
                text: '用電量 (kWh)',
                style: {
                    color: '#a0aec0'
                }
            },
            labels: {
                style: {
                    color: '#a0aec0'
                }
            },
            gridLineColor: 'rgba(255, 255, 255, 0.1)'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            column: {
                borderRadius: 5,
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [{
            name: '用電量',
            data: data.map(d => d.usage),
            color: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#667eea'],
                    [1, '#764ba2']
                ]
            }
        }],
        credits: {
            enabled: false
        },
        tooltip: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            style: {
                color: '#ffffff'
            },
            formatter: function() {
                return '<b>' + this.x + '</b><br/>' +
                       '用電量: <b>' + this.y.toFixed(1) + ' kWh</b>';
            }
        }
    });

    updateUsageSummary(data);
}

// Initialize hourly chart
function initHourlyChart() {
    hourlyChart = Highcharts.chart('hourlyChart', {
        chart: {
            type: 'areaspline',
            backgroundColor: 'transparent',
            height: 300
        },
        title: {
            text: null
        },
        xAxis: {
            categories: hourlyUsageData.map(d => d.hour),
            labels: {
                style: {
                    color: '#a0aec0'
                },
                step: 2
            },
            lineColor: 'rgba(255, 255, 255, 0.1)',
            tickColor: 'rgba(255, 255, 255, 0.1)'
        },
        yAxis: {
            title: {
                text: '用電量 (kW)',
                style: {
                    color: '#a0aec0'
                }
            },
            labels: {
                style: {
                    color: '#a0aec0'
                }
            },
            gridLineColor: 'rgba(255, 255, 255, 0.1)'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(79, 209, 197, 0.5)'],
                        [1, 'rgba(79, 209, 197, 0.05)']
                    ]
                },
                lineWidth: 3,
                marker: {
                    enabled: true,
                    radius: 4,
                    fillColor: '#4fd1c5'
                }
            }
        },
        series: [{
            name: '用電量',
            data: hourlyUsageData.map(d => d.usage),
            color: '#4fd1c5'
        }],
        credits: {
            enabled: false
        },
        tooltip: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            style: {
                color: '#ffffff'
            },
            formatter: function() {
                return '<b>' + this.x + '</b><br/>' +
                       '用電量: <b>' + this.y.toFixed(1) + ' kW</b>';
            }
        }
    });
}

// Update usage summary
function updateUsageSummary(data) {
    const total = data.reduce((sum, item) => sum + item.usage, 0);
    const average = total / data.length;

    document.getElementById('totalUsage').textContent = total.toFixed(1);
    document.getElementById('avgUsage').textContent = average.toFixed(1);
}

// Setup toggle buttons
function setupToggleButtons() {
    const buttons = document.querySelectorAll('.toggle-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            currentPeriod = this.dataset.period;
            updateUsageChart();
        });
    });
}

// Update usage chart
function updateUsageChart() {
    const data = currentPeriod === 'week' ? weeklyUsageData : monthlyUsageData;

    usageChart.xAxis[0].setCategories(data.map(d => d.day));
    usageChart.series[0].setData(data.map(d => d.usage));

    updateUsageSummary(data);
}

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', initDashboard);
