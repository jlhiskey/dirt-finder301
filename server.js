'use strict';

require('dotenv').config();
const pg = require('pg');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const PORT = process.env.PORT || 3000;
const app = express();
const conString = process.env.DATABASE_URL;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.listen(PORT, () => console.log('Server is up on ', PORT));

const client = new pg.Client(conString);

client.connect();

app.set('view engine', 'ejs');

// routes

app.get('/', (req, res) => {
  homePage(req, res);
});


// route functions

function homePage(req, res) {
  res.render('master', {'thisPage':'partials/home.ejs', 'thisPageTitle':'Home'});
}


// twwilio query
function twilioResponse (query) {
  console.log('Query', query);
  let SQL = `SELECT * FROM userinfo WHERE sitezipcode = $1`;

  let values = [ query.zip ];

  return client.query(SQL, values);
}

// twilio sms response
app.post('/sms', (req, res) => {

  twilioResponse(req.body)
    .then( data => {
      console.log('data', data.rows);
      let queryData = data.rows;
      const twiml = new MessagingResponse();

      twiml.message(`Here are the people near you: ${queryData}`);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    });
});