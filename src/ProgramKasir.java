import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class ProgramKasir {

    public double jalankanProgram(List<Map<String, Object>> items) {

        System.out.println("==================================================");
        System.out.println("                    Kasir Restoran                ");
        System.out.println("==================================================");

        IPerhitungan perhitungan = new KasirDigital();
        ICetakStruk cetakStruk   = new KasirDigital();
        TransaksiService transaksi = new TransaksiService(perhitungan, cetakStruk);
        double total = transaksi.prosesTransaksi(items);
 
        IPenyimpanan penyimpanan = new Database();
        IPencetak pencetak       = new PrinterThermal();
        LaporanService laporan = new LaporanService(penyimpanan, pencetak);
        laporan.buatLaporan(total);

        System.out.println("==================================================");
        System.out.printf("  Total Pembayaran : Rp %.0f%n", total);
        System.out.println("==================================================");

        return total;
    }
}

//sebelumnya 1 interface dengan banyak method, sekarang dipecah menjadi interface kecil-kecil sesuai tangung jawabnya.
interface IPerhitungan {
    double hitungTotal(List<Map<String, Object>> items);
}

interface ICetakStruk {
    void cetakStruk(double total);
}
 
interface ISimpanLaporan {
    void simpanLaporan(double total);
}

interface IKasirDigitalFitur {
    void scanBarcode(String kode);
    void bayarDenganKartu(double jumlah);
}
 
interface IKirimEmail {
    void kirimEmail(double total);
}

interface IPenyimpanan {
    void simpan(String data);
}
 
interface IPencetak {
    void cetak(String teks);
}

class KasirManual implements MesinKasir {

    @Override
    public double hitungTotal(List<Map<String, Object>> items) {
        double total = 0;
        for (Map<String, Object> item : items) {
            int harga = (int) item.get("harga");
            int qty   = (int) item.get("qty");
            total += harga * qty;
        }
        return total;
    }

    @Override
    public void cetakStruk(double total) {
        System.out.printf("[STRUK] Total: Rp %.0f%n", total);
    }

    @Override
    public void simpanLaporan(double total) {
        try (FileWriter fw = new FileWriter("laporan.txt", true)) {
            fw.write("Total: Rp " + total + "\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void kirimEmail(double total) {
        System.out.printf("[EMAIL] Mengirim total Rp %.0f%n", total);
    }

    @Override
    public void scanBarcode(String kode) {
        throw new UnsupportedOperationException("Kasir manual tidak punya scanner!");
    }

    @Override
    public void bayarDenganKartu(double jumlah) {
        throw new UnsupportedOperationException("Kasir manual tidak menerima kartu!");
    }
}

class KasirDigital implements MesinKasir {

    @Override
    public double hitungTotal(List<Map<String, Object>> items) {
        double total = 0;
        for (Map<String, Object> item : items) {
            int harga = (int) item.get("harga");
            int qty   = (int) item.get("qty");
            total += harga * qty;
        }
        return total;
    }

    @Override
    public void cetakStruk(double total) {
        System.out.printf("[DIGITAL STRUK] Total: Rp %.0f%n", total);
    }

    @Override
    public void simpanLaporan(double total) {
        try (FileWriter fw = new FileWriter("laporan_digital.txt", true)) {
            fw.write("Digital Total: Rp " + total + "\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void kirimEmail(double total) {
        System.out.printf("[EMAIL] Terkirim: Rp %.0f%n", total);
    }

    @Override
    public void scanBarcode(String kode) {
        System.out.println("[SCAN] Barcode " + kode + " berhasil dibaca");
    }

    @Override
    public void bayarDenganKartu(double jumlah) {
        System.out.printf("[KARTU] Pembayaran Rp %.0f diproses...%n", jumlah);
    }
}

class TransaksiService {

    private KasirDigital kasir;

    public TransaksiService() {
        this.kasir = new KasirDigital();
    }

    public double prosesTransaksi(List<Map<String, Object>> items) {
        double total = kasir.hitungTotal(items);
        kasir.cetakStruk(total);
        return total;
    }
}

class Database {
    public void simpan(String data) {
        System.out.println("[DB] Data disimpan: " + data);
    }
}

class PrinterThermal {
    public void cetak(String teks) {
        System.out.println("[PRINTER THERMAL] " + teks);
    }
}

class LaporanService {

    private Database db;
    private PrinterThermal printer;

    public LaporanService() {
        this.db      = new Database();
        this.printer = new PrinterThermal();
    }

    public void buatLaporan(double total) {
        db.simpan(String.format("Total penjualan: Rp %.0f", total));
        printer.cetak(String.format("Laporan: Rp %.0f", total));
    }
}


