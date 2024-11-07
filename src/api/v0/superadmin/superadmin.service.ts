import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import logger from "../../../util/logger/logger";
import SecurityUtility from "../../../util/security/securityUtility";
import EmailService from "../email/email.service";
import UserService from "../user/user.service";

export default class SuperAdminService {
  private userService: UserService;
  private emailService: EmailService;

  constructor() {
    this.userService = new UserService();
    this.emailService = new EmailService();
  }

  async userSignUp(username: any) {
    logger.debug(`ADD: resident for ${username}`);
    username = String(username).toLowerCase();
    let user = await this.userService.findByEmail(username);
    if (!user) {
      user = await this.userService.addUser({
        username,
        otp: SecurityUtility.generateOTP(9),
      });
    } else {
      user.otp = SecurityUtility.generateOTP(9);
      await this.userService.updateUserById(user._id, user);
    }
    const isEmailSent = await this.emailService.sendEmail(
      user.name,
      username,
      "Oakstone Lakeview: You are registered user",
      `<h3>Follow below link to set your password</h3>
      <br/>
      <span>https://oakstone-lakeview.vercel.app/set-password?${user._id}=${user.otp}</span>`
    );
    return "Email Sent successfully";
  }

  async registerSuperAdmin() {
    const email = "superadmin@hcl.test";
    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.addUser({
        email,
        password: await SecurityUtility.hasPassword("SuperAdmin!123"),
      });
    }
  }
}
