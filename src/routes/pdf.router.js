import { Router } from "express";
import pdfController from "../controllers/pdf.controller.js";
import utils from "../utils.js";
import { authToken, adminUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', pdfController.getAll);
router.post('/', authToken, adminUser, utils.uploadPdf.single('file'), pdfController.createPdf);
// router.delete('/coment', authToken, adminUser, pdfController.deleteComentPdf);

router.get('/:pid', pdfController.getById);
// router.post('/:pid', pdfController.comentarPdf);
router.put('/:pid', authToken, adminUser, utils.uploadPdf.single('file'), pdfController.updatePdf);
router.delete('/:pid', authToken, adminUser, pdfController.deletePdf);
router.get('/pdfs/:cat', pdfController.getAllCategory);
// router.put('/updatedate/:id', pdfController.updateDate);
// router.post('/coment/:pid/:cid', authToken, adminUser, pdfController.responseComent);


export default router;