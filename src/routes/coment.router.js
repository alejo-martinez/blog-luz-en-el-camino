import { Router } from "express";
import comentController from "../controllers/coment.controller.js";
import {authToken, adminUser} from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/create', comentController.createComent);
router.put('/update/:cid', authToken, adminUser, comentController.responseComent);
router.delete('/delete/:cid', authToken, adminUser, comentController.deleteComent);

export default router;