const express = require('express');
const app = express();
const path = require('path');


const HomePageRouter = require('./routes/home')
app.use("/", HomePageRouter)

const AboutPageRouter = require('./routes/home')
app.use("/about", AboutPageRouter)

const ContactPageRouter = require('./routes/home')
app.use("/contact", ContactPageRouter)

const SportsPageRouter = require('./routes/home')
app.use("/sports", SportsPageRouter)

app.use(express.static(path.join(__dirname, "public")))

app.set("view engine", "ejs")
app.set('views', './views')

//app.get('/about', (req,res)=>{res.render('about')})


module.exports = app;