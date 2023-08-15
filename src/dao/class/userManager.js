import { userModel } from "../models/user.model.js";
import CustomError from "../../errors/custom.error.js";

export class UserManager {
    static async getById(id){
        const user = await userModel.findOne({_id: id});
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
}