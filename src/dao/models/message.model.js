import mongoose from "mongoose";

const collection = 'message';

const schema = new mongoose.Schema({
    name: String,
    text: String,
    created_at: Date,
    // pdf: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'pdf'
    // },
})

export const messageModel = mongoose.model(collection, schema);