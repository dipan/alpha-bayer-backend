import { Options } from "nodemailer/lib/mailer";
import UserNotification from "../notification";
import SMTPService from "../smtp.service";
import logger from "../../util/logger/logger";
import config from "../../config/config";

export default class GoogleMailNotification
  extends SMTPService
  implements UserNotification
{
  constructor(mailOptions: Options) {
    const transportOptions = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "mandal.common@gmail.com",
        pass: config.smtp.googlePassword,
      },
      tls: { rejectUnauthorized: true },
    };
    super(transportOptions);
    this.verifyTransport((error, success) => {
      if (error) {
        logger.error("Transporter verification failed:", error);
      } else {
        logger.debug("Transporter verified:", success);
      }
    });
    this.setMailOptions(mailOptions);
  }

  protected setMailOptions(mailOptions: Options): void {
    this.mailOptions = {
      sender: { name: "Dipan Mandal", address: "mandal.common@gmail.com" },
      to: mailOptions.to ?? {
        name: "Dipan Common",
        address: "mandal.common@gmail.com",
      },
      cc: mailOptions.cc ?? "",
      bcc: mailOptions.bcc ?? "",
      replyTo: mailOptions.replyTo ?? {
        name: "Dipan Dev",
        address: "info@dipan.dev",
      },
      subject: mailOptions.subject ?? "Notification Service",
      html: mailOptions.html,
    };
  }

  notify(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.sendMail()
        .then((messageInfo) => {
          console.log(messageInfo);
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          reject(false);
        });
    });
  }
}
