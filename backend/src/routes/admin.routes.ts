import { Router } from "express";
import { UserController } from "../controllers/user.controller.ts";
import { UserService } from "../services/user.service.ts";
import { JwtAdapter } from "../adapters/jwt.adapter.ts";
import { authenticate, authorize } from "../middlewares/auth.ts";

const userController = new UserController(new UserService());

export class AdminRoutes {
    static get router(): Router {
        const router = Router();

        // every admin route needs a valid token and the admin role
        router.use(authenticate(new JwtAdapter()), authorize("admin"));
        router.get("/users", userController.list);

        return router;
    }
}
