import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'frases';

const schema = mongoose.Schema({
    created_at: Date,
    path: String,
    title: String,
    key: String
});

schema.plugin(mongoosePaginate);

export const fraseModel = mongoose.model(collection, schema);