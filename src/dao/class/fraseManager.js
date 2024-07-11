import { fraseModel } from "../models/frase.model.js";

export class FraseManager {
    static async getAll(page){
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = await fraseModel.paginate({}, {limit: 10, page, lean: true});
        return {docs,  page: page, hasPrevPage,  hasNextPage, prevPage, nextPage, totalPages};
    }

    static async getById(id){
        return await fraseModel.findOne({_id: id}).lean();
    }

    static async create(frase){
        await fraseModel.create(frase);
    }

    static async update(id, field, value){
        await fraseModel.updateOne({_id: id}, {[field]: value});
    }

    static async delete(id){
        await fraseModel.deleteOne({_id: id});
    }
}