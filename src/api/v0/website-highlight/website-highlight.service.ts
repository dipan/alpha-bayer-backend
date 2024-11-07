import AllowedOriginEntity from "../../../entity/mongo/impl/allowed-origin.entity";
import { TBasicMongoEntity } from "../../../entity/mongo/mongo.entity";
import AllowedOriginRepository from "../../../repository/mongo/impl/allowed-origin.repository";
import logger from "../../../util/logger/logger";

interface Highlight {
  text?: string;
  image?: string;
  isImportant?: boolean;
}

export default class WebsiteHighlightService {
  private repository: AllowedOriginRepository;

  constructor() {
    this.repository = new AllowedOriginRepository(new AllowedOriginEntity({}));
  }

  async addWebsiteHighlight(
    origin: string,
    { text, image, isImportant = false }: Highlight
  ) {
    logger.debug(`ADD: hightlights for ${origin}`);
    const res: TBasicMongoEntity = await this.findByOrigin(origin);
    res.highlights.unshift({ text, image, isImportant });
    const maxSize = res.highlightsLength ?? 5;
    if (res.highlights.length > maxSize) {
      res.highlights.pop();
    }
    return await this.repository.updateById(res._id, res);
  }

  async getWebsiteHighlightsByOrigin(origin: string) {
    logger.debug(`READ: hightlights for ${origin}`);
    return await this.repository.findOne("origin", origin);
  }

  async updateWebsiteHighlightByOrigin(
    origin: string,
    index: number,
    { text, image, isImportant = false }: Highlight
  ) {
    logger.debug(`UPDATE: hightlight for ${origin}[${index}]`);
    const res: TBasicMongoEntity = await this.findByOrigin(origin);
    if (index < 0 || index >= res?.highlights?.length) {
      throw new Error("Index out of bounds");
    }
    res.highlights[index] = { text, image, isImportant };
    return await this.repository.updateById(res._id, res);
  }

  async deleteWebsiteHighlightByOrigin(origin: string, index: number) {
    logger.debug(`DELETE: hightlight for ${origin}[${index}]`);
    const res: TBasicMongoEntity = await this.findByOrigin(origin);
    if (index < 0 || index >= res?.highlights?.length) {
      throw new Error("Index out of bounds");
    }
    res.highlights.splice(index, 1);
    return await this.repository.updateById(res._id, res);
  }

  private async findByOrigin(origin: string): Promise<TBasicMongoEntity> {
    return await this.repository.findOne("origin", origin);
  }
}
