const express = require("express");
const router = express.Router();
const { getResponse } = require("../controllers/openai.controller");

router.post("/", getResponse);

module.exports = router;
