import { ComentManager } from "../dao/class/comentManager.js";
import { PdfManager } from "../dao/class/pdfManager.js";
import { AudioManager } from "../dao/class/audioManager.js";
import { CommentDTO } from "../dto/comment.DTO.js";
import { comentModel } from "../dao/models/coment.model.js";


const createComent = async(req, res, next)=>{
    try {
        const {text, author, type, id} = req.body;
        const date = new Date();
        const comentario = new CommentDTO(text, author, date);
        await ComentManager.create(comentario, type, id);
        return res.status(200).send({status:'succes', message:'Comentario enviado, gracias!'})
    } catch (error) {
        next(error);
    }
}

const responseComent = async(req, res, next)=>{
    try {
        const {cid} = req.params;
        const {text} = req.body;
        await ComentManager.responseComent(cid, text);
        return res.status(200).send({status:'succes', message:'Respuesta enviada !'});
    } catch (error) {
        next(error);
    }
}

const deleteComent = async(req, res, next)=>{
    try {
        const {cid} = req.params;
        const {fid, type} = req.body;
        await ComentManager.delete(cid, fid, type);
        return res.status(200).send({status:'succes', message:'Comentario borrado !'});
    } catch (error) {
        next(error);
    }
}


export default {createComent, deleteComent, responseComent};