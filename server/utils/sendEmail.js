import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }

})



export const sendEmail = async ({to, subject, html}) => {
    console.log("Sending email to:", to);

    if (!to) {
        throw new Error("sendEmail missing recipient");
    }

    try{
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
        console.log("Email sent successfully.", info.messageId);
        return info;
    } catch (error) {
        console.log("Email Failed: ", error);
        throw error;
    }
}