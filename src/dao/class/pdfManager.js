import { pdfModel } from "../models/pdf.model.js";
import CustomError from "../../errors/custom.error.js";
import { comentModel } from "../models/coment.model.js";

export class PdfManager {
    static async getAll(page) {
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = await pdfModel.paginate({}, {lean: true, page, limit: 12});
        // if (pdfs.length === 0) throw new CustomError('No data', 'No se encontraron los pdfs o no existen', 5);
        try {
            return {docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, page: page};
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async getByCategory(category, page, filter){
        let queryFilter;
        if(filter){
            if(filter === 'newest' || filter === 'oldest'){
                queryFilter = {_id: filter === 'newest'? -1 : 1};
            }
            if(filter === 'coments'){
                queryFilter = {comentsCount: -1}
            }
            if(filter === 'alfabetic' || filter === 'reversed'){
                queryFilter = {title: filter === 'alfabetic'? 1 : -1};
            }
        }
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = await pdfModel.paginate({category: category}, {limit: 12, page, lean: true, populate:'comments.comment', sort:queryFilter});
        // if (pdfs.length === 0) return undefined;
        const pdfs = docs;
        try {
            return {pdfs, page: page, hasPrevPage,  hasNextPage, prevPage, nextPage, totalPages};
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

    static async coment(pid, coment){
        try {
            const comentario = await comentModel.create(coment);
            await pdfModel.updateOne({_id: pid}, {$push: {comments: {comment: comentario._id}}});
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