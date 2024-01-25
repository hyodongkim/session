const express = require('express');
const app = express({xPoweredBy:false});
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', 'templates');

app.use(require('./setting'));

app.get('/home', (req,res,next)=>{
    res.render("home", {user:req.session.user});
});
app.get('/mypage', (req,res,next)=>{
    if(req.session.user.role !== "user") res.redirect("/home");
    else res.render("mypage", {user:req.session.user});
});
app.get('/admin', (req,res,next)=>{
    if(req.session.user.role !== "admin") res.redirect("/home");
    else res.render("admin", {user:req.session.user});
});
app.get('/signup', (req,res,next)=>{
    res.render("signup", {id:"",pw:""});
});
app.get('/login', (req,res,next)=>{
    if(req.session.user) res.redirect("/home");
    else res.render("login");
});
app.post('/login', (req,res,next)=>{
    if(req.session.user) res.redirect("/home");
    else if(!(req.body.id && req.body.pw)) res.redirect("/login");
    else {
        let db = require('./filedb');
        db.path = 'user';
        let users = db.load().users;
        users = users.filter(user=>user.id === req.body.id && user.pw === req.body.pw);
         if(users.length > 0){
            req.session.user = {id:users[0].id, role:users[0].role};
            res.redirect("/home");
        } else res.redirect("/login");
    }
});
app.post('/logout', (req,res,next)=>{
    req.session.destroy(err=>{});
    res.redirect("/home");
    // req.session.destroy(err=>{});
    // req.session.regenerate(err=>{});
    // req.session.reload(err=>{});

    // req.session; -> 메서드
    // delete req.session.user;
});
app.post('/signout', (req,res,next)=>{
    if(!req.session.user) res.redirect("/home");
    else if(req.session.user.role === 'admin') res.redirect("/home");
    else{  
        let db = require('./filedb');
        db.path = 'user';
        let users = db.load().users;
        users = users.filter(user=>user.id !== req.session.user.id);
        db.save({users:users});

        req.session.destroy(err=>{});
        res.redirect("/home");
    }
});
app.post('/signup', (req,res,next)=>{
    if(req.session.user) res.redirect("/home");
    else if(!(req.body.id && req.body.pw)) res.redirect("/home");
    else {
        let db = require('./filedb');
        db.path = 'user';
        let users = db.load().users;
        let result = users.filter(user=>user.id === req.body.id);
        if(result.length === 0){
            users.push({id:req.body.id, pw:req.body.pw, role:"user"});
            db.save({users:users});
            req.session.user = {id:req.body.id, role:"user"};
            res.redirect("/home");
        }
        else res.render('signup', {id:req.body.id, pw:req.body.pw});
    }
});

module.exports = app;