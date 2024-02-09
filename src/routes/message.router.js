import { Router } from "express";
import messageController from "../controllers/message.controller.js";
import { authToken, adminUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', authToken, messageController.getChat);
router.post('/create', messageController.createMessage);
router.put('/response/:mid', authToken, adminUser, messageController.responseMessage);
router.delete('/delete/:mid/:uid', authToken, adminUser, messageController.deleteMessage);

export default router;