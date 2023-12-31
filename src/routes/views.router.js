import { Router } from "express";
import viewsController from "../controllers/views.controller.js";
import { authToken, adminUser, noUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/login', viewsController.login);
router.get('/register', viewsController.register);
router.get('/', authToken, viewsController.home);
router.get('/detalles', authToken, viewsController.detalles);
router.get('/book', authToken, viewsController.book);
router.get('/audios', authToken, viewsController.audios);
router.get('/escritosconmagia', authToken, viewsController.withmagic);
router.get('/caminodelasanacion', authToken, viewsController.roadsanity);
router.get('/loquesomos', authToken, viewsController.weare);
router.get('/noblesverdades', authToken, viewsController.trues);
router.get('/uploadpdf', authToken, adminUser, viewsController.uploadpdf);
router.get('/uploadaudio', authToken, adminUser, viewsController.uploadaudio);
router.get('/details/:pid', authToken, viewsController.pdfdetails);
router.get('/chat', noUser, viewsController.charlas);
router.get('/sendreset', viewsController.enviarMail);
router.get('/resetpassword/:uid', viewsController.resetPassword);

export default router;