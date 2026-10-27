import express, { type Express, type Router } from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.ts";

type ServerOptions = {
  port: number;
  routes: Router;
  frontendUrl: string;
};

export class Server {
  public readonly app: Express;
  private readonly port: number;

  constructor(options: ServerOptions) {
    this.port = options.port;
    this.app = express();

    this.app.use(helmet());
    this.app.use(cors({ origin: options.frontendUrl }));
    this.app.use(express.json());
    this.app.use("/api", options.routes);
    this.app.use(errorHandler);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`server running on port: ${this.port}`);
    });
  }
}