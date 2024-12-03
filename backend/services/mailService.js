// // mailService.js
// import 'dotenv/config';
// import nodemailer from 'nodemailer';


// let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587, // Cambiado a 587
//     secure: false, // Cambiado a false para STARTTLS
//     auth: {
//         user: "rogeliosuleta@gmail.com",
//         pass: process.env.PASSWORD_NODEMAILER,
//     },
// });


// export const sendReminderEmail = (email, task) => {
//     const mailOptions = {
//         from: 'rogeliosuleta@gmail.com',    
//         to: email,
//         subject: 'Recordatorio de Tarea',
//         text: `Tienes una tarea pendiente: ${task.title}\nDescripción: ${task.description}`
//     };

//     return transporter.sendMail(mailOptions);
// };
