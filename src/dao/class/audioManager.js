import { audioModel } from "../models/audio.model.js";
import CustomError from "../../errors/custom.error.js";

export class AudioManager {
    static async getAll() {
        const audios = await audioModel.find().lean();
        // if (audios.length === 0) throw new CustomError('No data', 'No se encontraron audios', 5);
        try {
            return audios;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async getById(id) {
        const audio = await audioModel.findById(id);
        if (!audio) throw new CustomError('No data', 'No se encontró el audio', 5);
        try {
            return audio;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }

    };

    static async getOne(prop, value) {
        try {
            const audio = await audioModel.findOne({[prop]: value});
            if(!audio) return undefined;
            return audio;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async create(audio) {
        try {
            await audioModel.create(audio);
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async update(id, prop, value) {
        try {
            await audioModel.updateOne({_id: id}, {$set: {[prop]: value}});
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async delete(id) {
        try {
            await audioModel.deleteOne({_id: id});
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };
}