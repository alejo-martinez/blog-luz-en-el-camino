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
    }

    static async responseMessage(uid, message){
        const msg = await messageModel.create(message);
        await userModel.updateOne({_id: uid}, {$push:{chat:{message:msg._id}}});
    }

    static async deleteMessage(mid, uid){
            await userModel.updateOne({_id: uid}, {$pull: {chat: {message: mid}}}); 
            await messageModel.deleteOne({_id: mid});
    }
}