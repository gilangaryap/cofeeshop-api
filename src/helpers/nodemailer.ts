import transporter from "../configs/email";

interface EmailMessage {
    from: string;
    to: string;
    subject: string;
    html: string;
}

const createEmail = (email: string): EmailMessage => {
    const emailObj: EmailMessage = {
        from: process.env.FROM_GMAIL || '',
        to: email,
        subject: "Selamat! Anda Telah Terdaftar di Coffee Shop Kami",
        html: `
            <p>Halo!</p>
            <p>Selamat! Anda telah berhasil terdaftar di coffee shop kami. Terima kasih telah bergabung.</p>
            <p>Nantikan promo menarik lainnya yang akan segera hadir untuk Anda.</p>
            <p>Jika ada pertanyaan, jangan ragu untuk menghubungi kami.</p>
            <p>Salam hangat,</p>
            <p>Tim Coffee Shop</p>
        `
    };
    return emailObj;
};


const sendMail = (email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(createEmail(email), (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log("Email sent: " + info.response);
                resolve(true);
            }
        });
    });
};

export default sendMail;