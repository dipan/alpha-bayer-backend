import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import logger from "../../../util/logger/logger";
import SecurityUtility from "../../../util/security/securityUtility";
import EmailService from "../email/email.service";
import ResidentService from "../resident/resident.service";
import UserService from "../user/user.service";

export default class SuperAdminService {
  private userService: UserService;
  private residentService: ResidentService;
  private emailService: EmailService;

  constructor() {
    this.userService = new UserService();
    this.residentService = new ResidentService();
    this.emailService = new EmailService();
  }

  async userSignUp(username: any) {
    logger.debug(`ADD: resident for ${username}`);
    username = String(username).toLowerCase();
    let user = await this.userService.findByUsername(username);
    const memberDetails = await this.residentService.findByField(
      "email",
      username
    );
    if (!user) {
      if (!memberDetails) {
        throw new Error(
          "Please request Commitee Members to add user as member"
        );
      }
      user = await this.userService.addUser({
        username,
        otp: SecurityUtility.generateOTP(9),
      });
    } else {
      user.otp = SecurityUtility.generateOTP(9);
      await this.userService.updateUserById(user._id, user);
    }
    const isEmailSent = await this.emailService.sendEmail(
      memberDetails.name,
      username,
      "Oakstone Lakeview: You are registered user",
      `<h3>Follow below link to set your password</h3>
      <br/>
      <span>https://oakstone-lakeview.vercel.app/set-password?${user._id}=${user.otp}</span>`
    );
    return "Email Sent successfully";
  }
}
