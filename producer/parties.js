var schema = require('./src/model/PartySchema.js');
var Party = schema.Party;
var PartyType = schema.PartyType;
var amqplib = require('amqplib/callback_api');

var q = 'parties';
var mq = 'amqp://guest:guest@10.1.0.77';

function bail(err) {
  console.error(err);
  process.exit(1);
}
 
function PublishPartyPage(rabbit, pageSize, offset)
{
  console.log('Processing MQ for Partys. Page/Offset: ' + pageSize + '/' + offset);
  Party.findAndCountAll({include:[{model:PartyType}], limit: pageSize, offset: offset}).then(function(data) {
            data.rows.forEach(function(party) {
              console.log(JSON.stringify(party));
              rabbit.sendToQueue(q, new Buffer(JSON.stringify(party)));
            });
   console.log('Total: ' + data.count);
   if(offset < data.count)
   {
     PublishPartyPage(rabbit, pageSize, offset+pageSize);
   }
   else {
     console.log('Done');
     process.exit(0);
   }
  });
}

amqplib.connect(mq, function(err, conn) {
    if (err != null) {
        console.log(err);
        bail(err);
    }
      conn.createChannel(on_open);
      function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(q);
        PublishPartyPage(ch, 50000, 0); 
      }
});