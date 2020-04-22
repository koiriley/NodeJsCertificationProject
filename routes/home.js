const Router = require("express").Router();

Router.get("/",(req,res)=>{res.render("home")});

app.get('/about',(req,res) => {res.render('about')})

//app.get('/sports',(req,res) => {res.render('sports')})

app.get('/contact',(req,res) => {res.render('contact')})

module.exports = Router 