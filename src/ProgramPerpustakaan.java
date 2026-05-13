import java.io.FileWriter;
import java.io.IOException;

// ============================================================
// PROGRAM PERPUSTAKAAN - VERSI 1 (MELANGGAR SOLID)
// ============================================================

public class ProgramPerpustakaan {

    public void jalankanProgram() {

        System.out.println("==================================================");
        System.out.println("           Sistem Peminjaman Perpustakaan         ");
        System.out.println("==================================================");

        // DIP VIOLATION 2: Langsung new concrete class di sini
        Database database       = new Database();
        LaporanService laporan  = new LaporanService();

        PeminjamanService peminjaman = new PeminjamanService();

        // Simulasi peminjaman buku
        peminjaman.pinjamBuku("Harry Potter", "fiksi", "Rima");
        peminjaman.pinjamBuku("Kamus Besar", "referensi", "Budi");
        peminjaman.pinjamBuku("Majalah Tempo", "majalah", "Sari");

        // Simulasi pengembalian terlambat (hari terlambat)
        double denda1 = peminjaman.hitungDenda("fiksi", 3);
        double denda2 = peminjaman.hitungDenda("referensi", 5);
        double denda3 = peminjaman.hitungDenda("majalah", 2);

        System.out.println("==================================================");

        // Cek status peminjaman
        peminjaman.cekStatus("dikembalikan");
        peminjaman.cekStatus("dipinjam");
        peminjaman.cekStatus("terlambat");

        System.out.println("==================================================");

        // Buat laporan
        laporan.buatLaporan("cetak");
        laporan.buatLaporan("email");
        laporan.buatLaporan("file");

        System.out.println("==================================================");

        // Simpan ke database
        database.simpan("Rima meminjam Harry Potter, denda: Rp " + denda1);
        database.simpan("Budi meminjam Kamus Besar, denda: Rp " + denda2);
        database.simpan("Sari meminjam Majalah Tempo, denda: Rp " + denda3);

        System.out.println("==================================================");
        System.out.println("  Program selesai.");
        System.out.println("==================================================");
    }
}

// ============================================================
// OCP VIOLATION 1: BiayaDenda
// Setiap ada jenis buku baru, harus ubah method hitungDenda
// langsung di dalam class ini (tidak tertutup untuk modifikasi)
// ============================================================

class BiayaDenda {

    public double hitungDenda(String jenisBuku, int hariTerlambat) {
        double denda = 0;

        // Jika ada jenis buku baru, harus tambah if-else di sini
        if (jenisBuku.equals("fiksi")) {
            denda = hariTerlambat * 1000;
        } else if (jenisBuku.equals("referensi")) {
            denda = hariTerlambat * 3000;
        } else if (jenisBuku.equals("majalah")) {
            denda = hariTerlambat * 500;
        } else {
            denda = hariTerlambat * 2000;
        }

        return denda;
    }
}

// ============================================================
// OCP VIOLATION 2: StatusPeminjaman
// Setiap ada status baru, harus ubah method cekStatus
// langsung di dalam class ini
// ============================================================

class StatusPeminjaman {

    public void cekStatus(String status) {

        // Jika ada status baru, harus tambah if-else di sini
        if (status.equals("dipinjam")) {
            System.out.println("[STATUS] Buku sedang dipinjam.");
        } else if (status.equals("dikembalikan")) {
            System.out.println("[STATUS] Buku sudah dikembalikan.");
        } else if (status.equals("terlambat")) {
            System.out.println("[STATUS] Buku terlambat dikembalikan, kena denda!");
        } else {
            System.out.println("[STATUS] Status tidak diketahui.");
        }
    }
}

// ============================================================
// OCP VIOLATION 3: LaporanService
// Setiap ada format laporan baru, harus ubah method buatLaporan
// langsung di dalam class ini
// ============================================================

class LaporanService {

    // DIP VIOLATION 3: Langsung new PrinterLaporan (concrete class)
    private PrinterLaporan printer = new PrinterLaporan();

    public void buatLaporan(String format) {

        // Jika ada format baru, harus tambah if-else di sini
        if (format.equals("cetak")) {
            printer.cetak("Laporan peminjaman dicetak.");
        } else if (format.equals("email")) {
            System.out.println("[EMAIL] Laporan dikirim via email.");
        } else if (format.equals("file")) {
            try (FileWriter fw = new FileWriter("laporan.txt", true)) {
                fw.write("Laporan peminjaman disimpan.\n");
                System.out.println("[FILE] Laporan disimpan ke file.");
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("[LAPORAN] Format tidak diketahui.");
        }
    }
}

// ============================================================
// PeminjamanService
// DIP VIOLATION 1: Langsung new BiayaDenda & StatusPeminjaman
// (concrete class, bukan abstraksi)
// ============================================================

class PeminjamanService {

    private ICekStatus statusHandler;

    public PeminjamanService(ICekStatus statusHandler) {
        this.statusHandler = statusHandler;
    }
    
    public void pinjamBuku(String judul, String jenis, String peminjam) {
        System.out.printf("[PINJAM] %s meminjam buku '%s' (jenis: %s)%n",
                peminjam, judul, jenis);
    }
    
    public double hitungDenda(String jenisBuku, int hariTerlambat) {
        double denda = biayaDenda.hitungDenda(jenisBuku, hariTerlambat);
        System.out.printf("[DENDA] Jenis: %s | %d hari terlambat | Denda: Rp %.0f%n",
                jenisBuku, hariTerlambat, denda);
        return denda;
    }

    public void cekStatus(String status) {
        statusPeminjaman.cekStatus(status);
    }
}

// ============================================================
// Database & PrinterLaporan (concrete class)
// ============================================================

class Database {
    public void simpan(String data) {
        System.out.println("[DB] Disimpan: " + data);
    }
}

class PrinterLaporan {
    public void cetak(String teks) {
        System.out.println("[PRINTER] " + teks);
    }
}
