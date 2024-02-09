
export class MessageDTO{
    constructor(uid, text, date){
        this.sender = uid;
        this.text = text;
        this.created_at = date
    }
}