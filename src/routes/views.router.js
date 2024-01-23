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

//PDFS POR CATEGORIA
router.get('/category/:cat', authToken, viewsController.renderPdfByCategory);


//RUTAS ADMIN
router.get('/uploadpdf', authToken, adminUser, viewsController.uploadpdf);
router.get('/uploadaudio', authToken, adminUser, viewsController.uploadaudio);


router.get('/details/:pid', authToken, viewsController.pdfdetails);
router.get('/audios/:aid', authToken, viewsController.getAudioById);
router.get('/chat', noUser, viewsController.charlas);
router.get('/sendreset', viewsController.enviarMail);
router.get('/resetpassword/:uid', viewsController.resetPassword);

export default router;