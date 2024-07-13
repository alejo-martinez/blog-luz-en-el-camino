import { Router } from "express";
import { authToken, adminUser } from "../middlewares/auth.middleware.js";
import utils from "../utils.js";
import fraseController from "../controllers/frase.controller.js";

const router = Router();

// router.get();
router.post('/', authToken, adminUser, utils.uploadPdf.single('file'), fraseController.createFrase);
// router.put();
router.delete('/:fid', authToken, adminUser, fraseController.deleteFrase);

export default router;