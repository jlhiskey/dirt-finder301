'use strict';

require('dotenv').config();
const pg = require('pg');
const express = require('express');
const twilio = require('twilio');
const PORT = process.env.PORT || 3000;
const app = express();
const conString = process.env.DATABASE_URL;

app.use(express.urlencoded({extended:true}));
app.listen(PORT, () => console.log('Server is up on ', PORT));

const client = new pg.Client(conString);

client.connect();

app.set('view engine', 'ejs');

//Routes

app.get('/', (req, res) => {
  homePage(req, res);
});


//Route Functions

function homePage(req, res) {
  res.render('master', {'thisPage':'partials/home.ejs', 'thisPageTitle':'Home'})
}