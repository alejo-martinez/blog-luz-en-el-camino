import { messageModel } from "../models/message.model.js";
import CustomError from "../../errors/custom.error.js";

export class MessageManager {
    static async get(id) {
        try {
            const coments = await messageModel.find({ pdf: id });
            return coments;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getLastPdfComents(id) {
        const latestComents = await messageModel.find({ pdf: id }).sort({ created_at: -1 }).limit(3);
        if (latestComents.length < 1) return undefined;//throw new CustomError('No data', 'No es posible traer los comentarios o no existen', 5);
        try {
            return latestComents;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async createComent(id, name, text) {
        if (!text) throw new CustomError('Faltan argumentos', 'Debes escribir un comentario', 2);
        try {
            const nombre = name ? name : 'Anónimo';
            const date = new Date();
            await messageModel.create({ name: nombre, text: text, created_at: date, pdf: id });
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async deleteComent(id) {
        try {
            await messageModel.deleteOne({ _id: id });
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }
}