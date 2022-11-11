// importing requirements
const express = require("express");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

//creating a server
const app = express();

// register view engine as ejs
app.set('view engine', 'ejs');

// static file
app.use(express.static('public'));


const connect_mongo = "mongodb+srv://Binary-Beast-01:Binary-Beast-01@cluster-01.tja3ztc.mongodb.net/?retryWrites=true&w=majority";
const port = process.env.PORT || 8888;

//mongo db connection
mongo.connect(connect_mongo, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((res) => {
        console.log('db Connection................ok')
        //listen for a server request
        app.listen(3000,()=>{
          console.log('Main Server Check.................ok')
        });
    }).catch((err) => console.log(err))

// routing
app.get('/',(req,res)=>{
  res.render('index');
});
