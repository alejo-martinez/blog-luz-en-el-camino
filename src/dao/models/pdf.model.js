import mongoose from "mongoose";

const collection = 'pdf';

const CategoryEnum = ['libro', 'escritos con magia', 'camino de la sanacion', 'lo que somos', 'nobles verdades']

const schema = new mongoose.Schema({
    title: String,
    path: String,
    category: {
        type: String,
        enum: CategoryEnum,
        required: true
    },
    comments: {
        type: [
            {coment: {type: String, required:[true, 'Debes escribir un comentario'], maxlength: [1024, 'La cantidad máxima de caracteres es de 1024'], minlength: [10, 'Debes escribir al menos 10 caracteres']}, name:{type: String, default:'Anónimo'}, created_at: Date}
        ]
    },
    key: String
});

export const pdfModel = mongoose.model(collection, schema);