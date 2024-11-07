import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";

export default abstract class SMTPService {
  private transporter;
  protected mailOptions: Options = {};

  constructor(transportOptions: any) {
    this.transporter = nodemailer.createTransport(transportOptions);
  }

  protected abstract setMailOptions(mailOptions: Options): void;

  public sendMail(): Promise<any> {
    return this.transporter.sendMail(this.mailOptions);
  }

  protected verifyTransport(
    callback: (err: Error | null, success: true) => void
  ) {
    this.transporter.verify(callback);
  }
}
