if(process.env.NODE_ENV !="production"){
   require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const path =require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError= require("./utils/expresserror.js");
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");

const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main()
 .then( ()=> {
    console.log("connected to db")
}).catch(err => {
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl)
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use('/uploads', express.static('uploads'));

const store =MongoStore.create({
     mongoUrl: dbUrl,
     crypto:{
        secret:process.env.SECRET,
     } ,
     touchAfter: 24*3600,
})
store.on("error",()=>{
    console.log("error in mongo session store",err)
})
const sessionOptions ={ store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge:7 * 24 * 60 * 60 * 1000 ,
        httpOnly: true,
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new  LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
     res.locals.error= req.flash("error");
      res.locals.currUser= req.user;
    next();
});
// Example; customize as needed
// app.get('/', (req, res) => {
//   res.render('listings'); // or res.send("Hello Airbnb Clone!");
// });

// app.get("/demouser",async(req,res) => {
// let fakeuser= new User ({
//     email: "student@gmail.com",
//     username:"asdf",
// });
// let registeredUser = await User.register(fakeuser,"123");
// res.send(registeredUser);
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.all("*",(req,res,next)=>{
//    next(new ExpressError(404,"page not found"));
// });
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    

})

// Or alternate syntax, same effect:
app.all('/{*any}', (req, res) => {
  res.status(404).render('notfound');
});

// app.listen(8080,() => {
//     console.log("server is listening to code 8080");
// })
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
