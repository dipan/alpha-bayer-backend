import JWTUtility from "../../../util/jwt.utility";
import logger from "../../../util/logger/logger";
import SecurityUtility from "../../../util/security/securityUtility";
import SuperAdminService from "../../v0/superadmin/superadmin.service";
import UserService from "../../v0/user/user.service";

export default class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async userLogin(headers: any) {
    const { email, password } = headers;
    logger.debug(`ResidentService: getResidents ${email}`);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error(`User[${email}] is not found`);
    }
    if (!SecurityUtility.verifyPassword(password, user.password)) {
      throw new Error(`Incorrect password provided, please try again`);
    }
    const { flatId, isCommiteeMember, roles } = user;
    const token = JWTUtility.generateToken({
      id: user._id,
      username: user.username,
      role: user.role,
    });
    return { email, token, user };
  }

  async userSignUp(headers: any) {
    const { username, password } = headers;
    return await new SuperAdminService().userSignUp(username);
  }

  async userSetPassword(headers: any) {
    const { id, otp, password } = headers;
    logger.debug(`AuthService: userSetPassword`);
    const user = await this.userService.findById(id);
    if (user.otp != otp) {
      throw new Error("Opt did not match");
    }
    user.password = SecurityUtility.createHashedPassword(password);
    user.otp = null;
    this.userService.updateUserById(id, user);
    return "Password set successfully";
  }

  async deletResidentById(id: string) {
    logger.debug(`DELETE: deletResidentById for ${id}`);
    // return await this.repository.deleteById(id);
  }
}
