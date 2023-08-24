import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { adminUser, authToken, noUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/', noUser, userController.createComent);
router.post('/admin', authToken, adminUser, userController.comentAdmin);

export default router;