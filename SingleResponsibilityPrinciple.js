//----- Pelanggaran 1 -----
// MELANGGAR SRP Karena Fungsi ini mengatur inisialisasi semua jenis chart yang berbeda.
// Jika cara inisialisasi AnyChart berubah,maka fungsi ini juga harus diubah

function initCharts() {

            // Tanggung jawab 1: Inisialisasi Chart Distribusi (Chart.js)
            const ctxDistro = document.getElementById('distroChart').getContext('2d');
            distroChart = new Chart(ctxDistro, {
                type: 'bar',
                data: {
                    labels: ['World', 'Sports', 'Business', 'Sci/Tech'],
                    datasets: [{
                        data: [0, 0, 0, 0],
                        backgroundColor: ['#0ea5e9', '#6366f1', '#8b5cf6', '#d946ef'],
                        borderRadius: 12
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { ticks: { color: '#ffffff50' }, grid: { color: '#ffffff05' } },
                        x: { ticks: { color: '#ffffff' }, grid: { display: false } }
                    }
                }
            });

            // Tanggung jawab 2: Inisialisasi Donut Chart (Chart.js)
            const ctxDonut = document.getElementById('donutChart').getContext('2d');
            donutChart = new Chart(ctxDonut, {
                type: 'doughnut',
                data: {
                    labels: ['Kept', 'Cleaned'],
                    datasets: [{
                        data: [0, 0],
                        backgroundColor: ['#6366f1', '#1e293b'],
                        borderWidth: 0
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: { legend: { position: 'bottom', labels: { color: '#fff', usePointStyle: true } } }
                }
            });
            // Tanggung jawab 3: Inisialisasi Method Chart (Chart.js)
            const ctxMethod = document.getElementById('methodChart').getContext('2d');
            methodChart = new Chart(ctxMethod, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: '#06b6d4',
                        borderRadius: 10
                    }]
                },
                options: {
                    indexAxis: 'y',
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { max: 100, ticks: { color: '#ffffff50' }, grid: { color: '#ffffff05' } },
                        y: { ticks: { color: '#fff' }, grid: { display: false } }
                    }
                }
            });
            // Tanggung jawab 4: Inisialisasi Tag Cloud (AnyChart Library)
            // 4. Word Cloud Initialization
            anychart.onDocumentReady(function () {
                keywordCloud = anychart.tagCloud();
                keywordCloud.angles([0]); // Kata mendatar
                keywordCloud.colorRange(false);
                keywordCloud.palette(['#38bdf8', '#818cf8', '#fbbf24', '#d946ef', '#34d399']);
                keywordCloud.background().enabled(true).fill('rgba(255, 255, 255, 0)');
                keywordCloud.container("wordcloud-container");
                keywordCloud.draw();
            });
        }


//----- Pelanggaran 2 -----
// MELANGGAR SRP: Fungsi ini mencampur logika Data Fetching, Data Processing/Kalkulasi, 
// dan UI Manipulation (Update DOM & Chart).

function loadMonitoringData() {
            // Tanggung jawab 1: Networking (Data Fetching)
            $.get("http://127.0.0.1:8001/get-stats").done(function(data) {
                // Tanggung jawab 2: Direct DOM Manipulation
                $('#stat-total').text(data.total_data || "0");
                $('#stat-processed').text(data.after_prepro || "0");
                $('#stat-attr').text(data.attributes || "50");
                $('#stat-acc').text(data.accuracy || "0%");

                if(data.distribution) {
                    distroChart.data.datasets[0].data = data.distribution;
                    distroChart.update();
                }
                // Tanggung jawab 3: Business Logic / Transformation 
                // (Kalkulasi 'removed' seharusnya tidak dilakukan di dalam fungsi update UI)
                if(data.avg_before && data.avg_after) {
                    const removed = data.avg_before - data.avg_after;
                    donutChart.data.datasets[0].data = [data.avg_after, removed];
                    donutChart.update();
                }

                if(data.comparison_table) {
                    methodChart.data.labels = data.comparison_table.map(item => item.method);
                    methodChart.data.datasets[0].data = data.comparison_table.map(item => parseFloat(item.acc));
                    methodChart.update();
                }
                // Tanggung jawab 4: Integrasi eksternal library (AnyChart)
                if(data.wordcloud_data && keywordCloud) {
                    keywordCloud.data(data.wordcloud_data);
                }
            });
        }


//----- Pelanggaran 3 -----
// MELANGGAR SRP: Handler ini mencampur pengelolaan state tombol (UI), 
// pemanggilan API, dan logika pemetaan konten (mapping icons).

$('#btn-klasifikasi').on('click', function() {
                const text = $('#isi_berita').val();
                if(!text) return;
                // Tanggung jawab 1: Mengelola state UI (Loading state)
                $(this).html('<span class="spinner-border spinner-border-sm"></span> Analyzing...').prop('disabled', true);
                // Tanggung jawab 2: Komunikasi API
                $.ajax({
                    url: "http://127.0.0.1:8001/predict",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ text: text }),
                    success: function(res) {
                        // Tanggung jawab 3: Business Logic Mapping (Penentuan icon berdasarkan kategori)
                        // Logika ini harusnya terpisah agar bisa digunakan di bagian lain tanpa AJAX.
                        $('#idle-state').addClass('d-none');
                        $('#active-state').removeClass('d-none');
                        const icons = { "World": "🌍", "Sports": "⚽", "Business": "💼", "Sci/Tech": "🚀" };
                        // Tanggung jawab 4: Render Update ke DOM
                        $('#cat-icon').text(icons[res.label] || "📄");
                        $('#cat-label').text(res.label).css('color', '#38bdf8');
                        $('#conf-label').text(res.confidence.toFixed(2) + "% Confidence");                    },
                    complete: () => $('#btn-klasifikasi').html('RUN ANALYSIS').prop('disabled', false)
                });
            });

/**
 * --- (Perbaikan Pelanggaran 1) ---
 * Memisahkan inisialisasi library yang berbeda ke dalam managernya masing-masing.
 */

// 1. Abstraksi Dasar (Interface)
class BaseChart {
    init() { throw new Error("Method 'init()' must be implemented."); }
    update(data) { throw new Error("Method 'update()' must be implemented."); }
}

// 2. Manajer Khusus Bar Chart Distribusi (Chart.js)
class DistroChartManager extends BaseChart {
    constructor(canvasId) {
        super();
        this.canvasId = canvasId;
        this.instance = null;
    }

    init() {
        const ctx = document.getElementById(this.canvasId).getContext('2d');
        this.instance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['World', 'Sports', 'Business', 'Sci/Tech'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#0ea5e9', '#6366f1', '#8b5cf6', '#d946ef'],
                    borderRadius: 12
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: '#ffffff50' }, grid: { color: '#ffffff05' } },
                    x: { ticks: { color: '#ffffff' }, grid: { display: false } }
                }
            }
        });
    }

    update(newData) {
        if (this.instance) {
            this.instance.data.datasets[0].data = newData;
            this.instance.update();
        }
    }
}

// 3. Manajer Khusus Donut Chart (Chart.js)
class DonutChartManager extends BaseChart {
    constructor(canvasId) {
        super();
        this.canvasId = canvasId;
        this.instance = null;
    }

    init() {
        const ctx = document.getElementById(this.canvasId).getContext('2d');
        this.instance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Kept', 'Cleaned'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#6366f1', '#1e293b'],
                    borderWidth: 0
                }]
            },
            options: {
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: { legend: { position: 'bottom', labels: { color: '#fff', usePointStyle: true } } }
            }
        });
    }

    update(kept, removed) {
        if (this.instance) {
            this.instance.data.datasets[0].data = [kept, removed];
            this.instance.update();
        }
    }
}

// 4. Manajer Khusus Word Cloud (AnyChart)
class WordCloudManager extends BaseChart {
    constructor(containerId) {
        super();
        this.containerId = containerId;
        this.instance = null;
    }

    init() {
        anychart.onDocumentReady(() => {
            this.instance = anychart.tagCloud();
            this.instance.angles([0]);
            this.instance.colorRange(false);
            this.instance.palette(['#38bdf8', '#818cf8', '#fbbf24', '#d946ef', '#34d399']);
            this.instance.background().enabled(true).fill('rgba(255, 255, 255, 0)');
            this.instance.container(this.containerId);
            this.instance.draw();
        });
    }

    update(wordData) {
        if (this.instance) {
            this.instance.data(wordData);
        }
    }
}

/**
 * --- Penggunaan (Orchestration) ---
 */
const distroChart = new DistroChartManager('distroChart');
const donutChart = new DonutChartManager('donutChart');
const wordCloud = new WordCloudManager('wordcloud-container');

// Inisialisasi dijalankan sekali saat page load
function initAppCharts() {
    distroChart.init();
    donutChart.init();
    wordCloud.init();
}

/**
 * --- SRP: Monitoring Data (Perbaikan Pelanggaran 2) ---
 * Memisahkan Networking, Business Logic, dan UI Rendering.
 */

// 1. DATA SERVICE (Tanggung Jawab: Networking/API)
class MonitoringApiService {
    static async getStats() {
        // Hanya bertugas mengambil data dari server
        return $.get("http://127.0.0.1:8001/get-stats");
    }
}

// 2. DATA TRANSFORMER (Tanggung Jawab: Business Logic & Calculation)
class MonitoringTransformer {
    static processDonutData(avgBefore, avgAfter) {
        // Hanya bertugas menghitung data, tidak peduli UI atau API
        const kept = avgAfter;
        const removed = avgBefore - avgAfter;
        return [kept, removed];
    }

    static processMethodData(comparisonTable) {
        return {
            labels: comparisonTable.map(item => item.method),
            values: comparisonTable.map(item => parseFloat(item.acc))
        };
    }
}

// 3. UI RENDERER (Tanggung Jawab: DOM Manipulation)
class MonitoringRenderer {
    static updateTextStats(data) {
        // Hanya bertugas menulis ke elemen HTML
        $('#stat-total').text(data.total_data || "0");
        $('#stat-processed').text(data.after_prepro || "0");
        $('#stat-attr').text(data.attributes || "50");
        $('#stat-acc').text(data.accuracy || "0%");
    }

    static updateCharts(data, charts) {
        // Mendistribusikan data ke objek chart yang sudah ada
        if (data.distribution && charts.distro) {
            charts.distro.update(data.distribution); 
        }

        if (data.avg_before && data.avg_after && charts.donut) {
            const [kept, removed] = MonitoringTransformer.processDonutData(data.avg_before, data.avg_after);
            charts.donut.update(kept, removed);
        }

        if (data.wordcloud_data && charts.wordcloud) {
            charts.wordcloud.update(data.wordcloud_data);
        }
    }
}

/**
 * --- ORCHESTRATOR ---
 * Fungsi ini sekarang sangat bersih karena hanya memanggil kelas-kelas di atas.
 */
async function loadMonitoringData() {
    try {
        // 1. Ambil Data
        const rawData = await MonitoringApiService.getStats();

        // 2. Update Teks UI
        MonitoringRenderer.updateTextStats(rawData);

        // 3. Update Chart Visual (Menggunakan manager dari Pelanggaran 1)
        MonitoringRenderer.updateCharts(rawData, {
            distro: distroChart, // Instance dari DistroChartManager
            donut: donutChart,   // Instance dari DonutChartManager
            wordcloud: wordCloud // Instance dari WordCloudManager
        });

    } catch (error) {
        console.error("Gagal sinkronisasi data monitoring:", error);
    }
}


/**
 * --- SRP: Klasifikasi (Perbaikan Pelanggaran 3) ---
 * Memisahkan UI State, Networking, dan Logic Mapping.
 */

// 1. SERVICE: Khusus urusan komunikasi API
class ClassificationApiService {
    static async postPredict(text) {
        return $.ajax({
            url: "http://127.0.0.1:8001/predict",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ text: text })
        });
    }
}

// 2. TRANSFORMER: Khusus logika bisnis (Mapping Icon & Formatting)
class ClassificationTransformer {
    static getIcon(label) {
        const icons = { 
            "World": "🌍", 
            "Sports": "⚽", 
            "Business": "💼", 
            "Sci/Tech": "🚀" 
        };
        return icons[label] || "📄";
    }

    static formatConfidence(value) {
        return value.toFixed(2) + "% Confidence";
    }
}

// 3. RENDERER: Khusus manipulasi DOM & State UI
class ClassificationRenderer {
    static setButtonState(isLoading) {
        const btn = $('#btn-klasifikasi');
        if (isLoading) {
            btn.html('<span class="spinner-border spinner-border-sm"></span> Analyzing...')
               .prop('disabled', true);
        } else {
            btn.html('RUN ANALYSIS').prop('disabled', false);
        }
    }

    static displayResult(res) {
        const icon = ClassificationTransformer.getIcon(res.label);
        const confidenceText = ClassificationTransformer.formatConfidence(res.confidence);

        $('#idle-state').addClass('d-none');
        $('#active-state').removeClass('d-none');
        
        $('#cat-icon').text(icon);
        $('#cat-label').text(res.label).css('color', '#38bdf8');
        $('#conf-label').text(confidenceText);
    }
}

/**
 * --- EVENT HANDLER (ORCHESTRATOR) ---
 * Handler sekarang hanya mengatur alur (flow), bukan mengerjakan detailnya.
 */
$('#btn-klasifikasi').on('click', async function() {
    const text = $('#isi_berita').val();
    if (!text) return;

    // 1. Atur UI ke mode loading
    ClassificationRenderer.setButtonState(true);

    try {
        // 2. Panggil API
        const response = await ClassificationApiService.postPredict(text);

        // 3. Tampilkan Hasil
        ClassificationRenderer.displayResult(response);
        
    } catch (error) {
        alert("Analisis gagal. Pastikan server aktif.");
    } finally {
        // 4. Kembalikan state tombol
        ClassificationRenderer.setButtonState(false);
    }
});

