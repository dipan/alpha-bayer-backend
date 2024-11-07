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
    user.username = String(user.username).toLowerCase();
    user.password = StringUtility.isEmptyOrNull(user.password)
      ? ""
      : SecurityUtility.createHashedPassword(user.password);
    if (!user.password) {
      user.otp = SecurityUtility.generateOTP(10);
    }
    const newUser = await this.repository.create(user);
    this.emailService.sendEmail(
      user.name,
      user.username,
      "New User Registration",
      `<div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
        
        <!-- Header Section -->
        <div style="background-color: #2c3e50; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to ${
              this.societyName
            }</h1>
        </div>

        <!-- Content Section -->
        <div style="padding: 20px; color: #333333;">
            <p style="font-size: 16px; line-height: 1.6;">Dear ${
              newUser.name
            },</p>
            <p style="font-size: 16px; line-height: 1.6;">
                We are thrilled to welcome you to ${
                  this.societyName
                }! Your registration is now complete, and you are part of our wonderful community.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
                As a registered member, you can access society updates, participate in events, and stay connected with other residents. To get started, please visit your profile dashboard and complete your personal details.
            </p>

            ${
              newUser.otp
                ? `<a href="https://oakstone-lakeview.vercel.app/set-password?${newUser._id}=${newUser.otp}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 20px;">Set Password</a>`
                : ""
            }

            <p style="font-size: 16px; line-height: 1.6;">
                If you have any questions or need assistance, feel free to reach out to us at [Support Email] or visit the society office during working hours.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
                Once again, welcome to ${
                  this.societyName
                }! We look forward to your active participation in making our community a better place to live.
            </p>

            <p style="font-size: 16px; line-height: 1.6;">Best regards,<br>The ${
              this.societyName
            } Team</p>
        </div>

        <!-- Footer Section -->
        <div style="background-color: #2c3e50; padding: 10px; text-align: center; color: #ffffff; font-size: 12px;">
            <p style="margin: 0;">&copy; 2024 ${
              this.societyName
            }. All rights reserved.</p>
        </div>
    </div>`,
      {
        name: "Oakstone Lakeview Apartments",
        email: "oakstonelakeview@gmail.com",
      },
      {
        name: "Oakstone Lakeview Apartments",
        email: "oakstonelakeview@gmail.com",
      }
    );
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

  async findByUsername(username: string): Promise<TBasicMongoEntity> {
    return await this.repository.findOne("username", username);
  }
}
