'use strict';

require('dotenv').config();
const pg = require('pg');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();
const conString = process.env.DATABASE_URL;


app.use(bodyParser.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static('public'));

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



app.get('/query/:userkey', (req, res) => {
  getUserKey(req, res);
});


app.post('/usercreation/submit', (req, res) => {
  addNew(req, res);
});

app.get('*', (req, res) => {
  noPageError(res);
});

//TWILIO
function twilioResponse(query) {
  console.log('Query', query);

  let body = [ query.Body ];
  let stringify = body.toString();
  let split = stringify.split(' ');

  if (split.length === 1) {
    let SQL = `SELECT * FROM userinfo WHERE sitezipcode = $1`;
    let values = [ split[0] ];
    return client.query(SQL, values);
  }
  if (split.length === 2) {
    let SQL = `SELECT * FROM userinfo WHERE sitezipcode = $1 AND soiltype = $2`;
    let values = [ split[0], split[1] ];
    return client.query(SQL, values);
  }
}

// twilio sms response
app.post('/sms', (req, res) => {

  twilioResponse(req.body)
    .then(data => {
      const twiml = new MessagingResponse();
      for(var i=0; i<data.rows.length; i++) {
        twiml.message(`Here are the people near you:` + `\n` + `Name: ${data.rows[i].username}\n` + `Address: ${data.rows[i].siteaddress}\n` + `City: ${data.rows[i].sitecity}\n` + `Zip: ${data.rows[i].sitezipcode}\n` + `Phone: ${data.rows[i].sitephone}\n` + `Have or Need: ${data.rows[i].haveneed}\n`+ `Soil Type: ${data.rows[i].soiltype}\n`);
      }

      res.writeHead(200, {
        'Content-Type': 'text/xml'
      });
      res.end(twiml.toString());
    });
});

// route functions

function homePage(req, res) {
  res.render('master', {
    'thisPage': 'partials/home.ejs',
    'thisPageTitle': 'Home'
  });
}

function userCreation(req, res) {
  res.render('master', {
    'thisPage': 'partials/usercreation.ejs',
    'thisPageTitle': 'Add New Location'
  });
}

function aboutUs(req, res) {
  res.render('master', {
    'thisPage': 'partials/about.ejs',
    'thisPageTitle': 'About Us'
  });
}


function getUserKey(req, res) {
  let SQL = `SELECT * FROM userinfo WHERE userkey = $1 `;
  let values = [
    req.params.userkey
  ];
  client.query(SQL, values)
    .then(
      data => {
        let userLocation = data.rows;
        if (userLocation.length > 0){
          res.render('master', {
            locations:userLocation,
            'thisPage': 'partials/query',
            'thisPageTitle': 'User Locations:'
          });
        }
      }
    );
}


function addNew(req, res) {
  let SQL = `INSERT INTO userinfo (username, siteaddress, sitecity, sitezipcode, sitephone, haveneed, soiltype, userkey) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8)`;

  let values = [
    req.body.username,
    req.body.siteaddress,
    req.body.sitecity,
    req.body.sitezipcode,
    req.body.sitephone,
    req.body.haveneed,
    req.body.soiltype,
    req.body.userkey
  ];


  client.query(SQL, values)
    .then(() => {
      res.render('master', {
        'thisPage': 'partials/home.ejs',
        'thisPageTitle': 'Your Location was Submitted'
      });
    })
    .catch(() => {
      pageError(res);
    });
}

function pageError(res, err) {
  if (err) {
    console.log(err);
  }
  res.render('master', {
    'thisPage': 'partials/error',
    'thisPageTitle': 'Form Input Error'
  });
}

function noPageError(res, err) {
  if (err) {
    console.log(err);
  }
  res.render('master', {
    'thisPage': 'partials/error',
    'thisPageTitle': 'Page Not Found'
  });
}