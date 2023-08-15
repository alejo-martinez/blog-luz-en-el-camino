import { suggestModel } from "../models/suggest.model.js";
import CustomError from "../../errors/custom.error.js";

export class SuggestManager {
    static async getAllSuggestByEmail(email, id){
        const suggest = await suggestModel.find({sender: id});
        const adminResponse = await suggestModel.find({to: email});
        if(suggest.length < 1 && adminResponse.length < 1) throw new CustomError('No data', 'No existen mensajes', 5);
        try {
            const responseArray = suggest.concat(adminResponse);
            responseArray.sort((a, b)=> new Date(a.created_at) - new Date(b.created_at));
            return responseArray;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async getLastSuggest(id){
        const lastSuggest = await suggestModel.findOne({sender: id}).sort({created_at: -1}).populate('sender');
        if(!lastSuggest) throw new CustomError('No data', 'No existen mensajes', 5);
        try {
            return lastSuggest;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getPopulate(id){}

    static async create(suggest){
        try {
            await suggestModel.create(suggest);
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };
}