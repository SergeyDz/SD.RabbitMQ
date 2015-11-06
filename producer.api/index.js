var express = require('express');
var router = require('./src/routes/route.js');
var PartiesRouter = require('./src/routes/route.party.js');
var bodyParser = require('body-parser');
var amqplib = require('amqplib/callback_api');

var q = 'parties';
var mq = 'amqp://guest:guest@10.1.0.77';
var port = process.env.PORT || 8090;        // set our port

function bail(err) {
  console.error(err);
  process.exit(1);
}

var app = express();                 // define our app using express

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

amqplib.connect(mq, function(err, conn) {
    if (err != null) {
        console.log(err);
        bail(err);
    }
      conn.createChannel(on_open);
      function on_open(err, ch) {
        if (err != null) bail(err);
        PartiesRouter(router, ch); 
      }
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);