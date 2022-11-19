const express = require('express')
const newsRouter = express.Router()
const axios = require('axios')

newsRouter.get('', async (req, res) => {
  try {
    const api_key = '4bfaa7ce565d4d15b106d3b902982160'
    const newsAPI = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${api_key}&language=en`)
    res.render('index', {
      articles: newsAPI.data.articles
    })
  } catch (err) {
    if (err.response) {
      console.log(err.response.data)
      console.log(err.response.status)
      console.log(err.response.headers)
      res.render('index', {
        articles: null
      })
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

newsRouter.post('', async (req, res) => {
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
