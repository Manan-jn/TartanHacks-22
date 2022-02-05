require("dotenv").config();
const http = require("http");
const express = require('express');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const socketio = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/",function(req,res){
    res.render("homePage");
});

app.get("/login",function(req,res){
    res.render("loginSignup");
});

app.get("/register",function(req,res){
    res.render("loginSignup");
});


let port = process.env.PORT;
if (port == null || port == "") {
	port = 3000;
}
server.listen(port, function () {
	console.log(`Server started on http://localhost:3000/`);
});
