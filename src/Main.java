import java.util.List;
import java.util.Map;

public class Main {

    public static void main(String[] args) {

        List<Map<String, Object>> items = List.of(
                Map.of("nama", "Nasi Goreng", "harga", 15000, "qty", 2),
                Map.of("nama", "Es Teh",      "harga", 5000,  "qty", 3),
                Map.of("nama", "Ayam Bakar",  "harga", 25000, "qty", 1)
        );

        ProgramKasir program = new ProgramKasir();
        program.jalankanProgram(items);
    }
}