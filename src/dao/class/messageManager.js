import { messageModel } from "../models/message.model.js";
import { userModel } from "../models/user.model.js";
import utils from "../../utils.js";
import config from "../../config/config.js";

export class MessageManager {
    static async getUserChat(uid){
        const messages = await messageModel.find({sender: uid}).populate('sender').lean();
        messages.forEach(msg =>{
            msg.created_at = utils.formatDate(msg.created_at);
        })
        return messages;
    }

    static async getChatsOtherUsers(filterId){
        return await messageModel.find({sender:{$ne: filterId}}).populate('sender').lean();
    }

    static async createMessage(message){
        const msg = await messageModel.create({sender: message.name, text: message.text, created_at: message.created_at});
        await userModel.updateOne({_id: message.sender}, {$push:{chat: {message: msg._id}}});
        await utils.transporte.sendMail({to: 'lucianabeguelin@hotmail.com', from: config.adminEmail, subject:'Recibiste un nuevo mensaje', text: `"${message.name}" te envió un mensaje a través de la página!`})
    }

    static async responseMessage(uid, message){
        const msg = await messageModel.create(message);
        const user = await userModel.findOneAndUpdate({_id: uid}, {$push:{chat:{message:msg._id}}});
        await utils.transporte.sendMail({to: user.email, from: config.adminEmail, subject: 'Te respondieron un mensaje.', text: `Hola ${user.name} ! Luz en el camino te respondió el mensaje que le enviaste. http://localhost:8007/ accede para poder responder. Saludos !` });
    }

    static async deleteMessage(mid, uid){
            await userModel.updateOne({_id: uid}, {$pull: {chat: {message: mid}}}); 
            await messageModel.deleteOne({_id: mid});
    }
}