const Router = require("express").Router();
const express = require('express');
const app = express();
const request = require('request');
const NewsModel = require("../model/news");


const weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=Atlanta&mode=json&units=imperial&cnt=5&appid=fbf712a5a83d7305c3cda4ca8fe7ef29";

Router.get("/",(req,res)=>{res.render("home")});

Router.get('/about',(req,res) => {res.render('about')})

Router.get('/sports',(req,res) => {
    NewsModel.find().then(newss => {
        res.render('sports', { data: newss});
    });
})

Router.get('/contact',(req,res) => {res.render('contact')})

// Weather App Here
function getWeather(url) {
    // Setting URL and headers for request
    var options = {
        url: weatherUrl,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}
// Weather Api Route
Router.get('/weather',(req,res) => {
    var dataPromise = getWeather();
    // Get user details after that get followers from URL
    dataPromise.then(JSON.parse)
               .then(function(result) {
                    res.render('weather',{result,title:'5 Day Weather Forecast'})
                })
})

// Chat App
Router.get("/chat",(req,res)=>{res.render("chat")});

module.exports = Router 

