// importing requirements
const express = require("express");
const mongoose = require('mongoose');

//creating a server
const app = express();

// register view engine as ejs
app.set('view engine', 'ejs');

// static file
app.use(express.static('public'));

//listen for a server request
app.listen(3000,()=>{
  console.log("waiting for a request on port 3000");
});

// routing
app.get('/',(req,res)=>{
  res.render('index');
});
