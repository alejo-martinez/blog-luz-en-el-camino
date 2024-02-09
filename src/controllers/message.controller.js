import { MessageManager } from "../dao/class/messageManager.js";
import { MessageDTO } from "../dto/message.DTO.js";
import CustomError from "../errors/custom.error.js";

const getChat = async(req, res, next)=>{
    try {
        const {_id} = req.user;
        const chat = await MessageManager.getUserChat(_id);
        return res.status(200).send({status:'succes', payload: chat});
    } catch (error) {
        next(error);
    }
}

const createMessage = async(req, res, next)=>{
    try {
        const user = req.user;
        const {text} = req.body;
        const date = new Date();
        const data = new MessageDTO(user._id, text, date);
        await MessageManager.createMessage(data);
        return res.status(200).send({status:'succes', message:'Mensaje enviado !'});
    } catch (error) {
        next(error);
    }
}

const responseMessage = async(req, res, next)=>{
    try {
        const {mid} = req.params;
        const {text} = req.body;
        await MessageManager.responseMessage(mid, text);
        return res.status(200).send({status:'succes', message:'Respuesta enviada !'});
    } catch (error) {
        next(error);
    }
}


const deleteMessage = async(req, res, next)=>{
    try {
        const {mid, uid} = req.params;
        await MessageManager.deleteMessage(mid, uid);
        return res.status(200).send({status:'succes', message:'Mensaje borrado!'})
    } catch (error) {
        next(error);
    }
}

export default {getChat, createMessage, responseMessage, deleteMessage};