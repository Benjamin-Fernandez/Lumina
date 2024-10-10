const express = requirew("express");
const router = express.Router();
const { getResponse } = require("../controllers/openai.controller");

router.post("/", getResponse);

module.exports = router;
