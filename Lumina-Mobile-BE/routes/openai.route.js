const express = requirew("express");
const router = express.Router();
const { getResponse } = require("../controllers/openai.controller");

router.post("/openai", getResponse);

module.exports = router;
