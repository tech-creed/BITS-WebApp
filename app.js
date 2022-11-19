// importing requirements
const express = require("express")
const mongo = require('mongoose')
const cookieParser = require("cookie-parser")

//Routers
const AuthenticationRoute = require('./routers/authentication.js')
<<<<<<< HEAD
const IndexRoute = require('./routers/index_news.js')
=======
const newsRouter = require('./routers/newsRouter.js')
>>>>>>> 64d5144c268445e3c96d6e644561c3184c8e68bc
//--------------------------------------------------------//
//creating a server
const app = express()

// register view engine as ejs
app.set('view engine', 'ejs')

// cookie praser for access the browser cookie
app.use(cookieParser())

// static file
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))


// mongodb uri to connect with database
const ConnectMongoDB = "mongodb+srv://Binary-Beast-01:Binary-Beast-01@cluster-01.tja3ztc.mongodb.net/?retryWrites=true&w=majority"
const PORT = process.env.PORT || 8888

//mongo db connection
mongo.connect(ConnectMongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((res) => {
  console.log('db Connection................ok')
  //listen for a server request
  app.listen(PORT, () => {
    console.log('Main Server.................ok')
  });
}).catch((err) => console.log(err))


// Routering operations
app.use('/auth', AuthenticationRoute) // Authentication Route

app.use('/', IndexRoute) //News Route

// app.use('/article', newsRouter) //single Article Route

// 404 Page
app.use((req, res) => {
  res.status(404).render('404', {
    msg: '404 Page Not Found'
  })
});
