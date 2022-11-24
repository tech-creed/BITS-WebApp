const User = require('../schema/user.js')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const NewsAPI = require("newsapi");
const NodeGeocoder = require('node-geocoder');
const NLPCloudClient = require('nlpcloud');

API_KEY = 'fd0bf2b6a6454faf892f3accdd3243ed'
GEO_API = '2f7641abe62841138b210f1fd82926ad'
WEATHER_API = '26a2c30acaaa9b66b0d51ee3c28ada69'
NLP_API_SUMM = '1932d1c4bdfce7f45ceb0742faafabcaa1c45df1'
NLP_API_SENTI = 'f6139861893b450ad6edc711a716d9b482066a0d'
YOUTUBE_API = 'AIzaSyBAzpEdLmu6iW9TiPt7CTDW7J53RzaypLI'

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
  const user = await User.findOne({
    username: userFind.username
  }).lean()
  if (!user) {
    return res.send("Username does Not Exist")
  } else {
    if (await bcrypt.compare(userFind.password, user.password)) {
      var data = {"user":user, "message":'Login Sucessful'}
      return res.json(data);
    } else {
      return res.send("Password Incorrect")
    }
  }
}

const Signup = async (req, res) => {
  req.body["password"] = await bcrypt.hash(req.body["password"], 12);
  var newUser = new User(req.body);
  newUser.save().then((result) => {
    var data = {"user":result, "message":'Signup Sucessful'}
    return res.json(data);
  }).catch((error) => {
    if (error.code == 11000) {
      return res.send('Username Already Exist');
    }
  })
}


// News
const Headlines = async (req, res) => {
  const HeadlinesNews = await getTopHeadlinesof('general')
  return res.json(HeadlinesNews)
}
const CategoryHeadlines = async (req, res) => {
  const categoryNews = await getTopHeadlinesof(req.params['query'])
  return res.json(categoryNews)
}
const Search = async (req, res) => {
  const searchResult = await getEverything(req.params['query'])
  return res.json(searchResult)
}
const ByDate = async (req, res) => {
  const searchResult = await getEverything('football')
  return res.json(searchResult)
}

// Geo Encode
const LatLon = async (req, res) => {
  var result = await getLocation(req.params['lat'], req.params['long']);
  return res.json(result);
}


// Text Analysis and NLP
const SentimentAnalysis = async (req, res) => {
  // Analysis the text for emotion and sentiment analysis
  const clientSentiment = new NLPCloudClient('distilbert-base-uncased-finetuned-sst-2-english',`${NLP_API_SENTI}`)
    clientSentiment.sentiment(req.params['text']).then(function (sentimentResponse) {
      return res.json(sentimentResponse.data);
    })
}

const Summarization = async (req, res) => {
  // get input as an paragraph and return the summarize the text to headline
  const client = new NLPCloudClient('bart-large-cnn',`${NLP_API_SUMM}`, true)
  client.summarization(req.params['text']).then(function (response) {
      return res.json(response.data);
    }).catch(function (err) {
      return res.send(err);
    });
}
const Translation = async (req, res) => {
  const client = new NLPCloudClient('nllb-200-3-3b',`${NLP_API}`)
  client.translation(req.params['text'],'en',language).then(function (response) {
      return response.data
    })
    .catch(function (err) {
      console.log(err)
    })
}

const TextKeywordAnalysis = async (req, res) => {
  // Extract the keyword form the given text
  const client = new NLPCloudClient('finetuned-gpt-neox-20b',`${NLP_API}`, true)
  client.kwKpExtraction(req.params['text']).then(function (response) {
      return res.json(response.data);
    })
    .catch(function (err) {
      return res.send(err)
    });
}


// Weather
const LatLonWeather = async (req, res) => {
  const endpoint = "https://api.openweathermap.org/data/2.5/weather?lat="+req.params['lat']+"&lon="+req.params['long']+"&appid="+WEATHER_API+"&units=metric"
  const weatherDataReport = axios.get(endpoint)
  return res.json(weatherDataReport)
}
const LocationWeather = async (req, res) => {
  const endpoint = "https://api.openweathermap.org/data/2.5/weather?lat="+req.params['lat']+"&lon="+req.params['long']+"&appid="+WEATHER_API+"&units=metric"
  const weatherDataReport = axios.get(endpoint)
  return res.json(weatherDataReport)
}


// YoutubeVideo
const YoutubeVideo = async (req, res) =>{
  const endpoint = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&order=relevance&q="+req.params['query']+"&key="+YOUTUBE_API
  fetch(endpoint).then(res => res.json()).then(result => {
      return res.json(result)
    });
}


module.exports = {
  Login,
  Signup,
  Headlines,
  CategoryHeadlines,
  Search,
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
