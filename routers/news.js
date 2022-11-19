const express = require('express')
const newsRouter = express.Router()
const axios = require('axios')

newsRouter.get('', async (req, res) => {
  try {
    const api_key = '4bfaa7ce565d4d15b106d3b902982160'
    const governmentNews = await axios.get(`https://newsapi.org/v2/everything?q=government&apiKey=${api_key}`)
    const environmentNews = await axios.get(`https://newsapi.org/v2/everything?q=environment&apiKey=${api_key}`)
    const techNews = await axios.get(`https://newsapi.org/v2/everything?q=technology&apiKey=${api_key}`)
    const businessNews = await axios.get(`https://newsapi.org/v2/everything?q=business&apiKey=${api_key}`)
    const healthNews = await axios.get(`https://newsapi.org/v2/everything?q=health&apiKey=${api_key}`)
    res.render('index', {
      government: governmentNews.data.articles.slice(0, 10),
      environment: environmentNews.data.articles.slice(0, 10),
      tech: techNews.data.articles.slice(0, 10),
      business: businessNews.data.articles.slice(0, 10),
      health: healthNews.data.articles.slice(0, 10)
    })
  } catch (err) {
    if (err.response) {
      console.log(err.response.data)
      console.log(err.response.status)
      console.log(err.response.headers)
      res.render('index', {
        government: null,
        environment: null,
        tech: null,
        business: null,
        health: null
      })
    } else if (err.requiest) {
      res.render('index', {
        government: null,
        environment: null,
        tech: null,
        business: null,
        health: null
      })
      console.log(err.requiest)
    } else {
      res.render('index', {
        government: null,
        environment: null,
        tech: null,
        business: null,
        health: null
      })
      console.error('Error', err.message)
    }
  }
})

newsRouter.post('/search', async (req, res) => {
  let search = req.body.search
  try {
    const api_key = '4bfaa7ce565d4d15b106d3b902982160'
    const newsAPI = await axios.get(`http://newsapi.org/v2/everything?q=${search}&apiKey=${api_key}`)
    res.render('index', {
      articles: newsAPI.data.articles
    })
  } catch (err) {
    if (err.response) {
      res.render('index', {
        articles: null
      })
      console.log(err.response.data)
      console.log(err.response.status)
      console.log(err.response.headers)
    } else if (err.requiest) {
      res.render('index', {
        articles: null
      })
      console.log(err.requiest)
    } else {
      res.render('index', {
        articles: null
      })
      console.error('Error', err.message)
    }
  }
})

module.exports = newsRouter
