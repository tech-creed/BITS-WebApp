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
router.get("/news/article/:query", APIController.Article)
router.get("/news/date/:from/:to", APIController.byDate)

// API GEO Location routes
router.get("/geo/location/:lat/:long", APIController.LatLong)

// API Artificial Intelligence routes
// Text Analysis and NLP
router.get("/nlp/sentiment/:text", APIController.SentimentAnalysis)
router.get("/nlp/summarization/:text", APIController.Summarization)
router.get("/nlp/translation/:text/:lang", APIController.Translation)


// API Weather routes


module.exports = router;
