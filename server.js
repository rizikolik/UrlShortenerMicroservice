'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser=require("body-parser");
var mongodb = require('mongodb');
var cors = require('cors');
const dns = require('dns');
var app = express();
var ValidUrl=require("valid-url");
require('dotenv').config();

var MongoClient = mongodb.MongoClient;

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
 
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true });


let UrlSchema=new mongoose.Schema({
"normalUrl":String,
  "shortened":Number
});
let Url=mongoose.model("Url",UrlSchema);

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.post("/api/shorturl/new",(req,res,next)=>{
 const url=req.body.url;

   

dns.lookup(url.split("/")[2], (err, address, family) => {
if(err){
res.json({"error":"invalid URL"})
}else{
 
Url.find({"normalUrl":url},(err,founded)=>{
  if(err){
    res.send(err)
  }else{
    if(founded.length>0){
        res.json({"normalUrl":url,shortened:founded[0].shortened})
        }else{
            let num=Math.floor(Math.random()*120);
            let ShortenNew=new Url({"normalUrl":url,shortened:num});
            ShortenNew.save((err,data)=>{
                res.json({"normalUrl":url,shortened:num})
            })
        }
  }
})
}
});
});
app.get("/api/shorturl/:number",(req,res)=>{
  let shortUrlNumber=req.params.number;
  Url.find({shortened:shortUrlNumber},"-_id",(err,foundedUrl)=>{
    if(err){
      res.send("There is no Url With This Number!")
    }else{
      res.json({"normalUrl":foundedUrl[0].normalUrl,shortened:foundedUrl[0].shortened})
    }
  })
})
           




var Person = mongoose.model('Person', UrlSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
  if (err)
   console.log(err)
  
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});

