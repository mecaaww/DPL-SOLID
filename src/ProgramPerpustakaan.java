import java.io.FileWriter;
import java.io.IOException;

public class ProgramPerpustakaan {

    public void jalankanProgram() {

        System.out.println("==================================================");
        System.out.println("           Sistem Peminjaman Perpustakaan         ");
        System.out.println("==================================================");

        Database database       = new Database();
        LaporanService laporan  = new LaporanService();

        PeminjamanService peminjaman = new PeminjamanService();

        peminjaman.pinjamBuku("Harry Potter", "fiksi", "Rima");
        peminjaman.pinjamBuku("Kamus Besar", "referensi", "Budi");
        peminjaman.pinjamBuku("Majalah Tempo", "majalah", "Sari");

        double denda1 = peminjaman.hitungDenda("fiksi", 3);
        double denda2 = peminjaman.hitungDenda("referensi", 5);
        double denda3 = peminjaman.hitungDenda("majalah", 2);

        System.out.println("==================================================");

        peminjaman.cekStatus("dikembalikan");
        peminjaman.cekStatus("dipinjam");
        peminjaman.cekStatus("terlambat");

        System.out.println("==================================================");

        laporan.buatLaporan("cetak");
        laporan.buatLaporan("email");
        laporan.buatLaporan("file");

        System.out.println("==================================================");

        database.simpan("Rima meminjam Harry Potter, denda: Rp " + denda1);
        database.simpan("Budi meminjam Kamus Besar, denda: Rp " + denda2);
        database.simpan("Sari meminjam Majalah Tempo, denda: Rp " + denda3);

        System.out.println("==================================================");
        System.out.println("  Program selesai.");
        System.out.println("==================================================");
    }
}

class BiayaDenda {

    public double hitungDenda(String jenisBuku, int hariTerlambat) {
        double denda = 0;

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

class StatusPeminjaman {

    public void cekStatus(String status) {

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

class LaporanService {

    private PrinterLaporan printer = new PrinterLaporan();

    public void buatLaporan(String format) {

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
