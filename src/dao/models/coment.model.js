import mongoose from 'mongoose';

const collection = 'coments';

const schema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, default: 'Anónimo'},
    response: String,
    created_at: String
})

export const comentModel = mongoose.model(collection, schema);