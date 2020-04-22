const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const NewsSchema = new Schema({
    title : String,
    description : String,
    url : String,
    img : String,
    date : String
})

const NewsModel = new mongoose.model("news", NewsSchema);

module.exports = NewsModel;
