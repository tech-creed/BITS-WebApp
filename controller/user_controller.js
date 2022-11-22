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
    q: query,
    language: "en",
  });
};
const getHomeTown = async (lat,long) => {
    const res = await geocoder.reverse({ lat: lat, lon: long });
    return res
}

// Dashboard get page
const Dashboard = async (req, res) => {
    if (req.cookies.credLogin) {
        const cookie_id = jwt.verify(req.cookies.credLogin, "!d0cdc9$6df%58!@b!492*%^fd!731443e@66b#*3714d*9#*42766*4aa38f55b0bd!e5a33%c8%7f7@b0f");
        if (cookie_id) {
          const user = await User.findOne({_id: cookie_id.id}).lean();
          console.log(user)
          getHomeTown(user['lat'],user['long']).then((responce)=>{
              console.log(responce)
          })
        }
      } else {
        res.redirect('/auth/login_signup')
      }
}

module.exports = {
    Dashboard
}