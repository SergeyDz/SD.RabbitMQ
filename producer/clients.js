var Client = require('./src/model/ClientSchema.js').Client;
var amqplib = require('amqplib/callback_api');

var q = 'clients';

function bail(err) {
  console.error(err);
  process.exit(1);
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

function PublishClientPage(rabbit, pageSize, offset)
{
  console.log('Processing MQ for Clients. Page/Offset: ' + pageSize + '/' + offset);
  Client.findAndCountAll({limit: pageSize, offset: offset}).then(function(data) {
            data.rows.forEach(function(client) {
              rabbit.sendToQueue(q, new Buffer(client));
            });
   console.log('Total: ' + data.count);
   if(offset < data.count)
   {
     PublishClientPage(rabbit, pageSize, offset+pageSize);
   }
   else {
     console.log('Done');
     process.exit(0);
   }
  });
}

amqplib.connect('amqp://guest:guest@localhost', function(err, conn) {
    if (err != null) bail(err);
      conn.createChannel(on_open);
      function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(q);
        PublishClientPage(ch, 50000, 0); 
      }
});