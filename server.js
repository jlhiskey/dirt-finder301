'use strict';

require('dotenv').config();
const pg = require('pg');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();
const conString = process.env.DATABASE_URL;
const googleMaps = require('@google/maps');

app.use(bodyParser.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static('public'));

app.listen(PORT, () => console.log('Server is up on ', PORT));

const client = new pg.Client(conString);

client.connect();

const googleMapsClient = googleMaps.createClient({
  key: process.env.GOOGLEMAPS_APIKEY,
  Promise: Promise
});

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

app.get('/map', (req, res) => {
  getCoords(req, res);
});

app.post('/usercreation/submit', (req, res) => {
  addNew(req, res);
});

app.get('*', (req, res) => {
  noPageError(res);
});

// twilio query
// 2018-09-05T00:12:04.794443+00:00 app[web.1]: Query { ToCountry: 'US',
// 2018-09-05T00:12:04.794467+00:00 app[web.1]: ToState: 'WA',
// 2018-09-05T00:12:04.794470+00:00 app[web.1]: SmsMessageSid: 'SMa14e3f9abfef8cab54ce6deed151123c',
// 2018-09-05T00:12:04.794472+00:00 app[web.1]: NumMedia: '0',
// 2018-09-05T00:12:04.794474+00:00 app[web.1]: ToCity: 'SEATTLE',
// 2018-09-05T00:12:04.794475+00:00 app[web.1]: FromZip: '98101',
// 2018-09-05T00:12:04.794478+00:00 app[web.1]: SmsSid: 'SMa14e3f9abfef8cab54ce6deed151123c',
// 2018-09-05T00:12:04.794479+00:00 app[web.1]: FromState: 'WA',
// 2018-09-05T00:12:04.794481+00:00 app[web.1]: SmsStatus: 'received',
// 2018-09-05T00:12:04.794483+00:00 app[web.1]: FromCity: 'SEATTLE',
// 2018-09-05T00:12:04.794484+00:00 app[web.1]: Body: 'Zip:98021',
// 2018-09-05T00:12:04.794486+00:00 app[web.1]: FromCountry: 'US',
// 2018-09-05T00:12:04.794488+00:00 app[web.1]: To: '+12062036412',
// 2018-09-05T00:12:04.794489+00:00 app[web.1]: ToZip: '98154',
// 2018-09-05T00:12:04.794491+00:00 app[web.1]: NumSegments: '1',
// 2018-09-05T00:12:04.794492+00:00 app[web.1]: MessageSid: 'SMa14e3f9abfef8cab54ce6deed151123c',
// 2018-09-05T00:12:04.794494+00:00 app[web.1]: AccountSid: 'ACbe4e55ee7fea99a86a92088c8faa2b3b',
// 2018-09-05T00:12:04.794496+00:00 app[web.1]: From: '+12064739860',
// 2018-09-05T00:12:04.794497+00:00 app[web.1]: ApiVersion: '2010-04-01' }
// 2018-09-05T00:12:04.796588+00:00 app[web.1]: data undefined

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
      // let queryData = JSON.stringify(data.rows[0]);
      console.log(data.rows[0].username);
      const twiml = new MessagingResponse();
      console.log(data.rows.length);

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
    'thisPageTitle': 'User Creation'
  });
}

function aboutUs(req, res) {
  res.render('master', {
    'thisPage': 'partials/about.ejs',
    'thisPageTitle': 'About Us'
  });
}

function addNew(req, res) {
  let SQL = `INSERT INTO userinfo (username, siteaddress, sitecity, sitezipcode, sitephone, haveneed, soiltype) VALUES ( $1, $2, $3, $4, $5, $6, $7)`;

  let values = [
    req.body.username,
    req.body.siteaddress,
    req.body.sitecity,
    req.body.sitezipcode,
    req.body.sitephone,
    req.body.haveneed,
    req.body.soiltype
  ];
  console.log('values=',values);
  
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

//geocode function
function getCoords(req, res) {
  let SQL = `SELECT siteaddress, sitecity, sitezipcode FROM userinfo`;
  client.query(SQL)
    .then( data => {
      let geoData = data.rows; 
      console.log('geodata', geoData);    
      geoData.forEach( (element) => {
        console.log('element', element.siteaddress);
        googleMapsClient.geocode({
          address: `${element.siteaddress}, ${element.sitecity}, ${element.sitezipcode}`//add siteaddress, sitecity, sitezipcode
        })
          .asPromise()
          .then((res) => {
            console.log(res.json.results);
          })
          .then(
            res.render('master', {
              'thisPage': 'partials/map.ejs',
              'thisPageTitle': 'Dirt Finder Map'
            })
          )
          .catch(() => {
            pageError(res);
          });    
      });
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