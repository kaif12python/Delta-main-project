if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express= require("express");
const app = express();
const mongoose = require("mongoose");

const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// Router
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");



const dbUrl = process.env.ATLASDB_URL;

main()
  .then(()=>{
    console.log("connected with DB");
})
  .catch((err)=>{
    console.log(err);
  });

async function main(){
    await mongoose.connect(dbUrl);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "process.env.SECRET"
  },
  touchAfter: 24 * 3600,
});

store.on("error",() =>{
  console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
  store,
  secret: "process.env.SECRET",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 *60 * 1000,
    maxAge: 7 * 24 * 60 *60 * 1000,
    httpOnly: true,
  }, 
};

// app.get("/",(req,res)=>{
//   res.send("Hi iam root 8080");
// });


app.use(session(sessionOptions));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});



app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);

// this index route ,new route, show route delete route,edit route are tranfer listing.js in routes dir

// middleware

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
});

app.use((err, req, res, next)=>{
  let {statusCode=500,message="something went wrong!"} = err;
  res.status(statusCode).render("error.ejs",{ message });
  // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("Server is connected to Port 8080");
});

// iska run page kholo