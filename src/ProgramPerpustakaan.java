import java.io.FileWriter;
import java.io.IOException;

public class ProgramPerpustakaan {

    public void jalankanProgram() {

        System.out.println("==================================================");
        System.out.println("           Sistem Peminjaman Perpustakaan         ");
        System.out.println("==================================================");

        IPenyimpanan database       = new Database();
        IPencetakLaporan printer    = new PrinterLaporan();
        IFormatLaporan formatCetak  = new LaporanCetak(printer);
        IFormatLaporan formatEmail  = new LaporanEmail();
        IFormatLaporan formatFile   = new LaporanFile();

        LaporanService laporan = new LaporanService();
        laporan.tambahFormat(formatCetak);
        laporan.tambahFormat(formatEmail);
        laporan.tambahFormat(formatFile);

        IHitungDenda dendaFiksi      = new DendaFiksi();
        IHitungDenda dendaReferensi  = new DendaReferensi();
        IHitungDenda dendaMajalah    = new DendaMajalah();

        ICekStatus statusHandler = new StatusHandler();

        PeminjamanService peminjaman = new PeminjamanService(statusHandler);
        
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

interface IHitungDenda {
    double hitung(int hariTerlambat);
}

interface ICekStatus {
    void cekStatus(String status);
}

interface IFormatLaporan {
    void buat();
}

interface IPencetakLaporan {
    void cetak(String teks);
}

interface IPenyimpanan {
    void simpan(String data);
}

class DendaFiksi implements IHitungDenda {
    @Override
    public double hitung(int hariTerlambat) {
        return hariTerlambat * 1000;
    }
}

class DendaReferensi implements IHitungDenda {
    @Override
    public double hitung(int hariTerlambat) {
        return hariTerlambat * 3000;
    }
}

class DendaMajalah implements IHitungDenda {
    @Override
    public double hitung(int hariTerlambat) {
        return hariTerlambat * 500;
    }
}

class StatusHandler implements ICekStatus {
    @Override
    public void cekStatus(String status) {
        IStatusPeminjaman handler;

        switch (status) {
            case "dipinjam"      -> handler = new StatusDipinjam();
            case "dikembalikan"  -> handler = new StatusDikembalikan();
            case "terlambat"     -> handler = new StatusTerlambat();
            default              -> handler = new StatusTidakDiketahui();
        }

        handler.tampilkan();
    }
}

interface IStatusPeminjaman {
    void tampilkan();
}

class StatusDipinjam implements IStatusPeminjaman {
    @Override
    public void tampilkan() {
        System.out.println("[STATUS] Buku sedang dipinjam.");
    }
}

class StatusDikembalikan implements IStatusPeminjaman {
    @Override
    public void tampilkan() {
        System.out.println("[STATUS] Buku sudah dikembalikan.");
    }
}

class StatusTerlambat implements IStatusPeminjaman {
    @Override
    public void tampilkan() {
        System.out.println("[STATUS] Buku terlambat dikembalikan, kena denda!");
    }
}

class StatusTidakDiketahui implements IStatusPeminjaman {
    @Override
    public void tampilkan() {
        System.out.println("[STATUS] Status tidak diketahui.");
    }
}

class LaporanService {

    private java.util.List<IFormatLaporan> formatList = new java.util.ArrayList<>();

    public void tambahFormat(IFormatLaporan format) {
        formatList.add(format);
    }

    public void buatSemuaLaporan() {
        for (IFormatLaporan format : formatList) {
            format.buat();
        }
    }
}

class LaporanCetak implements IFormatLaporan {

    // DIP FIX 3: depend on IPencetakLaporan (abstraksi), disuntik via constructor
    private IPencetakLaporan printer;

    public LaporanCetak(IPencetakLaporan printer) {
        this.printer = printer;
    }

    @Override
    public void buat() {
        printer.cetak("Laporan peminjaman dicetak.");
    }
}

class LaporanEmail implements IFormatLaporan {
    @Override
    public void buat() {
        System.out.println("[EMAIL] Laporan dikirim via email.");
    }
}

class LaporanFile implements IFormatLaporan {
    @Override
    public void buat() {
        try (FileWriter fw = new FileWriter("laporan.txt", true)) {
            fw.write("Laporan peminjaman disimpan.\n");
            System.out.println("[FILE] Laporan disimpan ke file.");
        } catch (IOException e) {
            e.printStackTrace();
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
