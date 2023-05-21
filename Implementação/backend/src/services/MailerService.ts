import { Email } from "../views/EmailView";
import { Mailer } from "../modules/Mailer";

const { sendMessage } = new Mailer();

export class MailerService {
    static sendEmail = async (info: Email) => {
        return await sendMessage(info);
    }
}
