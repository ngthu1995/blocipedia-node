const express = require("express");
const router = express.Router();

const wikiController = require("../controllers/wikiController");

router.get("/wikis", wikiController.test);

module.exports = router;
