import config from "../config/config";
import { DatabaseManager } from "../db/mongodb-manager";
import StringUtility from "./string.utility";

class DatabaseUtility {
  static createNewObjectWithNonNullValues(source: any): any {
    const result: any = {};
    for (const key in source) {
      if (!StringUtility.isEmptyOrNull(String(source[key]))) {
        result[key] = source[key];
      }
    }
    return result;
  }

  static getUpdateQueryWithNotNullFields(data: any) {
    const updateQuery: any = {};
    updateQuery.$set = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined || value !== null) {
        updateQuery["$set"][key] = value;
      }
    }
  }

  static async renameField(
    collectionName: string,
    oldFieldName: string,
    newFieldName: string
  ) {
    const updateQuery: any = {};
    updateQuery.$set = {};
    DatabaseManager.getInstance()
      .getConnection(config.mongodb.collection)
      ?.collection(collectionName);
  }
}

export default DatabaseUtility;
