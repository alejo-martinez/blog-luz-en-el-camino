import { Router } from "express";
import sessionController from "../controllers/session.controller.js";
import { strategyPassport } from "../middlewares/strategy.middleware.js";

const router = Router();

router.post('/login', strategyPassport('login'), sessionController.userLogued);
router.delete('/login', sessionController.logOut);

router.post('/register', strategyPassport('register'), sessionController.createUser);

router.get('/current', strategyPassport('jwt'), sessionController.current);

router.post('/reset', sessionController.sendMail);

router.post('/reset/:uid', sessionController.resetPassword);

router.put('/update/:uid', sessionController.updatePassword);

export default router;