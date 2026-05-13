
class NotificationService { sendMessage() {} }

class WhatsAppNotification extends NotificationService {

    sendMessage() { console.log("Kirim notifikasi WhatsApp"); }

}

class EmailNotification extends NotificationService {

    sendMessage() { console.log("Kirim notifikasi Email"); }

}


class AppointmentService {
    constructor(notification) { // ✅ terima dari luar

        this.notification = notification;

    }
    
    bookAppointment() {
        console.log("Appointment berhasil");
        this.notification.sendMessage();
    }
}

class PaymentMethod { pay(amount) {} }

class CashPayment extends PaymentMethod {

    pay(amount) { console.log(`Bayar Tunai: Rp${amount}`); }

}

class BPJSPayment extends PaymentMethod {

    pay(amount) { console.log(`Klaim BPJS: Rp${amount}`); }

}

class PaymentService {
  constructor(paymentMethod) {
    this.payment = paymentMethod;
}
processPayment(amount) {
    this.payment.pay(amount);
}

class MySQLDatabase {
    connect() {
        console.log("Connect MySQL");
    }
}

class MedicalRecordService {
      constructor(database) { // ✅ terima dari luar

        this.db = database;
    }
    saveRecord(data) {

        this.db.connect();

        this.db.save(data);

        console.log("Data rekam medis disimpan");


class MedicalRecordService {
    constructor(database) { ... }
    saveRecord(data) { ... }
}  
    }

console.log("=== SISTEM APPOINTMENT ===");
const appointmentService = new AppointmentService();
appointmentService.bookAppointment();

console.log("\n=== SISTEM PEMBAYARAN ===");
const paymentService = new PaymentService();
paymentService.processPayment();

console.log("\n=== SISTEM REKAM MEDIS ===");
const medicalRecordService = new MedicalRecordService();
medicalRecordService.saveRecord();
