import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = 'audio';

const schema = new mongoose.Schema({
    title: String,
    path: String,
    key: String,
    comments:{type:[{comment:{type: mongoose.Schema.Types.ObjectId, ref: 'coments'}}]},
    duration: Number
    // comments:{type:[
    //     {coment: {type: String, required:[true, 'Debes escribir un comentario'], maxlength: [1024, 'La cantidad máxima de caracteres es de 1024'], minlength: [10, 'Debes escribir al menos 10 caracteres']}, name:{type: String, default:'Anónimo'}, created_at: Date, response:{text: String, name: {type: String}}}
    // ]}
});

schema.plugin(mongoosePaginate);

export const audioModel = mongoose.model(collection, schema);