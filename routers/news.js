const express = require('express')
const newsRouter = express.Router()
const news = require('../controller/newsController.js')

// getting news from api for home page nav-tab's
newsRouter.get('', news.nav_tab)

// getting news for search operation
newsRouter.post('/search', news.search)

module.exports = newsRouter
