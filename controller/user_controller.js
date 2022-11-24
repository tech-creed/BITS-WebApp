const User = require('../schema/user.js')
const Feedback = require('../schema/feedback.js')
const Reset = require('../schema/reset.js')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const axios = require('axios')

const NewsAPI = require("newsapi");
const NLPCloudClient = require('nlpcloud');
const NodeGeocoder = require('node-geocoder');

API_KEY = 'fd0bf2b6a6454faf892f3accdd3243ed'
GEO_API = '2f7641abe62841138b210f1fd82926ad'
WEATHER_API = '26a2c30acaaa9b66b0d51ee3c28ada69'
NPL_API = 'f6139861893b450ad6edc711a716d9b482066a0d'
YOUTUBE_API = 'AIzaSyBAzpEdLmu6iW9TiPt7CTDW7J53RzaypLI'

const newsapi = new NewsAPI(`${API_KEY}`);
const options = {
    provider: 'opencage',
    apiKey: `${GEO_API}`,
  };
const geocoder = NodeGeocoder(options);

const getTopHeadlinesof = (field) => {
  return newsapi.v2.topHeadlines({
    category: field,
    language: "en",
  });
};
const getEverything = (query) => {
  return newsapi.v2.everything({
    pageSize: 10,
    q: query,
    language: "en",
  });
};
const getHomeTown = (lat,long) => {
    const res = geocoder.reverse({ lat: lat, lon: long })
    return res
}

// weather api
const getWeather = (lat,lon)=>{
  const endpoint = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+WEATHER_API+"&units=metric"
  const weatherDataReport = axios.get(endpoint)
  return weatherDataReport
}

// nlp - text analysis
 // SentimentAnalysis for the news
 const SentimentAnalysis = (text) => {
   // Analysis the text for emotion and sentiment analysis
  const client = new NLPCloudClient('distilbert-base-uncased-emotion',`${NLP_API}`)
  client.sentiment(text).then(function (emotionResponse) {
  const clientSentiment = new NLPCloudClient('distilbert-base-uncased-finetuned-sst-2-english',`${NLP_API}`)
  clientSentiment.sentiment(text).then(function (sentimentResponse) {
  var data = {"sentiment" : sentimentResponse.data, "emotion": emotionResponse.data}
  return data
  })
     }).catch(function (err) {
       console.log(err)
     })
 }

 //summarization the content on the news
 const Summarization = (text) => {
   // get input as an paragraph and return the summarize the text to headline
   const client = new NLPCloudClient('bart-large-cnn',`${NLP_API}`, true)
   client.summarization(text).then(function (response) {
       return response.data
     }).catch(function (err) {
      console.log(err)
     });
 }

 //content Translation
const Translation = (text,language)=>{
  const client = new NLPCloudClient('nllb-200-3-3b','<token>')
  client.translation(text,'en',language).then(function (response) {
      return response.data
    })
    .catch(function (err) {
      console.log(err)
    })
}

// retrive the youtube video data
const youtube = (query)=>{
  const endpoint = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&order=relevance&q="+query+"&key="+YOUTUBE_API
  const youtubeData = axios.get(endpoint)
  return youtubeData.data
}

// Dashboard get page
const Dashboard = async (req, res) => {
    if (req.cookies.credLogin) {
        const cookie_id = jwt.verify(req.cookies.credLogin, "!d0cdc9$6df%58!@b!492*%^fd!731443e@66b#*3714d*9#*42766*4aa38f55b0bd!e5a33%c8%7f7@b0f");
        if (cookie_id) {
          const user = await User.findOne({_id: cookie_id.id}).lean();
          // category news fetching process
          const categories = user.category
          const categoryArray = categories.split(",")
          var categoryList = {}
          for (var i=0;i<categoryArray.length;i++){
            var categoryNews = await getEverything(categoryArray[i])
            categoryList[categoryArray[i]] = categoryNews
          }
          if(parseInt(user['lat']) != 0 && parseInt(user['long']) != 0){
            // weather news fetching
            const weatherDataResponse =await getWeather(user['lat'],user['long'])
            // location news fetching
            getHomeTown(user['lat'],user['long']).then(async(response)=>{
              var homeNews = await getEverything(weatherDataResponse.data.name)
              res.render('dashboard',{categories:categoryArray,
                category: Object.keys(categoryList),
                categoryList:categoryList,
                locationNews:homeNews,
                weatherData: weatherDataResponse.data
              })
            })
          }else{
            var homeNews = await getTopHeadlinesof('India')
            res.render('dashboard',{categories:categoryArray,
              categoryList:categoryList,
              locationNews:homeNews,
              weatherData: null
            })
          }
        }else {
            res.redirect('/auth/login_signup')
        }
    }
}

const Article = async (req, res) => {
    const youtubeData = await youtube(req.body.title)
    const summarizationData = await Summarization(req.body.content)
    const sentimentData = await SentimentAnalysis(req.body.title)
    const translation = await Translation(req.body.content,"fr")
    res.render('article',{
      youtubeVideoData : youtubeData,
      contentSummarization : summarizationData,
      sentimentOfTheNews :  sentimentData,
      contentTransulation : translation
    })
}

module.exports = {
    Dashboard,
    Article
}
