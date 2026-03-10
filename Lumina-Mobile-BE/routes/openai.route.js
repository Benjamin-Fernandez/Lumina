const express = require("express");
const router = express.Router();
const { getResponse, getSimpleResponse } = require("../controllers/openai.controller");

router.post("/", getResponse);
router.post("/query", getSimpleResponse);

module.exports = router;
