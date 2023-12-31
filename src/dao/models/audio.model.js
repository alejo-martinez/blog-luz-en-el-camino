import mongoose from "mongoose";

const collection = 'audio';

const schema = new mongoose.Schema({
    title: String,
    path: String,
    key: String
});

export const audioModel = mongoose.model(collection, schema);