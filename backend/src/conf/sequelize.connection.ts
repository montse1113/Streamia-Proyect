import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, ENVIRONMENT } = process.env;

export class SequelizeConnection {
  private readonly sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
      host: DB_HOST!,
      port: Number(DB_PORT),
      dialect: "mysql",
      logging: ENVIRONMENT === "PRODUCTION" ? false : console.log,
    });
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  // tables are created by database/schema.sql, so we only check the connection
  public async connect(): Promise<void> {
    await this.sequelize.authenticate();
  }

  public async disconnect(): Promise<void> {
    await this.sequelize.close();
  }
}

const sequelizeConnection = new SequelizeConnection();

export default sequelizeConnection;