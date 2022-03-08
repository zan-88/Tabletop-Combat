const express = require("express");
const router = express.Router();
const { getMap, setMap, deleteMap } = require("../controllers/mapController");

router.get("/", getMap);

router.post("/", setMap);

router.delete("/", deleteMap);

module.exports = router;
