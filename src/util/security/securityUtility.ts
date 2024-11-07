import CryptoJs from "crypto-js";
import crypto from "crypto";
import bcrypt from "bcrypt";

class SecurityUtility {
  private static secretKey = "_ThisIsASecretKey_";

  static encrypt(plaintext: string): string {
    return CryptoJS.AES.encrypt(plaintext, this.secretKey).toString();
  }

  static decrypt(encryptedText: string): string {
    return CryptoJS.AES.decrypt(encryptedText, this.secretKey).toString(
      CryptoJS.enc.Utf8
    );
  }

  static createHashedPassword(password: string): string {
    const saltRounds = 15;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
  }

  static async hasPassword(password: string): Promise<string> {
    const saltRounds = 15;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  static verifyPassword(password: string, hashedPassword: string): boolean {
    const isMatch = bcrypt.compareSync(password, hashedPassword);
    return isMatch;
  }

  static generateOTP(length: number = 6): string {
    const characters = "0123456789"; // Characters to use for OTP
    let otp = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, characters.length);
      otp += characters[randomIndex];
    }

    return otp;
  }
}

export default SecurityUtility;
