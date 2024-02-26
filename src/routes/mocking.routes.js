import { Router } from "express";
import { mocking100products } from "../controllers/mocking.controller.js";

const router = Router();

router.get("/", mocking100products);

router.get("/:number", mocking100products);

export default router;
