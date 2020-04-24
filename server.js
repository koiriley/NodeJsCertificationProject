const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://localhost:27017/mediaDB", { useNewUrlParser: true });
const user = require("./routes/admin");
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");

app.use(cookieParser())
app.use(bodyParser.json({ type : "application/json" }))
app.use(bodyParser.text({ type : "text/html" }))
app.use(bodyParser.urlencoded({ extended : true }))

app.use("/admin", user);

app.listen(3000, ()=>{
    console.log("Server Started...")
});
