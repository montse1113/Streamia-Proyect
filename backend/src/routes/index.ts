import { Router } from "express";
import { AuthRoutes } from "./auth.routes.ts";
import { TitleRoutes } from "./title.routes.ts";
import { GenreRoutes } from "./genre.routes.ts";
import { UserRoutes } from "./user.routes.ts";
import { AdminRoutes } from "./admin.routes.ts";

export class AppRoutes {
    static get router(): Router {
        const router = Router();

        router.get("/v1/health", (_req, res) => {
            res.json({ status: "ok" });
        });
        router.use("/v1/auth", AuthRoutes.router);
        router.use("/v1/titles", TitleRoutes.router);
        router.use("/v1/genres", GenreRoutes.router);
        router.use("/v1/users", UserRoutes.router);
        router.use("/v1/admin", AdminRoutes.router);


        return router;
    }
}