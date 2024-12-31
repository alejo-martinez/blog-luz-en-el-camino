import { userModel } from "../models/user.model.js";
import CustomError from "../../errors/custom.error.js";
import utils from "../../utils.js";

export class UserManager {

    static async getAll() {
        try {
            const users = await userModel.find({ rol: 'client' }).populate('chat.message').lean();
            users.forEach(user=>{
                if(user.chat.length === 0) return;
                else{
                    user.chat.forEach(msg=> msg.message.created_at = utils.formatDate(msg.message.created_at))
                }
            })
            return users;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getById(id) {
        try {
            const user = await userModel.findOne({ _id: id }).populate('chat.message').lean();
            if (user.chat.length !== 0) {
                user.chat.forEach(msg => {
                    msg.message.created_at = utils.formatDate(msg.message.created_at);
                })
                // return user;
            }
            return user;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getByField(field, value) {
        const user = await userModel.findOne({ [field]: value });
        try {
            return user;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getByCode(code, uid) {
        const user = await userModel.findOne({_id: uid, code: code});
        if(!user) throw new CustomError('No Data', 'El código ingresado no es correcto', 4);
        try {
            return user
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getWithPassword(field, value) {
        const user = await userModel.findOne({ [field]: value }).select('+password');
        try {
            return user;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async create(user) {
        try {
            await userModel.create(user);
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async coment(name, text, id) {
        if (!text) throw new CustomError('No data', 'Debes proporcionar un mensaje', 2);
        try {
            const date = new Date();
            const comentario = { user: name, text: text, created_at: utils.formatDate(date) };
            await userModel.updateOne({ _id: id }, { $push: { chat: comentario } });
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async update(id, value, field) {
        try {
            await userModel.updateOne({_id: id}, {$set:{[field]:value}});
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async resetPassword(id) {
        try {
            await userModel.updateOne({ _id: id }, { $set: { password: '' } })
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async updatePassword(id, password) {
        try {
            await userModel.updateOne({ _id: id }, { $set: { password: utils.createHash(password) } });
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async deleteChat(id) {
        try {
            await userModel.updateOne({ _id: id }, { $set: { chat: [] } });
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }
}