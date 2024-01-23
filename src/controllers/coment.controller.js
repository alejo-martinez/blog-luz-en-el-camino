import { ComentManager } from "../dao/class/comentManager.js";
import { PdfManager } from "../dao/class/pdfManager.js";
import { AudioManager } from "../dao/class/audioManager.js";
import { CommentDTO } from "../dto/comment.DTO.js";


const getComentById = async(req, res, next)=>{
    try {
        const {cid} = req.params;
        const coment = await ComentManager.getById(cid);

    } catch (error) {
        next(error);
    }
}

const createComent = async(req, res, next)=>{
    try {
        const {text, author, type, id} = req.body;
        // const obj = {text: text, author: author};
        const date = new Date();
        const comentario = new CommentDTO(text, author, date);
        await ComentManager.create(comentario, type, id);
        // if(type === 'pdf') await PdfManager.coment(id, comentario._id);
        // if(type === 'audio') await AudioManager.coment(id, comentario._id);
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

// const createAudioComent = async(req, res, next)=>{
//     try {
//         const {aid} = req.params;
//         const {text, author} = req.body;
//         const obj = {text: text, author: author}
//         const comentario = await ComentManager.create(obj);
//         await AudioManager.coment(aid, comentario._id);
//         return res.status(200).send({status:'succes', message:'Comentario enviado, gracias!'})
//     } catch (error) {
//         next(error);
//     }
// }

export default {createComent, deleteComent, responseComent};