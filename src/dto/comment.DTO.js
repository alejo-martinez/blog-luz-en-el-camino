import utils from "../utils.js";

export class CommentDTO{
    constructor(text, author, date){
        this.text = text;
        this.author = author;
        this.created_at = utils.formatDate(date);
    }
}