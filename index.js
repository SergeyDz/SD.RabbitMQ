var express = require('express');
var Client = require('./src/model/ClientSchema.js').Client;
var amqplib = require('amqplib/callback_api');

var q = 'clients';

function bail(err) {
  console.error(err);
  process.exit(1);
}
 
// Publisher 
function publisher(conn) {
  conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.sendToQueue(q, new Buffer('something to do'));
  }
}
 
// Consumer 
function consumer(conn) {
  var ok = conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  }
}


// Constants
var PORT = 8087;

// App
var app = express();
app.get('/', function (req, res) {
  amqplib.connect('amqp://guest:guest@localhost', function(err, conn) {
    if (err != null) bail(err);
      conn.createChannel(on_open);
      function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(q);
        Client.findAll().then(function(data) {
            data.forEach(function(client) {
              ch.sendToQueue(q, new Buffer(client));
            });
            res.send('Done. Processed: ' + data.length);
         }); 
        
      }
    });
  
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);