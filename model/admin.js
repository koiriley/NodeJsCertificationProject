const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AdminSchema = new Schema({
    name : String,
    password : String,
    email : String
})

const AdminModel = new mongoose.model("admins", AdminSchema);

module.exports = AdminModel;