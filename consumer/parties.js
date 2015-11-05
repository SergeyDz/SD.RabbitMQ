var amqplib = require('amqplib/callback_api');
var Rest = require('node-rest-client').Client;
var Promise = require('promise');

var q = 'parties';
var url = 'http://10.1.0.166/Open.Services/';
var mq = 'amqp://guest:guest@10.1.0.77';

function bail(err) {
  console.error(err);
  process.exit(1);
}
 
// Consumer 
function consumer(conn, token, http) {
  var ok = conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        var party = JSON.parse(msg.content.toString());
        postParty(http, token, party).then(function(data) {
          console.log('Party added. #: ' + data);
          ch.ack(msg);
        },
        function(response) {
          console.log('Skip message with error: ' + response);
          ch.nack(msg, false, false);
          //process.exit(1);
        });
        
      }
    });
  }
}

function postParty(http, token, party)
{
  var promise = new Promise(function(resolve, reject) {
    var args = {
      data:  { partyId: party.PartyId, Name: party.Name, partytype: party.PartyType.Key},
      headers:{"Content-Type": "application/json", "Authorization" : token} 
    }; 
     
    http.post(url+"api/common/party", args, function(data, response) {
        if (response.statusCode != 200) {
          if (data.hasOwnProperty("error")) {
            reject(data.error);  
          } else {
            console.log("error from server: " + data);
            reject(data);  
          }
        }
        resolve(data);
    })
    .on('error', function(err) {
      console.log(err);
      reject(err);
    });
    
    });
    return promise;
}


function authorize(http)
{
  var promise = new Promise(function(resolve, reject) {
  // set content-type header and data as json in args parameter 
  var args = {
      data:  "grant_type=password&username=admin&password=&tenantId=",
      headers:{"Content-Type": "application/x-www-form-urlencoded"} 
    };
    
    console.log('Authorize started');
    
    http.post(url + "token", args, function(data,response) {
      if (response.statusCode != 200) {
        if (data.hasOwnProperty("error")) {
          reject(data.error);  
        } else {
          reject(response.headers.status);  
        }
      }
      resolve(data);
    })
    .on('error', function(err) {
     reject(err);
   });
  });
  
  return promise;
}
  
var http = new Rest();


authorize(http).then(function(data) {
  var token = 'Bearer ' +  data.access_token;
  console.log('Connection with REST established');
  amqplib.connect(mq, function(err, conn) {
    if (err != null) {
        console.log(err);
        bail(err);
    }
    consumer(conn, token, http);
  });
},
function(rest_error)
{
  console.log('Cant authorize REST service: '  + rest_error);
}
);

console.log('Service started');
