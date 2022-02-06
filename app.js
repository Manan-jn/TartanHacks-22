require("dotenv").config();
const http = require("http");
const express = require('express');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const accountSid = "ACc7a09c07721d70e03e75f3a2366c45b1";
const authToken = "96de68bf1f5c1efe92977b34a25be5a4";
const client = require('twilio')(accountSid, authToken);
const socketio = require("socket.io");
const dasha = require("@dasha.ai/sdk");
const fs = require("fs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//dashboard --> main.html file


const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://mananjain:123@cluster0.mdrmi.mongodb.net/myFirstDatabase");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    contact1: String,
    contact2: String,
    contact3: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let userName;

app.get("/",function(req,res){
    res.render("homePage");
});

app.get("/login",function(req,res){
    res.render("loginSignup");
});

app.get("/register",function(req,res){
    res.render("loginSignup");
});


// ROUTE TO UPDATE PROFILE//////
app.get("/settings",function(req,res){
    res.render('settings',{userName: userName});
});


app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/");
});

async function main() {

	const conv = application.createConversation({ phone: "+919811605657", name: "Manan" });

	conv.audio.tts = "dasha";

	if (conv.input.phone === "chat") {
		await dasha.chat.createConsoleChat(conv);
	} else {
		conv.on("transcription", console.log);
	}

	const logFile = await fs.promises.open("./log.txt", "w");
	await logFile.appendFile("#".repeat(100) + "\n");

	conv.on("transcription", async (entry) => {
		await logFile.appendFile(`${entry.speaker}: ${entry.text}\n`);
	});

	conv.on("debugLog", async (event) => {
		if (event?.msg?.msgId === "RecognizedSpeechMessage") {
			const logEntry = event?.msg?.results[0]?.facts;
			await logFile.appendFile(JSON.stringify(logEntry, undefined, 2) + "\n");
		}
	});

	const result = await conv.execute({
		// channel: conv.input.phone === "chat" ? "text" : "audio",
	});

	console.log(result.output);

	await logFile.close();
}
let application;
async function myFunc() {
    application = await dasha.deploy("./app");
    application.setExternal("console_log", (args, conv) => {
    console.log(args);
});
await application.start();
}
myFunc();
app.post("/fakeCall", function (req, res) {
	main();
	res.redirect("/dashboard");
})

io.on('connection', socket => {
	socket.on('sendLoc', (myLatitude, myLongitude) => {
        let phone1;
        let phone2;
        let phone3;
        User.find({username: userName},function(err,foundUser){
            phone1 = foundUser[0].contact1;
            phone2 = foundUser[0].contact2;
            phone3 = foundUser[0].contact3;
            console.log(foundUser);
            console.log(phone1);
            client.messages
					.create({
						body: `I need immediate help at ${myLatitude}, ${myLongitude}`,
						from: '+18593747178',
						to: `${phone1}`
					})
					.then(message => console.log(message.sid));
				client.messages
					.create({
						body: `I need immediate help at ${myLatitude}, ${myLongitude}`,
						from: '+18593747178',
						to: `${phone2}`
					})
					.then(message => console.log(message.sid));
				client.messages
					.create({
						body: `I need immediate help at ${myLatitude}, ${myLongitude}`,
						from: '+18593747178',
						to: `${phone3}`
					})
				.then(message => console.log(message.sid));
        });
		console.log(myLatitude);
		console.log(myLongitude);
	});
});
io.on('connection',socket=>{
    socket.on('liveLoc',(myLatitude, myLongitude)=>{
        //emit and event with lat and long
        console.log("hello");
        let lati = myLatitude;
        let longi = myLongitude;
        console.log(lati);
        console.log(longi);
        socket.emit("shareLoc",{"hello": "hello"});
    })
})
app.post("/liveLocation",(req,res)=>{
    res.redirect("/dashboard");
})

app.get("/maps",function(req,res){
    res.sendFile(__dirname + '/map.html');
})

app.post("/settings",function(req,res){
    User.findOne({'username':req.body.username},function(err,data){
        if(err){
            console.log(err);
        }
        else{
            User.findOneAndDelete({'username': req.body.username},function(err,d){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(d);
                }
            });
           User.register({
               username: req.body.username,
               email: req.body.email,
               contact1: req.body.phone1,
               contact2: req.body.phone2,
               contact3: req.body.phone3
           },req.body.password,function(err,user){
               if(err){
                   console.log(err);
               }
               else{
                   console.log(user);
                   req.logOut();
                   res.redirect("/login");
               }
           });
        };
    });
});

app.post("/login",function(req,res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
            res.redirect("/login");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                userName = user.username;
                res.redirect("/dashboard");
            });
        }
    });
})

app.post("/register",function(req,res){
    User.register({
        username: req.body.username,
        email: req.body.email,
        contact1: req.body.phone1,
        contact2: req.body.phone2,
        contact3: req.body.phone3
    }, req.body.password,function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                userName = user.username;
                res.redirect("/dashboard");
            });
        }
    });
})
app.post("/text", (req, res) => {
	res.redirect("/dashboard");
})

app.get("/dashboard", function (req, res) {
        if(req.isAuthenticated()){
	        res.sendFile(__dirname + '/dashboard.html');
        }
        else{
            res.redirect("/login");
        }
});

let port = process.env.PORT;
if (port == null || port == "") {
	port = 3000;
}
server.listen(port, function () {
	console.log(`Server started on http://localhost:3000/`);
});
