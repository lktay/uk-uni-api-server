"use strict";

const express = require("express");
const cors = require("cors");

//connect to db
const pg = require("pg");
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

// const client = new pg.Client(process.env.DATABASE_URL);

const client = new pg.Client({
  user: "leoni",
  host: "localhost",
  database: "universities",
  password: "password",
  port: 5432,
});

//one way to connect to postgres server
// client.connect();

app.get("/", homeHandler);
app.post("/university", addUniversityHandler);
app.get("/university", getUniversityHandler);
app.delete("/university", deleteUniversityHandler);

function homeHandler(req, res) {
  res.status(200).send("all good");
}
//body > {
// "uniname": "University of Aberdeen",
// "uniwebpage": "http://www.abdn.ac.uk/"
//   }
async function addUniversityHandler(req, res) {
  console.log(req.body);
  let uniname = req.body.uniname;
  let uniwebpage = req.body.uniwebpage;

  let SQL =
    await "INSERT INTO university (uniname, uniwebpage) VALUES ($1, $2)";
  //need to sanitise the values so cant be directedly entered into the DB
  //safe value format is $[number], from 1, 1 being the first value (here, uniname)
  //if they are entered directly, they are entered as strings
  let safeValues = [uniname, uniwebpage];
  client
    .query(SQL, safeValues)
    .then((results) => res.status(200).send(results.rows));
}

function getUniversityHandler(req, res) {
  let SQL = "SELECT * FROM university";
  client.query(SQL).then((results) => {
    res.status(200).send(results.rows);
  });
}

async function deleteUniversityHandler(req, res) {
  let uniname = req.query.uniname;
  let safeValues = [uniname];
  let SQL = await "DELETE FROM university WHERE uniname=$1";
  client.query(SQL, safeValues).then((results) => {
    res.status(200).send(results.rows);
  });
}
//if you don't want your server running when it isn't connected, use this:
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`LISTENING ON ${PORT}`);
  });
});
