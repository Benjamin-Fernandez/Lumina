const express = require("express");
const router = express.Router();
const { customEndpoint } = require("../controllers/custom.controller");

router.post("/", customEndpoint);

module.exports = router;
