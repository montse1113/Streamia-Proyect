import dotenv from "dotenv";
import { Server } from "./server.ts";
import sequelizeConnection from "./conf/sequelize.connection.ts";
import { AppRoutes } from "./routes/index.ts";

dotenv.config({ quiet: true });

const port = Number(process.env.PORT);
const frontendUrl = process.env.FRONTEND_URL ?? "";

async function main() {
  try {
    await sequelizeConnection.connect();
    const server = new Server({ port, routes: AppRoutes.router, frontendUrl });
    server.start();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();