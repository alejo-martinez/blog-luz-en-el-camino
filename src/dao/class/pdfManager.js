import { pdfModel } from "../models/pdf.model.js";
import CustomError from "../../errors/custom.error.js";

export class PdfManager {
    static async getAll() {
        const pdfs = await pdfModel.find().lean();
        if (pdfs.length === 0) throw new CustomError('No data', 'No se encontraron los pdfs o no existen', 5);
        try {
            return pdfs;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async getByCategory(category){
        const pdfs = await pdfModel.find({category: category}).lean();
        if (pdfs.length === 0) return undefined;
        try {
            return pdfs;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getOne(prop, value) {
        try {
            const pdf = await pdfModel.findOne({ [prop]: value }).lean();;
            if (!pdf) return undefined;
            return pdf;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getById(id) {
        const pdf = await pdfModel.findOne({ _id: id }).lean();
        if (!pdf) throw new CustomError('No data', 'No se encontro el pdf o no existe', 5);
        try {
            return pdf;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async create(pdf) {
        try {
            await pdfModel.create(pdf);
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async coment(name, text, id){
        if(!text) throw new CustomError('No data', 'Debes proporcionar un comentario', 2);
        try {
            const date = new Date();
            const comentario = {name: name? name:'Anónimo', coment: text, created_at: date};
            await pdfModel.updateOne({_id: id}, {$push: {comments: comentario}});
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async deleteComent(id, index){
        try {
            const pdf = await pdfModel.findOne({_id: id});
            console.log(pdf);
            pdf.comments.splice(index, 1);
            await pdfModel.updateOne({_id: id}, {$set:{comments: pdf.comments}});
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async update(id, prop, value) {
        try {
            await pdfModel.updateOne({ _id: id }, { $set: { [prop]: value } });
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async delete(id) {
        try {
            await pdfModel.deleteOne({ _id: id });
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };
}