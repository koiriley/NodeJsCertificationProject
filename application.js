const express = require('express');
const app = express();
const path = require('path');


const HomePageRouter = require('./routes/home')
app.use("/", HomePageRouter)

const AboutPageRouter = require('./routes/about')
app.use("/about", AboutPageRouter)

/* const ContactPageRouter = require('./routes/contact')
app.use("/contact", ContactPageRouter)

const SportsPageRouter = require('./routes/sports')
app.use("/sports", SportsPageRouter)
*/

app.use(express.static(path.join(__dirname, "public")))

app.set("view engine", "ejs")
app.set('views', './views')

//app.get('/about', (req,res)=>{res.render('about')})


module.exports = app;