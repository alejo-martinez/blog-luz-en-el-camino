import { MessageManager } from "../dao/class/messageManager.js";
import CustomError from "../errors/custom.error.js";

const getComentFile = async(req, res, next)=>{
    try {
        const {id} = req.params;
        const coments = await MessageManager.get(id);
        if(coments.length < 1) throw new CustomError('No data', 'No existen comentarios', 4);
        else return res.status(200).send({status:'succes', payload: coments});
    } catch (error) {
        next(error)
    }
};

const getLastestPdfComents = async(req, res, next)=>{
    try {
        const {id} = req.params;
        const pdfComents = await MessageManager.getLastPdfComents(id);
        if(pdfComents.length < 1) throw new CustomError('No data', 'No existen comentarios', 4);
        else return res.status(200).send({status:'succes', payload: pdfComents}); 
    } catch (error) {
        next(error);
    }
};

const createComentPdf = async(req, res, next)=>{
    try {
        const {id} = req.params;
        const {name, text} = req.body;
        await MessageManager.createComent(id, name, text);
        return res.status(200).send({status:'succes', message:'Pdf comentado !'});
    } catch (error) {
        next(error);
    }
};

const deleteComentPdf = async(req, res, next)=>{
    try {
        const {id} = req.params;
        await MessageManager.deleteComent(id);
        return res.status(200).send({status:'succes', message:'Comentario eliminado!'})
    } catch (error) {
        next(error);
    }
}

export default {getComentFile, getLastestPdfComents, createComentPdf, deleteComentPdf};