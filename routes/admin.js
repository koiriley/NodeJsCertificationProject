const express = require("express");
const Router = express.Router();
const AdminModel = require("../model/admin");
const NewsModel = require("../model/news");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config");

const tokenExpirySeconds = 3000;

Router.get("/", (req, res)=>{
    res.render("admin", { alert: "" });
});

Router.get("/addArticle", isAuthenticated, (req, res)=>{
    res.render('add-news');
});

Router.post("/addArticle", isAuthenticated, (req, res) => {
    const News = new NewsModel({
        title : req.body.title,
        description : req.body.description,
        url : req.body.url,
        img : req.body.img,
        date : req.body.date
    })
    News.save().then(result => {
        NewsModel.find().then(newss => {
            res.render("index", { data: newss, alert: "News added successfully!" });
        });  
    }); 
});

// Delete Article
Router.post('/deleteArticle', isAuthenticated, (req, res) => {
    NewsModel.deleteOne({ title: req.body.title }, function (err) {
        if (err) return res.send(500, err);
        NewsModel.find().then(newss => {
            res.render("index", { data: newss, alert: "News deleted successfully!" });
        });   
    })
});

Router.post('/find', (req,res) => {
    NewsModel.findOne({ title: req.body.title }, function (err, news) {
        if (err) return res.send(500, err);
        res.send(news);
    })
});

Router.post('/edit', isAuthenticated, (req,res) => {
    NewsModel.findOneAndUpdate({ _id: req.body.id }, req.body, function (err, news) {
        if (err) return res.send(500, err);
        NewsModel.find().then(newss => {
            res.render("index", { data: newss, alert: "News edited successfully!" });
        });
    })
});

Router.get("/login", isAuthenticated, (req, res) => {
    NewsModel.find().then(newss => {
        res.render("index", { data: newss, alert: "" });
    });
});

Router.post("/login", (req, res) => {
    AdminModel.findOne({ email: req.body.email }, (err, admin) => {
        if (err) { return res.status(500).send({ alert: "error on server." }) }
        if (!admin) {
            res.render('admin', { alert: "Invalid credentials!" });
        } else {
            const passwordIsValid = bcrypt.compareSync(req.body.password, admin.password);

            if (passwordIsValid) {
                const token = jwt.sign({ id : admin._id }, Config.SECRET_KEY, {
                    expiresIn : tokenExpirySeconds
                })
                NewsModel.find().then(admins => {
                    res.cookie('token', token, { maxAge: 86400 * 1000 }); // This is just to demonstrate session expiration message
                    // The correct version of the above line should have: { maxAge: tokenExpirySeconds * 1000 }
                    res.render("index", { data: admins, token : token, alert : "" });
                });
            } else {
                res.render('admin', { alert: "Invalid credentials!" });
            }
        }
    })
});

Router.post("/", (req, res) => {
    AdminModel.findOne({ name: req.body.name }, (err, admin) => {
        if (err) { return res.status(500).send({ alert: "error on server." }) }
        if (admin) {
            res.render('admin', { alert: "User already exists!" });
        } else {
            const hashedPassword = bcrypt.hashSync(req.body.password, 8);
            const Admin = new AdminModel({
                name : req.body.name,
                password : hashedPassword,
                email : req.body.email,
            })
            Admin.save().then(result => {
                res.render('admin', { alert: "User created successfully!" });
            });
        }
    })    
});

Router.get("/logout", (req, res)=>{
    res.cookie('token', '', { maxAge: 0 });
    res.render("admin", { alert: "You have been logged out!" });
});

function isAuthenticated(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        res.render("admin", { alert: "Please log in!" });
    } else {
        jwt.verify(token, Config.SECRET_KEY, (err, payload) => {
            if (err) {
                res.render("admin", { alert: "Your session has expired due to inactivity!" });
            } else {
                // Renew the JWT token on every admin's action
                const token = jwt.sign({ id : payload.id }, Config.SECRET_KEY, {
                    expiresIn : tokenExpirySeconds
                });
                res.cookie('token', token, { maxAge: 86400 * 1000 }); // This is just to demonstrate session expiration message
                // The correct version of the above line should have: { maxAge: tokenExpirySeconds * 1000 }
                next();
            }
        }); 
    }
}

module.exports = Router;