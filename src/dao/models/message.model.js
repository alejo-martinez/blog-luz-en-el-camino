import mongoose from "mongoose";

const collection = 'message';

const schema = new mongoose.Schema({
    sender: {type: String, required: true},
    text: {type: String, required: true},
    created_at: Date,
})

export const messageModel = mongoose.model(collection, schema);