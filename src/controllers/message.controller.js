import config from "../config/config.js";
import { MessageManager } from "../dao/class/messageManager.js";
import { UserManager } from "../dao/class/userManager.js";
import { MessageDTO } from "../dto/message.DTO.js";

import utils from "../utils.js";

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
        await utils.transporte.sendMail({to:'lucianabeguelin@hotmail.com', sender: config.adminEmail, subject: 'Recibiste un nuevo mensaje', text:`Recibiste un nuevo mensaje de ${user.name}`});
        return res.status(200).send({status:'succes', message:'Mensaje enviado !'});
    } catch (error) {
        next(error);
    }
}

const responseMessage = async(req, res, next)=>{
    try {
        const {mid} = req.params;
        const {text} = req.body;
        const user = await UserManager.getById(mid);
        await MessageManager.responseMessage(mid, text);
        await utils.transporte.sendMail({to: user.email, from: config.adminEmail, subject: 'Te respondieron un mensaje.', text: `Hola ${user.name} ! Luz en el camino te respondió el mensaje que le enviaste. https://luzenelcamino.com.ar/chat accede para poder responder. Saludos !` })
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