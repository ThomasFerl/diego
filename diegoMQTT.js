const fs               = require('fs');
const mqtt             = require('mqtt');

// Frauenhofer Zugangsdaten:
const mqtt_host        = "kis127.iff.fraunhofer.de";
const mqtt_port        = "8883";
const mqtt_user        = "ems";
const mqtt_passwd      = "OuzGwxCT5pDtvcxOAG5a";

const pathTo_MQTT_ca   = './Zertifikate/ca.crt';
const pathTo_MQTT_cert = './Zertifikate/ems_client.crt';
const pathTo_MQTT_key  = './Zertifikate/ems_client.key';


//Subscribing to an MQTT Topic
var client                          = {};
var messageHandler                  = [];
module.exports.topic_committValues  = 'ems/diego/gas/messwerte';                  // Messwerte übertragen
module.exports.topic_restartCommitt = 'ems/diego/gas/messwerte/restartCommitt';   // Messwertübertragung von Vorn beginnen
module.exports.topic_forceCommitt   = 'ems/diego/gas/messwerte/forceCommitt';     // Messwertübertragung von Vorn beginnen


// Zugang ohne Authentifizierung und Zertifikate
//const client = mqtt.connect('mqtt://localhost');



// Zugang MIT Zertifikaten
const options = 
   {
    protocol :'mqtts',
    host     : mqtt_host,
    port     : mqtt_port,
    username : mqtt_user,
    password : mqtt_passwd,
    ca       : [fs.readFileSync(pathTo_MQTT_ca)],
    cert     :  fs.readFileSync(pathTo_MQTT_cert),
    key      :  fs.readFileSync(pathTo_MQTT_key),
  };



  function init()
  {
    console.log('try to connect to MQTT-Broker...');

        client = mqtt.connect(options);
        client.on('error'  , (error          ) => { console.log( error);} );
        client.on('connect', (error          ) => { if(error) console.log("Error:" + error); else console.log('Connected'); } );
        client.on('auth'   , (packet, cb     ) => { console.log('Authenticating with certificate...'); cb(null); } );
        client.on('message', (topic , message) => { __handleMQTTmessage( topic , message ) } );
  }
  module.exports.init  = init;
  
       
// Check the certificate properties and perform the authentication logic here.
// Call cb() with an error if authentication fails or null if it succeeds.
 /* 
protocol: the protocol to use (mqtts for SSL/TLS encryption)
host    : the hostname of the broker
port    : the port number to connect to (usually 8883 for SSL/TLS encryption)
ca      : an array of trusted CA certificates
cert    : the client certificate
key     : the client private key
https://www.hivemq.com/article/ultimate-guide-on-how-to-use-mqtt-with-node-js/
*/

function registerMQTTmessageHandler( ftopic , fhandler )
{
  client.subscribe( ftopic ); 

  var ndx = -1;
  for(var i=0; i< messageHandler.length ; i++) if(messageHandler[i].topic==ftopic) ndx=i;
  
  if(ndx<0) messageHandler.push({topic:ftopic, handler:fhandler});
  else messageHandler[ndx].handler = fhandler;
}
module.exports.registerMQTTmessageHandler  = registerMQTTmessageHandler;


function unRegisterMQTTmessageHandler( fhandler )
{
  client.unsubscribe( ftopic );   
  var ndx = -1;
  for(var i=0; i< messageHandler.length ; i++) if(messageHandler[i].handler==fhandler) ndx=i;
  
  if(ndx>=0) messageHandler.splice(ndx, 1); 
  
}
module.exports.unRegisterMQTTmessageHandler  = unRegisterMQTTmessageHandler;



function publish( topic , payLoad )
{
   console.log('try to publish : "'+JSON.stringify(payLoad)+'"');
   client.publish( topic, JSON.stringify(payLoad) , { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
    else console.log('ok')  });
}  
module.exports.publish  = publish;


function __handleMQTTmessage( ftopic , fmessage )
{
   console.log("receive this topic '"+ftopic+"'");
   console.log('try to find the associated dispatcher ...')
    for(var i=0; i < messageHandler.length ; i++) 
      if(messageHandler[i].topic==ftopic) 
      {
        console.log(" found someone and start the callBack")
        var callback = messageHandler[i].handler;
        if(callback) callback( fmessage );
      }  
}


