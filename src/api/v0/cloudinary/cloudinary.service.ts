import { v2 as cloudinary } from "cloudinary";
import path from "path";
import logger from "../../../util/logger/logger";

export default class CloudinaryService {
  private _tokenPayload: any;

  constructor() {
    cloudinary.config({
      cloud_name: "duvts7es5",
      api_key: "419173922449381",
      api_secret: "BA8b5C_o4owlxiFHwPOotf21wrU",
    });
  }

  set tokenPayload(payload: any) {
    this._tokenPayload = payload;
  }

  async getFiles() {
    // const files = await cloudinary.api.resources_by_asset_folder("societyId");
    const files = await cloudinary.api.resources({});
    return files;
  }

  async uploadFile(filePath: string) {
    const uplodaResult = await cloudinary.uploader.upload(filePath, {
      folder: "societyId",
      use_filename: true,
      filename_override: filePath.substring(filePath.lastIndexOf(path.sep) + 1),
    });
    logger.info(uplodaResult);
    return uplodaResult;
  }
}
