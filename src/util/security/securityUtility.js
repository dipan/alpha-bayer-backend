"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var bcrypt_1 = require("bcrypt");
var SecurityUtility = /** @class */ (function () {
    function SecurityUtility() {
    }
    SecurityUtility.encrypt = function (plaintext) {
        return CryptoJS.AES.encrypt(plaintext, this.secretKey).toString();
    };
    SecurityUtility.decrypt = function (encryptedText) {
        return CryptoJS.AES.decrypt(encryptedText, this.secretKey).toString(CryptoJS.enc.Utf8);
    };
    SecurityUtility.createHashedPassword = function (password) {
        var saltRounds = 15;
        var hashedPassword = bcrypt_1.default.hashSync(password, saltRounds);
        return hashedPassword;
    };
    SecurityUtility.verifyPassword = function (password, hashedPassword) {
        var isMatch = bcrypt_1.default.compareSync(password, hashedPassword);
        return isMatch;
    };
    SecurityUtility.generateOTP = function (length) {
        if (length === void 0) { length = 6; }
        var characters = "0123456789"; // Characters to use for OTP
        var otp = "";
        for (var i = 0; i < length; i++) {
            var randomIndex = crypto_1.default.randomInt(0, characters.length);
            otp += characters[randomIndex];
        }
        return otp;
    };
    SecurityUtility.secretKey = "_ThisIsASecretKey_";
    return SecurityUtility;
}());
exports.default = SecurityUtility;
