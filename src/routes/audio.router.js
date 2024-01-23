import { Router } from "express";
import audioController from "../controllers/audio.controller.js";
import { authToken, adminUser } from "../middlewares/auth.middleware.js";
import utils from "../utils.js";

const router = Router();

router.get('/', audioController.getAll);
router.post('/', authToken, adminUser,utils.uploadAudio.single('file'), audioController.createAudio);
router.get('/:pid', audioController.getById);
router.put('/:pid', authToken, adminUser, utils.uploadAudio.single('file'), audioController.updateAudio);
// router.post('/coment/:pid/:cid', authToken, adminUser, audioController.responseComent);
// router.post('/:pid', audioController.comentarAudio);
// router.delete('/coment', authToken, adminUser, audioController.deleteComentAudio);
router.delete('/:pid', authToken, adminUser, audioController.deleteAudio);

export default router;