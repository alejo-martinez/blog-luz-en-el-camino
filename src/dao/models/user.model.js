import mongoose from "mongoose";

const collection = 'user';

const schema = new mongoose.Schema({
    name:{
        required :[true,"Ingrese un nombre porfavor"],
        type:String,
    },
    email:{
        required : [true, 'Debes proporcionar un email'],
        unique :true,
        lowercase: true,
        trim: true,
        type: String
    },
    password:{
        required:[true,'Debe ingresar una contraseña.'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'],
        type: String,
        select: false
    },
    rol: {
        type: String,
        default: 'client'
    },
    chat:{
        type:[
            {user:{type:String}, text: {type:String}, created_at: String}
        ],
        default: []
    }

});

export const userModel = mongoose.model(collection, schema);