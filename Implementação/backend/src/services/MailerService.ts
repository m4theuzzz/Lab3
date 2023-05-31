import { Email } from "../views/EmailView";
import { Mailer } from "../modules/Mailer";

const mailer = new Mailer();

export class MailerService {
    static sendEmail = async (info: Email) => {
        console.log({ info })
        return await mailer.sendMessage(info);
    }
}
