// ============================================================
// VERSI SALAH - Melanggar Dependency Inversion Principle (DIP)
// Tema: Sistem Manajemen Tenaga Kesehatan
//
// 3 KESALAHAN DIP:
// 1. Tidak ada interface/abstraksi untuk low-level class
// 2. High-level class (Dokter) langsung new low-level class sendiri
// 3. Dependency di-hardcode di dalam class
// ============================================================

// ------------------------------------------------------------
// KESALAHAN DIP #1:
// Class LaporanMedis tidak punya interface/abstraksi.
// High-level class (Dokter) akan langsung bergantung ke sini.
// ------------------------------------------------------------
class LaporanMedis {

    // KESALAHAN DIP #3: format di-hardcode, tidak bisa diganti
    private String formatLaporan = "FORMAT_TEKS_BIASA"; // hardcoded!

    public void simpanLaporan(String namaPasien, String diagnosis) {
        System.out.println("=== LAPORAN MEDIS [" + formatLaporan + "] ===");
        System.out.println("Pasien    : " + namaPasien);
        System.out.println("Diagnosis : " + diagnosis);
        System.out.println("Status    : Tersimpan ke FILE LOKAL");
        System.out.println("==========================================");
    }

    public void cetakLaporan(String namaPasien) {
        System.out.println("[CETAK - " + formatLaporan + "] Mencetak laporan untuk: " + namaPasien);
    }
}

// ------------------------------------------------------------
// KESALAHAN DIP #1 (lanjutan):
// Class NotifikasiSMS juga tidak punya interface/abstraksi.
// ------------------------------------------------------------
class NotifikasiSMS {

    // KESALAHAN DIP #3: provider di-hardcode, tidak bisa diganti
    private String providerSMS = "TELKOMSEL_GATEWAY"; // hardcoded!

    public void kirimNotifikasi(String namaPasien, String pesan) {
        System.out.println("=== NOTIFIKASI SMS [" + providerSMS + "] ===");
        System.out.println("Kepada : " + namaPasien);
        System.out.println("Pesan  : " + pesan);
        System.out.println("Status : Terkirim via SMS");
        System.out.println("=========================================");
    }
}

// ------------------------------------------------------------
// KESALAHAN DIP #2:
// Class Dokter (high-level) langsung new low-level class sendiri
// di dalam constructor. Tidak menerima dependency dari luar,
// dan tidak bergantung ke abstraksi (interface) sama sekali.
// ------------------------------------------------------------
class Dokter {

    private String namaDokter;
    private String spesialisasi;

    // KESALAHAN DIP #1 + #2:
    // Bertipe class konkret langsung, bukan interface
    private LaporanMedis laporanMedis;   // seharusnya: Interface
    private NotifikasiSMS notifikasiSMS; // seharusnya: Interface

    public Dokter(String namaDokter, String spesialisasi) {
        this.namaDokter = namaDokter;
        this.spesialisasi = spesialisasi;

        // KESALAHAN DIP #2: Dokter sendiri yang buat instance low-level class
        // Tidak bisa diganti implementasinya tanpa ubah class ini
        this.laporanMedis = new LaporanMedis();   // <-- SALAH! langsung new
        this.notifikasiSMS = new NotifikasiSMS(); // <-- SALAH! langsung new
    }

    public void periksaPasien(String namaPasien, String diagnosis) {
        System.out.println("\n[DOKTER] " + namaDokter + " (" + spesialisasi + ")");
        System.out.println("[DOKTER] Memeriksa pasien: " + namaPasien);
        laporanMedis.simpanLaporan(namaPasien, diagnosis);
        notifikasiSMS.kirimNotifikasi(namaPasien,
                "Hasil pemeriksaan Dr. " + namaDokter + ": " + diagnosis);
    }

    public void cetakHasilPeriksa(String namaPasien) {
        laporanMedis.cetakLaporan(namaPasien);
    }
}

// ------------------------------------------------------------
// MAIN
// ------------------------------------------------------------
public class SistemKesehatanSalah {
    public static void main(String[] args) {

        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║   SISTEM MANAJEMEN TENAGA KESEHATAN      ║");
        System.out.println("║         *** VERSI SALAH (DIP) ***        ║");
        System.out.println("╚══════════════════════════════════════════╝");

        // Dokter dibuat tanpa bisa pilih implementasi dari luar
        Dokter dokter1 = new Dokter("Andi Setiawan", "Spesialis Jantung");
        Dokter dokter2 = new Dokter("Rina Maharani", "Spesialis Anak");

        System.out.println("\n>>> Simulasi Pemeriksaan Pasien <<<");

        dokter1.periksaPasien("Budi Santoso", "Hipertensi Ringan");
        System.out.println();
        dokter1.cetakHasilPeriksa("Budi Santoso");

        System.out.println();

        dokter2.periksaPasien("Siti Rahayu", "Demam Berdarah Stadium 1");
        System.out.println();
        dokter2.cetakHasilPeriksa("Siti Rahayu");

        System.out.println("\n>>> Masalah yang muncul <<<");
        System.out.println("- Tidak bisa ganti LaporanMedis ke Database/PDF tanpa ubah class Dokter");
        System.out.println("- Tidak bisa ganti NotifikasiSMS ke Email/WhatsApp tanpa ubah class Dokter");
        System.out.println("- Format & provider hardcoded: tidak fleksibel sama sekali");
    }
}