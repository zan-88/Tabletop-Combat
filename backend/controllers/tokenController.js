const mysql = require("mysql2");
const config = require("../config");
const asyncHandler = require("express-async-handler");

const pool = mysql.createPool(config.db);

/**
 * @async
 * @desc Gets tokens from db
 * @route GET /api/tokens
 * @access Private
 */
const getTokens = (req, res) => {
  console.log("Im in");
  pool.query(
    {
      sql: "select * from token where partyCode=?",
      timeout: 40000,
      values: [req.query.partyCode],
    },
    function (error, results, fields) {
      if (error) console.log(error);
      res.status(200).json(results);
    }
  );
};

/**
 * @desc sets token in db
 * @route POST /api/tokens
 * @access Private
 */
const setToken = (req, res) => {
  if (req.body.key == null) {
    res.status(400);
    throw new Error("Token was not properly processed");
  }

  pool.query(
    {
      sql: "insert into token values(?,?,?,?,?,?)",
      timeout: 40000,
      values: [
        req.body.key,
        req.body.id,
        `{ "x": ${req.body.x}, "y": ${req.body.y} }`,
        req.body.dim,
        req.body.url,
        req.body.partyCode,
      ],
    },
    function (error, results, fields) {
      if (error) console.log(error);
      res.status(200).json({ msg: "good" });
    }
  );
};

/**
 * @desc updates token in db
 * @route PUT /api/tokens
 * @access Private
 */
const updateToken = (req, res) => {
  pool.query(
    {
      sql: "update token set location=? where token_key =?",
      timeout: 40000,
      values: [`{ "x": ${req.body.x}, "y": ${req.body.y} }`, req.body.key],
    },
    function (error, results, fields) {
      if (error) console.log("ERROR" + error);
      res.status(200).json({ msg: "good" });
    }
  );
};

const deleteAllTokens = (req, res) => {
  console.log("ayyyy");
  pool.query("delete from token", function (error, results, fields) {
    if (error) console.log(error);
  });

  res.status(200).json({ msg: "good" });
};

const deleteToken = (req, res) => {
  pool.query(
    {
      sql: "delete from token where token_key =?",
      timeout: 40000,
      values: [req.params.id],
    },
    function (error, results, fields) {
      if (error) console.log(error);
      res.status(200).json({ msg: "nice: " + req.params.id });
    }
  );
};

module.exports = {
  getTokens,
  setToken,
  deleteAllTokens,
  updateToken,
  deleteToken,
};
