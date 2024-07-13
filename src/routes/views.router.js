import { Router } from "express";
import viewsController from "../controllers/views.controller.js";
import { authToken, adminUser, noUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/login', viewsController.login);
router.get('/register', viewsController.register);
router.get('/', authToken, viewsController.home);
// router.get('/detalles', authToken, viewsController.detalles);
router.get('/book', authToken, viewsController.book);
router.get('/audios', authToken, viewsController.audios);
router.get('/videos', authToken, viewsController.allVideos);

//PDFS POR CATEGORIA
router.get('/category/:cat', authToken, viewsController.renderPdfByCategory);


//RUTAS ADMIN
router.get('/uploadpdf', authToken, adminUser, viewsController.uploadpdf);
router.get('/uploadaudio', authToken, adminUser, viewsController.uploadaudio);
router.get('/uploadvideo', authToken, adminUser, viewsController.uploadvideo);
router.get('/uploadfrase', authToken, adminUser, viewsController.uploadfrase);

router.get('/details/:file/:id', authToken, viewsController.fileDetails);
router.get('/ver/frase/:fid', authToken, viewsController.fraseDetails);
// router.get('/audios/:aid', authToken, viewsController.getAudioById);
router.get('/chat', noUser, viewsController.chat);
router.get('/sendreset', viewsController.enviarMail);
router.get('/resetpassword/:uid', viewsController.resetPassword);
router.get('/frasesparameditar', authToken, viewsController.renderFrases)

export default router;