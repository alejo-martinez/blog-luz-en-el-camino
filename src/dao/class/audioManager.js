import { audioModel } from "../models/audio.model.js";
import CustomError from "../../errors/custom.error.js";

export class AudioManager {
    static async get(){
        return await audioModel.find();
    }

    static async getAll(page, filter) {
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
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = await audioModel.paginate({}, {limit: 10, page, lean: true, populate:'comments.comment', sort: queryFilter});
        try {
            return {docs,  page: page, hasPrevPage,  hasNextPage, prevPage, nextPage, totalPages};
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    };

    static async getById(id) {
        const audio = await audioModel.findById(id).populate('comments.comment').lean();
        if (!audio) throw new CustomError('No data', 'No se encontró el audio', 5);
        try {
            return audio;
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }

    };

    static async getOne(prop, value) {
        try {
            const audio = await audioModel.findOne({[prop]: value}).populate('comments.comment').lean();
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

    static async coment(aid, cid){
        try {
            await audioModel.updateOne({_id: aid}, {$push: {comments: cid}});
        } catch (error) {
            return error;
        }
        // if(!text) throw new CustomError('No data', 'Debes proporcionar un comentario', 2);
        // try {
        //     const date = new Date();
        //     const comentario = {name: name? name:'Anónimo', coment: text, created_at: date};
        //     await audioModel.updateOne({_id: id}, {$push: {comments: comentario}});
        // } catch (error) {
        //     throw new CustomError('Error desconocido', error, -999);
        // }
    }

    static async deleteComent(id, index){
        try {
            const audio = await audioModel.findOne({_id: id});
            audio.comments.splice(index, 1);
            await audioModel.updateOne({_id: id}, {$set:{comments: audio.comments}});
        } catch (error) {
            return error;
        }
    }

    static async responseComent(pid, cid, coment) {
        try {
            await audioModel.findOneAndUpdate({_id: pid, 'comments._id': cid}, {$set:{'comments.$.response': coment}});
        } catch (error) {
            throw new CustomError('Error desconocido', error, -999);
        }
    }
}