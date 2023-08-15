import mongoose from "mongoose";
import config from "../../config/config.js";

const collection = 'suggest';

const schema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    to: {
        type: String,
        default: config.adminEmail,
    },
    text: {
        type: String,
        trim: true,
        maxlength : [1024,'La cantidad máxima de caracteres es de 1024'],
        minlength: [10, 'Debes ingresar al menos 10 caracteres'],
        required: [true, 'Debes proporcionar texto']
    },
    created_at: Date
})

export const suggestModel = mongoose.model(collection, schema);