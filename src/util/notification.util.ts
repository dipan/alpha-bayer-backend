import BrevoEmailNotification from "../notification/impl/brevoEmail.notification";
import UserNotification from "../notification/notification";

export default class UserNotificationUtility {
  static emailOtp(name: string, email: string, otp: string): Promise<boolean> {
    const notification: UserNotification = new BrevoEmailNotification(
      [{ name, email }],
      `Your otp is: ${otp}`
    );
    return notification.notify();
  }
}
