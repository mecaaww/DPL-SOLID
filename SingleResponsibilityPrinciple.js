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