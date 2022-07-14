const express = require("express");
const mongoose = require("mongoose");
const path  = require('path')
require('dotenv').config()
const homeRoute = require("./routes/home.route");
const userRoute = require("./routes/user.route");
const app = express();
const port = 5000;

const mongoDB = "mongodb://127.0.0.1/my_database";
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
//to handle CORS Errors
app.use((req, res, next) => { //doesn't send response just adjusts it
  res.header("Access-Control-Allow-Origin", "http://localhost:3001") //* to give access to any origin
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization" //to give access to all the headers provided
  );
  if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //to give access to all the methods provided
      return res.status(200).json({});
  }
  next(); //so that other routes can take over
})
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/home", homeRoute);
app.use("/user", userRoute);

mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Example app listening on port port!", port);
});

//Run app, then load http://localhost:port in a browser to see the output.
