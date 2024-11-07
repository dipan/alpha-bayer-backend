import JWTUtility from "../../../util/jwt.utility";
import logger from "../../../util/logger/logger";
import SecurityUtility from "../../../util/security/securityUtility";
import ResidentService from "../../v0/resident/resident.service";
import SuperAdminService from "../../v0/superadmin/superadmin.service";
import UserService from "../../v0/user/user.service";

export default class AuthService {
  private userService: UserService;
  private residentService: ResidentService;

  constructor() {
    this.userService = new UserService();
    this.residentService = new ResidentService();
  }

  async userLogin(headers: any) {
    const { username, password } = headers;
    logger.debug(`ResidentService: getResidents ${username}`);
    const user = await this.userService.findByUsername(username);
    const memberDetails = await this.residentService.findByField(
      "email",
      username
    );
    if (!user) {
      throw new Error(`User[${username}] is not found`);
    }
    if (!SecurityUtility.verifyPassword(password, user.password)) {
      throw new Error(`Incorrect password provided, please try again`);
    }
    const { flatId, isCommiteeMember, roles } = memberDetails;
    const expirationTimeConfig = {
      ADMIN: "7D",
      GUEST: "15D",
      STAFF: "30D",
    };
    const token = JWTUtility.generateToken({
      id: user._id,
      username: user.username,
      roles: user.roles,
      memberDetails: { flatId, isCommiteeMember, roles },
    });
    return { username, token, residentDetails: memberDetails };
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
