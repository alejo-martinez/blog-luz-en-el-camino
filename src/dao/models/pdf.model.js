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
    }
});

export const pdfModel = mongoose.model(collection, schema);