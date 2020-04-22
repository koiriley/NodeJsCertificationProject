import express from 'express';
const MongoClient = require('mongodb').MongoClient;
import bodyParser from 'body-parser';
const port = 8900;
const app = express();
let db;
const mongourl = 'mongodb://127.0.0.1:27017/'
const col_name = 'articlelist';

app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');

// Get Data from datbase and display on index
app.get('/', (req,res)=>{
    db.collection(col_name).find().toArray((err,result) => {
        if(err) throw err;
        res.render('index.ejs',{data:result})
    })
})

// Post data from ui
app.post('/addData', (req,res) => {
    db.collection(col_name)
        // In Req.body we will recive the data
        // from form.
        .insert(req.body, (err,result) => {
            if(err) throw err;
            console.log('data.inserted');
        })
    res.redirect('/');
})

// Delete Selected User
app.delete('/delete_article',(req,res) => {
    db.collection(col_name).findOneAndDelete({
        "title":req.body.title
    },(err,result) => {
        if (err) return res.send(500,err)
        res.send({message: 'success'})
    })
})

// Find article by title
app.post('/find_by_title',(req,res) => {
    let title = req.body.title;
    db.collection(col_name)
      .find({title:title})
      .toArray((err,result) => {
          if(err) throw err;
          res.send(result)
      })
});

// Edit Article
app.put('/edit',(req,res)=>{
    db.collection(col_name)
        .findOneAndUpdate({"title":req.body.title},{
            $set:{
                title:req.body.title,
                description:req.body.description,
                url:req.body.url,
                img:req.body.img,
                date:req.body.date
            }
        },{
            upsert:true
        },(err,result) => {
            if(err) return res.send(err);
            res.send(result)
        })
})

// Opening Edit Article Page
app.get('/admin/addArticle',(req,res) => {
    res.render('add-news')
})

MongoClient.connect(mongourl,(err,client) => {
    if(err) throw err;
    db = client.db('march_dashboard')
    app.listen(port, ()=> {
        console.log(`Server running on port ${port}`)
    })
})