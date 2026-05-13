import java.util.ArrayList;
import java.util.List;

public class ProgramCatatanTugas {

    public void jalankanProgram() {

        System.out.println("==================================================");
        System.out.println("           Aplikasi Catatan Tugas                 ");
        System.out.println("==================================================");

        List<ITugasTampil> semuaTugas = new ArrayList<>();
        List<ISubmittable> bisaSubmit = new ArrayList<>();
        List<IEditable>    bisaEdit   = new ArrayList<>();
        List<IDeletable>   bisaHapus  = new ArrayList<>();
 
        TugasBiasa biasa = new TugasBiasa("Belajar Java", "Pelajari OOP dan SOLID");
        semuaTugas.add(biasa);
        bisaSubmit.add(biasa);
        bisaEdit.add(biasa);
        bisaHapus.add(biasa);

        TugasDraft draft = new TugasDraft("Laporan PKL", "Cicil laporan PKL bab 1");
        semuaTugas.add(draft);
        bisaEdit.add(draft);
        bisaHapus.add(draft);

        System.out.println("\n--- Daftar Tugas ---");
        for (Tugas t : daftarTugas) {
            t.tampilkan();
        }

        System.out.println("\n--- Proses Submit ---");
        for (Tugas t : daftarTugas) {
            try {
                t.submit();
            } catch (UnsupportedOperationException e) {
                System.out.println("[ERROR] " + t.getJudul() + ": " + e.getMessage());
            }
        }

        System.out.println("\n--- Proses Edit ---");
        for (Tugas t : daftarTugas) {
            try {
                t.edit("Konten diperbarui");
            } catch (UnsupportedOperationException e) {
                System.out.println("[ERROR] " + t.getJudul() + ": " + e.getMessage());
            }
        }

        System.out.println("\n--- Proses Hapus ---");
        for (Tugas t : daftarTugas) {
            try {
                t.hapus();
            } catch (UnsupportedOperationException e) {
                System.out.println("[ERROR] " + t.getJudul() + ": " + e.getMessage());
            }
        }

        System.out.println("==================================================");
        System.out.println("  Program selesai.");
        System.out.println("==================================================");
    }
}

class Tugas {

    protected String judul;
    protected String deskripsi;

    public Tugas(String judul, String deskripsi) {
        this.judul     = judul;
        this.deskripsi = deskripsi;
    }

    public String getJudul() {
        return judul;
    }

    public void tampilkan() {
        System.out.println("[TUGAS] " + judul + " - " + deskripsi);
    }

    public void submit() {
        System.out.println("[SUBMIT] Tugas '" + judul + "' berhasil disubmit.");
    }

    public void edit(String kontenBaru) {
        this.deskripsi = kontenBaru;
        System.out.println("[EDIT] Tugas '" + judul + "' berhasil diedit.");
    }

    public void hapus() {
        System.out.println("[HAPUS] Tugas '" + judul + "' berhasil dihapus.");
    }
}

class TugasBiasa extends Tugas {

    public TugasBiasa(String judul, String deskripsi) {
        super(judul, deskripsi);
    }

    @Override
    public void tampilkan() {
        System.out.println("[BIASA] " + judul + " - " + deskripsi);
    }
}

class TugasDraft extends Tugas implements IEditable, IDeletable {
 
    public TugasDraft(String judul, String deskripsi) {
        super(judul, deskripsi);
    }
 
    @Override
    public void tampilkan() {
        System.out.println("[DRAFT] " + judul + " - " + deskripsi);
    }
 
    @Override
    public void edit(String kontenBaru) {
        this.deskripsi = kontenBaru;
        System.out.println("[EDIT] Draft '" + judul + "' berhasil diedit.");
    }
 
    @Override
    public void hapus() {
        System.out.println("[HAPUS] Draft '" + judul + "' berhasil dihapus.");
    }
}

class TugasReadOnly extends Tugas {

    public TugasReadOnly(String judul, String deskripsi) {
        super(judul, deskripsi);
    }

    @Override
    public void tampilkan() {
        System.out.println("[READ-ONLY] " + judul + " - " + deskripsi);
    }

    @Override
    public void edit(String kontenBaru) {
        throw new UnsupportedOperationException(
                "Tugas read-only tidak bisa diedit!");
    }
}

class TugasArsip extends Tugas {

    public TugasArsip(String judul, String deskripsi) {
        super(judul, deskripsi);
    }

    @Override
    public void tampilkan() {
        System.out.println("[ARSIP] " + judul + " - " + deskripsi);
    }

    @Override
    public void hapus() {
        throw new UnsupportedOperationException(
                "Tugas arsip tidak bisa dihapus langsung!");
    }
}
