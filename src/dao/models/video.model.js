import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'videos';

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    path: {type: String},
    comments:{type:[{comment:{type: mongoose.Schema.Types.ObjectId, ref: 'coments'}}]},
    key: String
});

schema.plugin(mongoosePaginate);

export const videoModel = mongoose.model(collection, schema);