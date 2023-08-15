import { Router } from "express";
import messageController from "../controllers/message.controller.js";
import { authToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/:id', messageController.getLastestPdfComents);

router.post('/:id', messageController.createComentPdf);

router.delete('/:id', authToken, messageController.deleteComentPdf);

router.get('/details/:id', messageController.getComentFile);

export default router;