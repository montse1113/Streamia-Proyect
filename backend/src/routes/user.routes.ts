import { Router } from "express";
import { UserController } from "../controllers/user.controller.ts";
import { UserService } from "../services/user.service.ts";
import { JwtAdapter } from "../adapters/jwt.adapter.ts";
import { authenticate } from "../middlewares/auth.ts";

const userController = new UserController(new UserService());

export class UserRoutes {
    static get router(): Router {
        const router = Router();

        router.get("/me", authenticate(new JwtAdapter()), userController.me);

        return router;
    }
}
