import {Router} from 'express';
import videoController from '../controllers/video.controller.js';
import { authToken, adminUser } from '../middlewares/auth.middleware.js';
import utils from '../utils.js';

const router = Router();

router.get('/', videoController.getVideos);
router.get('/:vid', videoController.getVideoById);
router.post('/create',  utils.uploadVideo.single('file'), videoController.createVideo);
router.put('/update/:vid',  authToken, adminUser, videoController.updateVideo);
router.delete('/delete/:vid', authToken, adminUser, videoController.deleteVideo);

export default router;