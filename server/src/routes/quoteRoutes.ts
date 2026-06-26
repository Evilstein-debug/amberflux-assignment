import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createQuoteSchema, updateStatusSchema } from "../validators/quoteValidator.js";
import * as quoteController from "../controllers/quoteController.js";

const router: Router = Router();

router.get("/", quoteController.getAll);
router.get("/:id", quoteController.getById);
router.post("/", validate(createQuoteSchema), quoteController.createQuote);
router.patch("/:id/status", validate(updateStatusSchema), quoteController.updateStatus);
router.post("/:id/analyze", quoteController.analyze);

export default router;
