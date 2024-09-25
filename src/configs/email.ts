import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: process.env.SERVICE_MAIL,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
    },
}); 
export default transporter;