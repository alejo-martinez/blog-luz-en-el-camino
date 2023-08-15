import { Router } from "express";
import { adminUser, authToken } from "../middlewares/auth.middleware.js";
import suggestController from "../controllers/suggest.controller.js";

const router = Router();

router.get('/', authToken, suggestController.getSuggest);
router.post('/', authToken, suggestController.create);
router.post('/admin/:uid', authToken, adminUser, suggestController.adminResponse);

export default router;