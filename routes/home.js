const Router = require("express").Router();
const express = require('express')
const app = express()

Router.get("/",(req,res)=>{res.render("home")});

Router.get('/about',(req,res) => {res.render('about')})

Router.get('/sports',(req,res) => {res.render('sports')})

Router.get('/contact',(req,res) => {res.render('contact')})

module.exports = Router 