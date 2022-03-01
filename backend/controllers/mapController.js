const mysql = require("mysql2");
const config = require("../config");
const asyncHandler = require("express-async-handler");

const pool = mysql.createPool(config.db);

/**
 * @desc Gets map from db
 * @route GET /api/map
 * @access Private
 */
const getMap = (req, res) => {
  console.log("big");
  pool.query(
    {
      sql: "select * from map where partyCode=?",
      timeout: 40000,
      values: [req.query.partyCode],
    },
    function (error, results, fields) {
      if (error) console.log(error);
      console.log("CODE: " + req.query.partyCode);
      res.status(200).json(results);
    }
  );
};

/**
 * @desc sets map in db
 * @route POST /api/map
 * @access Private
 */
const setMap = (req, res) => {
  if (!req.body.partyCode) {
    res.status(400);
    throw new Error("Map was not properly processed");
  }
  console.log("code: " + req.body.partyCode);

  pool.query(
    {
      sql: "insert into map values(?,?,?)",
      timeout: 40000,
      values: [req.body.partyCode, req.body.mapUrl, req.body.gridVal],
    },
    function (error, results, fields) {
      if (error) console.log(error);
      res.status(200).json({ msg: "good" });
    }
  );
};

const deleteMap = asyncHandler(async (req, res) => {
  console.log("ayyyy");
  await pool.query("delete from map", function (error, results, fields) {
    if (error) console.log(error);
  });

  res.status(200).json({ msg: "good" });
});

module.exports = {
  getMap,
  setMap,
  deleteMap,
};
