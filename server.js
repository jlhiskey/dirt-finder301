'use strict';

require('dotenv').config();
const pg = require('pg');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const PORT = process.env.PORT || 3000;
const app = express();
const conString = process.env.DATABASE_URL;

app.use(express.urlencoded({extended:true}));
app.listen(PORT, () => console.log('Server is up on ', PORT));

const client = new pg.Client(conString);

client.connect();

app.set('view engine', 'ejs');

// routes

app.get('/', (req, res) => {
  homePage(req, res);
});

app.get('/usercreation', (req, res) => {
  userCreation(req, res);
});

app.get('/about', (req, res) => {
  aboutUs(req, res);
});

app.post('/usercreation/submit', (req, res) => {
  addNew(req, res);
});

// twilio sms response
app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

// route functions

function homePage(req, res) {
  res.render('master', {'thisPage':'partials/home.ejs', 'thisPageTitle':'Home'});
}

function userCreation(req, res) {
  res.render('master', {'thisPage': 'partials/usercreation.ejs', 'thisPageTitle': 'User Creation'});
}

function aboutUs(req, res) {
  res.render('master', {'thisPage': 'partials/about.ejs', 'thisPageTitle':'About Us'});
}

function addNew(req, res) {
  let SQL = `INSERT INTO userinfo (username, siteaddress, sitecity, sitezipcode, sitephone, haveneed) VALUES ( $1, $2, $3, $4, $5, $6)`;

  let values = [
    req.body.username,
    req.body.siteaddress,
    req.body.sitecity,
    req.body.sitezipcode,
    req.body.sitephone,
    req.body.haveneed
  ];
  client.query(SQL, values)
    .then( () => {
      res.render('master', {'thisPage':'partials/home.ejs', 'thisPageTitle':'Your Location was Submitted'
      });
    })
    .catch( () => {
      pageError(res);
    });
}

function pageError(res, err) {
  if (err) { console.log(err); }
  res.render('master', {'thisPage':'partials/error', 'thisPageTitle':'You found an Error'});
}