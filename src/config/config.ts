import dotenv from "dotenv";
import path from "path";
import StringUtility from "../util/string.utility";

dotenv.config();

interface Config {
  version: string;
  host: string;
  port: number;
  srcDir: string;
  rootDir: string;
  jwt: { secret: string; expirationTime: string };
  allowedOrigins: string[];
  mongodb: {
    url: string;
    collection: string;
  };
  mysql: {
    host: string;
    user: string;
    password: string;
    database: string;
    url: string;
  };
  smtp: {
    googlePassword: string;
  };
}

const match = __dirname.match(new RegExp(/(.*src)(.*)/));

const config: Config = {
  version: process.env.VERSION || "0.0.0",
  host: process.env.HOST || "localhost",
  port: parseInt(process.env.PORT || "3000", 10),
  srcDir: match ? match[1] : "",
  rootDir: match ? match[1].substring(0, match[1].lastIndexOf(path.sep)) : "",
  jwt: {
    secret: process.env.JWT_SECRET || "<secret>",
    expirationTime: process.env.JWT_EXPIRATION || "30d",
  },
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || ["localhost"],
  mongodb: {
    url: StringUtility.parseStringWithPlaceholders(
      process.env.DB_MONGO_URL || "",
      process.env.DB_MONGO_USER || "",
      process.env.DB_MONGO_PWD || ""
    ),
    collection: process.env.DB_MONGO_COLLECTION || "development-testing",
  },
  mysql: {
    host: process.env.DB_MYSQL_HOST || "",
    user: process.env.DB_MYSQL_USER || "",
    password: process.env.DB_MYSQL_PWD || "",
    database: process.env.DB_MYSQL_DATABASE || "",
    url: StringUtility.parseStringWithPlaceholders(
      process.env.DB_MYSQL_URL || "",
      process.env.DB_MYSQL_USER || "",
      process.env.DB_MYSQL_PWD || ""
    ),
  },
  smtp: {
    googlePassword: process.env.GOOGLE_PASSWORD || "",
  },
};

export default config;
