import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'pdf';

const CategoryEnum = ['libro', 'escritos-con-magia', 'el-camino-de-la-sanacion', 'lo-que-somos', 'nobles-verdades']

const schema = new mongoose.Schema({
    title: String,
    path: String,
    category: {
        type: String,
        enum: CategoryEnum,
        required: true
    },
    comments:{type:[{comment:{type: mongoose.Schema.Types.ObjectId, ref: 'coments'}}]},

    key: String
});

schema.plugin(mongoosePaginate);

export const pdfModel = mongoose.model(collection, schema);