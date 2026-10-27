import { Router } from "express";
import { TitleController } from "../controllers/title.controller.ts";
import { TitleService } from "../services/title.service.ts";
import { listTitlesValidator, titleIdValidator } from "../validators/titles.ts";
import { validate } from "../middlewares/validateData.ts";

const titleController = new TitleController(new TitleService());

export class TitleRoutes {
    static get router(): Router {
        const router = Router();

        router.get("/", listTitlesValidator, validate, titleController.list);
        router.get("/:id", titleIdValidator, validate, titleController.getById);

        return router;
    }
}
