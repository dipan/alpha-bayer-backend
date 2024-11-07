import mongoose, { ClientSession, Connection, Model } from "mongoose";
import logger from "../util/logger/logger";

export class DatabaseManager {
  private static instance: DatabaseManager;
  private connections: Map<string, Connection>;

  private constructor() {
    this.connections = new Map<string, Connection>();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async connect(uri: string, dbName: string): Promise<void> {
    if (!this.connections.has(dbName)) {
      const connection = await mongoose.createConnection(uri, {
        dbName,
      });
      this.connections.set(dbName, connection);
      logger.info(`Connect to database: ${uri} ${dbName}`);
    }
  }

  public getConnection(dbName: string): Connection | undefined {
    return this.connections.get(dbName);
  }

  public getModel<T extends Document>(
    connection: Connection,
    modelName: string
  ): Model<T> {
    return mongoose.model<T>(modelName);
  }

  public async startSession(
    dbName: string
  ): Promise<ClientSession | undefined> {
    const connection = this.connections.get(dbName);
    if (connection) {
      return await connection.startSession();
      //   return connection;
    }
    return undefined;
  }

  public async endSession(session: ClientSession): Promise<void> {
    await session.endSession();
  }
}
