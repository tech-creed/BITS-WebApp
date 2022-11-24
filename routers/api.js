const express = require("express");

// route controller
const APIController = require("../controller/api_controller.js");
const router = express.Router();

// API Authentication routes
router.post("/login", APIController.Login)
router.post("/signup", APIController.Signup)

// NEWS API routes
router.get("/news/headlines", APIController.Headlines)
router.get("/news/category/:query", APIController.CategoryHeadlines)
router.get("/news/search/:query", APIController.Search)
router.get("/news/date/:from/:to", APIController.ByDate)

// API GEO Location routes
router.get("/geo/location/:lat/:long", APIController.LatLon)

// API Artificial Intelligence routes
// Text Analysis and NLP
router.get("/nlp/sentiment/:text", APIController.SentimentAnalysis)
router.get("/nlp/keyword/:text", APIController.TextKeywordAnalysis)
router.get("/nlp/summarization/:text", APIController.Summarization)
router.get("/nlp/translation/:text/:lang", APIController.Translation)


// API Weather routes
router.get("/weather/:lat/:long", APIController.LatLonWeather)
router.get("/weather/:location", APIController.LocationWeather)

// API Youtube routes
router.get("/youtube/:query", APIController.YoutubeVideo)


module.exports = router;
