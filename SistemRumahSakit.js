
// INTERFACE / ABSTRAKSI
interface ILaporanMedis {
    void simpanLaporan(String namaPasien, String diagnosis);
    void cetakLaporan(String namaPasien);
}


// IMPLEMENTASI
class LaporanMedisFile implements ILaporanMedis {

    private String formatLaporan;

    // format sekarang fleksibel
    public LaporanMedisFile(String formatLaporan) {
        this.formatLaporan = formatLaporan;
    }

    @Override
    public void simpanLaporan(String namaPasien, String diagnosis) {

        System.out.println("=== LAPORAN MEDIS [" + formatLaporan + "] ===");
        System.out.println("Pasien    : " + namaPasien);
        System.out.println("Diagnosis : " + diagnosis);
        System.out.println("Status    : Tersimpan ke FILE");
        System.out.println("==========================================");
    }

    @Override
    public void cetakLaporan(String namaPasien) {

        System.out.println("[CETAK - " + formatLaporan + "] Mencetak laporan untuk: " + namaPasien);
    }
}


class NotifikasiSMS {

    
    private String providerSMS = "TELKOMSEL_GATEWAY"; 

    public void kirimNotifikasi(String namaPasien, String pesan) {
        System.out.println("=== NOTIFIKASI SMS [" + providerSMS + "] ===");
        System.out.println("Kepada : " + namaPasien);
        System.out.println("Pesan  : " + pesan);
        System.out.println("Status : Terkirim via SMS");
        System.out.println("=========================================");
    }
}


class Dokter {

    private String namaDokter;
    private String spesialisasi;

    
    private LaporanMedis laporanMedis;   
    private NotifikasiSMS notifikasiSMS; 
    public Dokter(String namaDokter, String spesialisasi) {
        this.namaDokter = namaDokter;
        this.spesialisasi = spesialisasi;

        
        this.laporanMedis = new LaporanMedis();   
        this.notifikasiSMS = new NotifikasiSMS(); 
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


// MAIN

public class SistemKesehatanSalah {
    public static void main(String[] args) {

        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║   SISTEM MANAJEMEN TENAGA KESEHATAN      ║");
        System.out.println("║                                          ║");
        System.out.println("╚══════════════════════════════════════════╝");

       
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
