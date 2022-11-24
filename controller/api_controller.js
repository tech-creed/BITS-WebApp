const User = require('../schema/user.js')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const NewsAPI = require("newsapi");
const NodeGeocoder = require('node-geocoder');
const NLPCloudClient = require('nlpcloud');

//4bfaa7ce565d4d15b106d3b902982160
API_KEY = 'fd0bf2b6a6454faf892f3accdd3243ed'
GEO_API = '2f7641abe62841138b210f1fd82926ad'
WEATHER_API = '26a2c30acaaa9b66b0d51ee3c28ada69'
NLP_API = 'f6139861893b450ad6edc711a716d9b482066a0d'

const newsapi = new NewsAPI(`${API_KEY}`);
const options = {
    provider: 'opencage',
    apiKey: `${GEO_API}`,
  };
const geocoder = NodeGeocoder(options);

const getLocation = async(lat,long) => {
    const res = await geocoder.reverse({ lat: lat, lon: long });
    return res
}
const getTopHeadlinesof = (field) => {
  return newsapi.v2.topHeadlines({
    category: field,
    language: "en",
  });
};
const getEverything = (query) => {
  return newsapi.v2.everything({
    q: query,
    language: "en",
  });
};

// Authentication
const Login = async (req, res) => {
  userFind = req.body
  const user = await User.findOne({username: userFind.username}).lean()
  if (!user) {
    return "Username does Not Exist"
  } else {
    if (await bcrypt.compare(userFind.password, user.password)) {
      return user, 'Login Successful';
    } else {
      return "Password Incorrect"
    }
  }
}

const Signup = async (req, res) => {
  req.body["password"] = await bcrypt.hash(req.body["password"], 12);
  var newUser = new User(req.body);
  newUser.save().then((result) => {
    return result, 'Signup Successful'
  }).catch((error) => {
    if (error.code == 11000) {
      return 'Username Already Exist'
    }
  })
}


// News
const Headlines = async (req, res) => {
}
const CategoryHeadlines = async (req, res) => {
  const categoryNews = await getTopHeadlinesof(req.params['query'])
  return categoryNews
}
const Search = async (req, res) => {
  const searchResult = await getEverything(req.params['query'])
  return searchResult
}
const Article = async (req, res) => {
}
const ByDate = async (req, res) => {
}

// Geo Encode
const LatLon = async (req, res) => {
  var result = await getLocation(req.params['lat'], req.params['long']);
  return result
}


// Text Analysis and NLP
const SentimentAnalysis = async (req, res) => {
  // Analysis the text for emotion and sentiment analysis
  const client = new NLPCloudClient('distilbert-base-uncased-emotion',`${NLP_API}`)
  client.sentiment(req.params['text']).then(function (emotionResponse) {
        const clientSentiment = new NLPCloudClient('distilbert-base-uncased-finetuned-sst-2-english',`${NLP_API}`)
        clientSentiment.sentiment(req.params['text']).then(function (sentimentResponse) {
          return sentimentResponse.data, emotionResponse.data;
        })
    }).catch(function (err) {
      return err;
    });
}

const Summarization = async (req, res) => {
  // get input as an paragraph and return the summarize the text to headline
  const client = new NLPCloudClient('bart-large-cnn',`${NLP_API}`, true)
  client.summarization(req.params['text']).then(function (response) {
      return response.data;
    }).catch(function (err) {
      return err;
    });
}
const Translation = async (req, res) => {
}

const TextKeywordAnalysis = async (req, res) => {
  // Extract the keyword form the given text
  const client = new NLPCloudClient('finetuned-gpt-neox-20b',`${NLP_API}`, true)
  client.kwKpExtraction(req.params['text']).then(function (response) {
      return response.data;
    })
    .catch(function (err) {
      return err
    });
}


// Weather
const LatLonWeather = async (req, res) => {
}
const LocationWeather = async (req, res) => {
}


// YoutubeVideo
const YoutubeVideo = async (req, res) =>{
}


module.exports = {
  Login,
  Signup,
  Headlines,
  CategoryHeadlines,
  Search,
  Article,
  ByDate,
  LatLon,
  SentimentAnalysis,
  Summarization,
  Translation,
  TextKeywordAnalysis,
  LatLonWeather,
  LocationWeather,
  YoutubeVideo
}
