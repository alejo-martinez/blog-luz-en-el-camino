import { userModel } from "../models/user.model.js";
import CustomError from "../../errors/custom.error.js";
import utils from "../../utils.js";

export class UserManager {

    static async getAll(){
        const user = await userModel.find({rol:'client'}).lean();
        try {
            return user
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getById(id){
        const user = await userModel.findOne({_id: id}).lean();
        try {
            return user;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getByField(field, value){
        const user = await userModel.findOne({[field]: value});
        try {
            return user;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getWithPassword(field, value){
        const user = await userModel.findOne({[field]:value}).select('+password');
        try {
            return user;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async create(user){
        try {
            await userModel.create(user);
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async coment(name, text, id){
        if(!text) throw new CustomError('No data', 'Debes proporcionar un mensaje', 2);
        try {
            const date = new Date();
            const comentario = {user: name, text: text, created_at: utils.formatDate(date)};
            await userModel.updateOne({_id: id}, {$push:{chat: comentario}});
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async resetPassword(id){
        try {
            await userModel.updateOne({_id: id}, {$set: {password:''}})
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async updatePassword(id, password){
        try {
            await userModel.updateOne({_id: id}, {$set: {password: utils.createHash(password)}});
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }
}