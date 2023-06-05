import * as mailer from 'nodemailer';
import { Email } from '../views/EmailView';

export class Mailer {
    transporter: any = null;

    constructor() {
        this.transporter = this.buildTransporter();
    }

    private buildTransporter = () => {
        const smtpPort = 587;
        return mailer.createTransport({
            pool: true,
            host: process.env.SMTP,
            port: smtpPort,
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_EMAIL_PASS
            },

        });
    }

    sendMessage = async (emailInfo: Email) => {
        return await this.transporter.sendMail({
            from: emailInfo.from ?? `"EduCoin" <${process.env.APP_EMAIL}>`,
            to: `${emailInfo.to}`,
            subject: emailInfo.subject,
            text: emailInfo.text ?? null,
            html: emailInfo.html ?? null
        }, (err: any, info: any) => {
            if (err) {
                console.log(err);
                return err;
            }

            return info;
        });
    }
}
