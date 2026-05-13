class GeneralDoctor {

    public void checkPatient() {
        System.out.println("Dokter umum memeriksa pasien");
    }
}

class HospitalService {

    private GeneralDoctor doctor = new GeneralDoctor();

    public void servicePatient() {

        doctor.checkPatient();

        System.out.println("Pelayanan pasien selesai");
    }
}

public class Main {

    public static void main(String[] args) {

        HospitalService service = new HospitalService();

        service.servicePatient();
    }
}
