import { SuggestManager } from "../dao/class/suggestManager.js";
import { UserManager } from "../dao/class/userManager.js";
import CustomError from "../errors/custom.error.js";

const create = async (req, res, next) => {
    try {
        const { text } = req.body;
        const currentDate = Date.now();
        await SuggestManager.create({ sender: req.user._id, text: text, created_at: currentDate })
        return res.status(200).send({ status: 'succes', message: 'Mensaje creado ! (user)' })
    } catch (error) {
        next(error);
    }
}

const adminResponse = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { text } = req.body;
        const suggest = await SuggestManager.getLastSuggest(uid);
        const date = Date.now();
        await SuggestManager.create({ sender: req.user._id, to: suggest.sender.email, text: text, created_at: date });
        return res.status(200).send({ status: 'succes', message: 'mensaje enviado' });
    } catch (error) {
        next(error);
    }
}

const getSuggest = async (req, res, next) => {
    try {
        const user = req.user;
        const suggests = await SuggestManager.getAllSuggestByEmail(user.email, user._id);
        return res.status(200).send({ status: 'succes', payload: suggests });
    } catch (error) {
        next(error);
    }
}

export default { create, getSuggest, adminResponse };