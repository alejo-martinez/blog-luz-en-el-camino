import { Router } from "express";
import comentController from "../controllers/coment.controller.js";
import {authToken, adminUser} from '../middlewares/auth.middleware.js';
import { AudioManager } from "../dao/class/audioManager.js";
import { ComentManager } from "../dao/class/comentManager.js";

const router = Router();

const fast = async(req, res, next)=>{
    try {
        
        const audio = await AudioManager.getById(req.params.cid);
        for (let index = 0; index < audio.comments.length; index++) {
            const element = audio.comments[index];
            const coment = await ComentManager.getById(element.comment);
            console.log(coment);
            audio.comments[index].comment = coment;
            await AudioManager.update()
        }
        return res.status(200).send('Listo !');
    } catch (error) {
        console.log(error);
    }
}

router.post('/create', comentController.createComent);
router.put('/update/:cid', authToken, adminUser, comentController.responseComent);
router.put('/fast/:cid', fast);

router.delete('/delete/:cid', authToken, adminUser, comentController.deleteComent);


export default router;