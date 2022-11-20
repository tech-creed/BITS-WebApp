const User = require('../schema/user.js')
const Feedback = require('../schema/feedback.js')
const Reset = require('../schema/reset.js')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const NewsAPI = require("newsapi");
const NodeGeocoder = require('node-geocoder');

API_KEY = '4bfaa7ce565d4d15b106d3b902982160'
API_KEY = 'fd0bf2b6a6454faf892f3accdd3243ed'
GEO_API = '2f7641abe62841138b210f1fd82926ad'

const newsapi = new NewsAPI(`${API_KEY}`);
const options = {
    provider: 'google',
    // Optional depending on the providers
    fetch: customFetchImplementation,
    apiKey: `${GEO_API}`, // OpenCage
    formatter: null //
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
    q: query,
    language: "en",
  });
};

// test page
const Test = async (req, res) => {
   
}

module.exports = {
    
}