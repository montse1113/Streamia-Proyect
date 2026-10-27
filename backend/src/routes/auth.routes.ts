import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.ts";
import { AuthService } from "../services/auth.service.ts";
import { JwtAdapter } from "../adapters/jwt.adapter.ts";
import { loginValidator, registerValidator } from "../validators/auth.ts";
import { validate } from "../middlewares/validateData.ts";
import { loginLimiter } from "../middlewares/rateLimiter.ts";

const authController = new AuthController(new AuthService(new JwtAdapter()));

export class AuthRoutes {
  static get router(): Router {
    const router = Router();

    router.post("/register", registerValidator, validate, authController.register);
    router.post("/login", loginLimiter, loginValidator, validate, authController.login);

    return router;
  }
}
