import UserEntity from "../../../entity/mongo/impl/user.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import UserRepository from "../../../repository/mongo/impl/user.repository";
import logger from "../../../util/logger/logger";
import SecurityUtility from "../../../util/security/securityUtility";
import StringUtility from "../../../util/string.utility";
import EmailService from "../email/email.service";

export default class UserService {
  private repository: UserRepository;
  private emailService: EmailService;
  private societyName = "Oaksone Lakeview Apartments";

  constructor() {
    this.repository = new UserRepository(new UserEntity({}));
    this.emailService = new EmailService();
  }

  async addUser(user: any) {
    logger.debug(`ADD: resident for ${user}`);
    user.email = String(user.email).toLowerCase();
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      throw new Error(`User[${user.email}] already registered!`);
    }
    user.password = StringUtility.isEmptyOrNull(user.password)
      ? ""
      : SecurityUtility.createHashedPassword(user.password);
    if (!user.password) {
      user.otp = SecurityUtility.generateOTP(10);
    }
    const newUser = await this.repository.create(user);
    return newUser;
  }

  async getUsers(options: any) {
    logger.debug(`ResidentService: getResidents ${options}`);
    return await this.repository.readWithFilter({
      username: { $ne: "super_admin@super.admin" },
    });
  }

  async updateUserById(id: string, user: any) {
    logger.debug(`UPDATE: updateUserById for ${id}`);
    return await this.repository.updateById(id, user);
  }

  async deletUserById(id: string) {
    logger.debug(`DELETE: deletUserById for ${id}`);
    return await this.repository.deleteById(id);
  }

  async findById(id: string): Promise<TBasicMongoEntity> {
    return await this.repository.readById(id);
  }

  async findByEmail(email: string): Promise<TBasicMongoEntity> {
    return await this.repository.findOne("email", email);
  }
}
