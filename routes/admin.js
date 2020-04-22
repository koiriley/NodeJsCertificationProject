const express = require("express");
const Router = express.Router();
const AdminModel = require("../model/admin");
const NewsModel = require("../model/news");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config")

Router.get("/", (req, res)=>{
    res.render("admin", { alert: "" });
});

Router.get("/addArticle", (req, res)=>{
    res.render('add-news');
});

Router.post("/addArticle", (req, res) => {
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

// Delete Selected User
Router.post('/deleteArticle',(req,res) => {
    NewsModel.deleteOne({ title: req.body.title }, function (err) {
        if (err) return res.send(500, err);
        NewsModel.find().then(newss => {
            res.render("index", { data: newss, alert: "News deleted successfully!" });
        });   
    })
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
                    expiresIn : 86400
                })
                NewsModel.find().then(admins => {
                    //res.render("admin-dashboard", { adminsList: admins, token : token });
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


/*Router.get("/add", (req, res) => {
    res.render("add-user", { alert: "" });
});

Router.post("/add", (req, res) => {
    UserModel.findOne({ username: req.body.username }, (err, user) => {
        if (err) { return res.status(500).send({ alert: "error on server." }) }
        if (user) {
            res.render('add-user', { alert: "User already exists!" });
        } else {
            const hashedPassword = bcrypt.hashSync(req.body.password, 8);
            const User = new UserModel({
                username : req.body.username,
                password : hashedPassword,
                type : req.body.type
            })
            User.save().then(result => {
                ProductModel.find().then(products => {
                    res.render("admin-dashboard", { productsList: products, alert: "User created successfully!" });
                });  
            });
        }
    })    
});

Router.get("/product", (req, res) => {
    res.render("add-product", { alert: "" });
});

Router.post("/product", (req, res) => {
    ProductModel.findOne({ product: req.body.product }, (err, user) => {
            const Product = new ProductModel({
                product : req.body.product,
                data : req.body.data,
                price : req.body.price
            })
            Product.save().then(result => {
                ProductModel.find().then(products => {
                    res.render("admin-dashboard", { productsList: products, alert: "Product added successfully!" });
                });  
            });
    })    
});*/

module.exports = Router;