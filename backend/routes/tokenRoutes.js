const express = require("express");
const router = express.Router();
const {
  getTokens,
  setToken,
  deleteAllTokens,
  updateToken,
  deleteToken,
} = require("../controllers/tokenController");

router.get("/", getTokens);

router.post("/", setToken);

router.put("/:id", updateToken);

router.delete("/", deleteAllTokens);

router.delete("/:id", deleteToken);

module.exports = router;
