import { videoModel } from "../models/video.model.js";

export class VideoManager{

    static async getAll(page){
        const {docs, nextPage, prevPage, hasPrevPage, hasNextPage, totalPages} = await videoModel.paginate({}, {limit: 10, page, lean: true, populate:'comments.comment'});
        return {docs, page: page, hasPrevPage,  hasNextPage, prevPage, nextPage, totalPages};
    }

    static async getById(id){
        return await videoModel.findOne({_id: id}).populate('comments.comment').lean();
    }

    static async getOne(field, value){
        return await videoModel.findOne({[field]:value}).lean();
    }

    static async create(video){
        await videoModel.create(video);
    }

    static async update(id, field, value){
        await videoModel.updateOne({_id: id}, {$set:{[field]:value}});
    }

    static async delete(id){
        return await videoModel.findByIdAndRemove({_id: id})
        // await videoModel.deleteOne({_id: id});
    }
}