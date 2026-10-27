import { Router } from "express";
import { GenreController } from "../controllers/genre.controller.ts";
import { GenreService } from "../services/genre.service.ts";

const genreController = new GenreController(new GenreService());

export class GenreRoutes {
    static get router(): Router {
        const router = Router();

        router.get("/", genreController.list);

        return router;
    }
}
