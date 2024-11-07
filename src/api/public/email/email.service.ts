import BrevoEmailNotification, {
  Contact,
} from "../../../notification/impl/brevoEmail.notification";

export default class EmailService {
  async sendEmail(
    recepientName: string,
    recepientEmail: string,
    subject: string,
    content: string,
    sender?: Contact,
    replyTo?: Contact
  ): Promise<boolean> {
    const notification: BrevoEmailNotification = new BrevoEmailNotification(
      [{ name: recepientName.toString(), email: recepientEmail.toString() }],
      content
    );
    notification.subject = subject;
    if (sender) {
      notification.sender = sender;
    }
    if (replyTo) {
      notification.replyTo = replyTo;
    }
    return await notification.notify();
  }
}
