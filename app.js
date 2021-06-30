//jshint esversion:6
require('dotenv').config();
const express= require("express");
const ejs=require("ejs");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const encrypt = require("mongoose-encryption");
const app =express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ['password']});

const User=mongoose.model("user",userSchema);


app.get("/",function(req,res){
res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
res.render("register");
});

app.post("/register",function(req,res){
   const newuser=new User({
       email:req.body.username,
       password:req.body.password
   });
   newuser.save(function(err){
       if(err){console.log(err);}
       else{
           res.render("secrets");
           console.log("registered");
       }
   }); 
});

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,foundUser){
        if(!err)
        {
            if(password===foundUser.password){
                res.render("secrets");
                console.log("logged in");
            }
            else{
                res.send("password incorrect");
            }
        }
        else{
            console.log(err);
        }
    });
});







app.listen(3000,function(){
    console.log("server started in port 3000");
})