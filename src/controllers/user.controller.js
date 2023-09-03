import { UserManager } from "../dao/class/userManager.js";
import utils from "../utils.js";
import config from "../config/config.js";

const createComent = async(req, res, next)=>{
    try {
        const user = req.user;
        const {text} = req.body;
        await UserManager.coment(user.name, text, user._id);
        await utils.transporte.sendMail({from:config.adminEmail, to: config.adminEmail, subject: 'Mensaje para luz en el camino', html:`<div><h2>Has recibido un mensaje de ${user.name}:</h2><p>${text}</p></div>`});
        return res.status(200).send({status:'succes', message:'Mensaje enviado!'});
    } catch (error) {
        next(error);
    }
}

const comentAdmin = async(req, res, next)=>{
    try {
        const user = req.user;
        const {text, id} = req.body;
        const client = await UserManager.getById(id);
        await UserManager.coment(user.name, text, id);
        await utils.transporte.sendMail({from: config.adminEmail, to:client.email, subject:'Blog luz en el camino te ha enviado un mensaje',html:`<div><h2>Luz en el camino respondió:</h2><p>${text}</p></div>`});
        return res.status(200).send({status:'succes', message:'Mensaje enviado!'});
    } catch (error) {
        next(error)
    }
}

const deleteChat = async(req, res, next)=>{
    try {
        const {uid} = req.params;
        await UserManager.deleteChat(uid);
        return res.status(200).send({status:'succes', message:'Chat eliminado!'});
    } catch (error) {
        next(error)
    }
}

export default {createComent, comentAdmin, deleteChat};