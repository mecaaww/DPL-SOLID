
class NotificationService { sendMessage() {} }

class WhatsAppNotification extends NotificationService {

    sendMessage() { console.log("Kirim notifikasi WhatsApp"); }

}

class EmailNotification extends NotificationService {

    sendMessage() { console.log("Kirim notifikasi Email"); }

}


class AppointmentService {
    constructor() {
        this.notification = new WhatsAppNotification();
    }
    bookAppointment() {
        console.log("Appointment berhasil");
        this.notification.sendMessage();
    }
}

class CashPayment {
    pay() {
        console.log("Bayar Tunai");
    }
}

class PaymentService {
    constructor() {
        this.payment = new CashPayment();
    }
    processPayment() {
        this.payment.pay();
    }
}

class MySQLDatabase {
    connect() {
        console.log("Connect MySQL");
    }
}

class MedicalRecordService {
    constructor() {
        this.db = new MySQLDatabase();
    }
    saveRecord() {
        this.db.connect();
        console.log("Data rekam medis disimpan");
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
