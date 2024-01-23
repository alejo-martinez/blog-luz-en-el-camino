import { comentModel } from "../models/coment.model.js";
import { pdfModel } from "../models/pdf.model.js";
import { audioModel } from "../models/audio.model.js";
import CustomError from "../../errors/custom.error.js";

export class ComentManager {
    static async getById(id) {
        return await comentModel.findOne({ _id: id }).populate('author').lean();
    }

    static async create(coment, type, id) {
        try {
            const newComent = await comentModel.create(coment);
            console.log(newComent)
            if (type === 'pdf'){
                await pdfModel.updateOne({_id: id}, {$push: {comments: {comment: newComent._id}}});
                return await pdfModel.findOne({_id: id}).lean();
            }
            if (type === 'audio'){
                await audioModel.updateOne({_id: id}, {$push: {comments: {comment: newComent._id}}});
                return await audioModel.findOne({_id: id}).lean();
            }
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }

    static async delete(id, fid, type) {
        try {
            await comentModel.deleteOne({ _id: id });
            if(type === 'pdf') await pdfModel.updateOne({_id: fid}, {$pull:{comments: {comment: id}}});
            if(type === 'audio') await audioModel.updateOne({_id: fid}, {$pull:{comments: {comment: id}}});
        } catch (error) {
            return error;
        }
    }

    static async responseComent(id, resp) {
        await comentModel.findOneAndUpdate({_id: id}, {$set:{response: resp}});
    }
}