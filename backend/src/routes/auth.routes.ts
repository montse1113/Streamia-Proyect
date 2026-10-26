import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.ts";
import { AuthService } from "../services/auth.service.ts";
import { registerValidator } from "../validators/auth.ts";
import { validate } from "../middlewares/validateData.ts";

const authController = new AuthController(new AuthService());

export class AuthRoutes {
  static get router(): Router {
    const router = Router();

    router.post("/register", registerValidator, validate, authController.register);

    return router;
  }
}
