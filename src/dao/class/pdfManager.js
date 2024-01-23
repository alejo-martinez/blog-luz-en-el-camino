import { pdfModel } from "../models/pdf.model.js";
import CustomError from "../../errors/custom.error.js";

export class PdfManager {
    static async getAll() {
        const pdfs = await pdfModel.find().populate('comments.comment').lean();
        if (pdfs.length === 0) throw new CustomError('No data', 'No se encontraron los pdfs o no existen', 5);
        try {
            return pdfs;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async getByCategory(category){
        const pdfs = await pdfModel.find({category: category}).populate('comments.comment').lean();
        if (pdfs.length === 0) return undefined;
        try {
            return pdfs;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getOne(prop, value) {
        try {
            const pdf = await pdfModel.findOne({ [prop]: value }).populate('comments.comment').lean();;
            if (!pdf) return undefined;
            return pdf;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async getById(id) {
        const pdf = await pdfModel.findOne({ _id: id }).populate('comments.comment').lean();
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

    static async coment(pid, cid){
        try {
            await pdfModel.updateOne({_id: pid}, {$push: {comments: cid}});
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async deleteComent(id, index){
        try {
            const pdf = await pdfModel.findOne({_id: id});
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

    static async responseComent(pid, cid, coment) {
        try {
            await pdfModel.findOneAndUpdate({_id: pid, 'comments._id': cid}, {$set:{'comments.$.response': coment}});
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async delete(id) {
        try {
            await pdfModel.deleteOne({ _id: id });
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };
}