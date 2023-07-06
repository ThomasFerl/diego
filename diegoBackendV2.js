const http        = require('http');
const express     = require('express');
const fs          = require('fs-extra');
const path        = require('path');
const { networkInterfaces } = require('os');
const { Console } = require('console');

// Messdaten-Verteilung
const diegoMQTT   = require('./diegoMQTT');


// Messdaten - Speicherung
const DB          = require('./DB');
const sqliteDB    = './diegoValues.db';

// Distribute MSSQL
const DB_mssql    = require('./DB_mssql');
const mssqlDB     = { Server:"EMSSVRSQL01" , Database:"DIEGO_Values" , userName:"import" , pwd:"daten" };
//const mssqlDB   = { Server:"10.102.12.16" , Database:"DIEGO_Values" , userName:"import" , pwd:"daten" };
const tableName   = "rawValues";  

const httpApp     = express();
const port        = 4007;

var staticPath    = path.join (__dirname, 'frontend' );
console.log("static Path: " + staticPath );

// MQTT initialisieren ....
var mqttPublishing  = false;
var mqttRefract     = 60;  // Sekunden
var mqttLastPublish = 0;
diegoMQTT.init();
diegoMQTT.registerMQTTmessageHandler( diegoMQTT.topic_committValues  , callBack_onCommittValues  );
diegoMQTT.registerMQTTmessageHandler( diegoMQTT.topic_restartCommitt , callBack_onRestartCommitt );
diegoMQTT.registerMQTTmessageHandler( diegoMQTT.topic_forceCommitt   , callBack_onForceCommit    );


function formatDateTime( unixTimestamp )
{
  var dt = new Date(now());
  
  if(unixTimestamp) dt = new Date(unixTimestamp)
  
  var hh = dt.getHours();
  var mn = dt.getMinutes();
  var ss = dt.getSeconds();
  var mm = dt.getMonth()+1;
  var dd = dt.getDay()+2;
  var yy = dt.getFullYear();

  if(hh < 10){hh = '0'+hh;}
  if(mn < 10){mn = '0'+mn;}
  if(ss < 10){ss = '0'+ss;}
  if(mm < 10){mm = '0'+mm;}
  if(dd < 10){dd = '0'+dd;}

  return  (dd+'.'+mm+'.'+yy+' '+hh+':'+mn+':'+ss);
}


function now()
{
  return  formatDateTime();
}



function insertRecord ( req , res )
// httpApp.get('/txiput/:device/:chanel/:timeStamp/:value'   
{
  console.log("insertRecord()  values:");

 var dt     = req.params.timeStamp;
 var device = req.params.device;
 var chanel = req.params.chanel;
 var value  = req.params.value;

console.log("dt (timeStamp) : " + dt );
console.log("device : " + device );
console.log("chanel : " + chanel );
console.log("value  : " + value );

 var sql    = "insert into rawValues( dt , device , chanel , value ) values(?,?,?,?)";
 var params = [                       dt , device , chanel , value ];

     if ( DB.runSQL( sqliteDB , sql , params ))
     {
      res.send( "OK => ");
      console.log("insertRecord.runSQL() : " + DB.dbResult + ": " + DB.lastErrMsg );
      return 0;
     }
     else
      {
        console.log("insertRecord.runSQL() : " + DB.dbResult + ": " + DB.lastErrMsg );
        res.send( "ERR" );
      }
 }


function selectRecords(req , res )
// httpApp.get('/ls/:device/:chanel/:from/:to/:groupBy/:format
{
  var dtFrom = req.params.from;
  var dtTo   = req.params.to;
  var chanel = req.params.chanel;
  var groupBy= req.params.groupBy;
  var device = req.params.device;
  var format = req.params.format;
  var params = [];

  if((format=='*')||(format=='')) format='JSON';

  var SQL = "select (strftime('%d' , datetime(dt,'unixepoch'))) as day , "
          + "       (strftime('%m' , datetime(dt,'unixepoch'))) as month , "
          + "       (strftime('%Y' , datetime(dt,'unixepoch'))) as year,  "
          + "       (strftime('%H' , datetime(dt,'unixepoch'))) as hour , "
		  + "       (strftime('%M' , datetime(dt,'unixepoch'))) as minute , "

      if(groupBy != "*") SQL = SQL + " sum(value) as value ";
      else               SQL = SQL + " value ";

      SQL = SQL + " from rawValues where ID<>0 AND device=? AND chanel=? ";
      params.push(device);
      params.push(chanel);

  if(dtFrom != "*") { SQL = SQL + " AND dt >= ? " ; params.push(dtFrom); }
  if(dtTo   != "*") { SQL = SQL + " AND dt <= ? " ; params.push(dtTo);   }
  
  if(groupBy != "*") SQL = SQL + " group by " + groupBy;

  SQL = SQL + " Order by dt";


  if( DB.fetchQuery( sqliteDB , SQL , params , format ))
 {
   console.log("OK-Return from DB.fetchValue_from_Query() : " + DB.last_dbResult );
   res.send( "OK => " + DB.last_dbResult );
 }
  else
  {
    console.log("Error-Return from DB.fetchValue_from_Query() : " + DB.last_ErrMsg );
    res.send( "ERROR => " + DB.last_ErrMsg );
  }
}

                   

function selectRecords_byYear(req , res )
// /lsByYear/:device/:chanel/:year/:groupBy/:format'   
// Bsp.: http://emssvrservice02:4002/lsByYear/DIEGOtest/IMP1_IMP1/2023/*/JSON
{
  var year = req.params.year;
  var device = req.params.device;
  var chanel = req.params.chanel;
  var groupBy= req.params.groupBy;
  var format = req.params.format;
  var params = [];

  if((format=='*')||(format=='')) format='JSON';
 
  var SQL = "select (strftime('%d' , datetime(dt,'unixepoch'))) as day , "
          + "       (strftime('%m' , datetime(dt,'unixepoch'))) as month , "
          + "       (strftime('%Y' , datetime(dt,'unixepoch'))) as year,  "
          + "       (strftime('%H' , datetime(dt,'unixepoch'))) as hour , "
		  + "       (strftime('%M' , datetime(dt,'unixepoch'))) as minute , "

      if(groupBy != "*") SQL = SQL + " sum(value) as value ";
      else               SQL = SQL + " value ";

      SQL = SQL + " from rawValues where ID<>0 AND device=? AND chanel=?  AND strftime('%Y' , datetime(dt,'unixepoch'))=? ";
	  
      params.push(device);
      params.push(chanel);
	  params.push(year);
  
  if(groupBy != "*") SQL = SQL + " group by " + groupBy;

  SQL = SQL + " Order by dt";


  if( DB.fetchQuery( sqliteDB , SQL , params , format ))
 {
   console.log("OK-Return from DB.fetchValue_from_Query() : " + DB.last_dbResult );
   res.send( "OK => " + DB.last_dbResult );
 }
  else
  {
    console.log("Error-Return from DB.fetchValue_from_Query() : " + DB.last_ErrMsg );
    res.send( "ERROR => " + DB.last_ErrMsg );
  }
}


function selectRecords_byMonth(req , res )
 // Bsp.: http://emssvrservice02:4002/lsByMonth/DIEGOtest/IMP1_IMP1/2023/03/*/JSON 
{
  var year    = req.params.year;
  var month   = req.params.month;
  var device  = req.params.device;
  var chanel  = req.params.chanel;
  var groupBy = req.params.groupBy;
  var format  = req.params.format;
  var params  = [];

  if((format=='*')||(format=='')) format='JSON';
 
  var SQL = "select (strftime('%d' , datetime(dt,'unixepoch'))) as day , "
          + "       (strftime('%m' , datetime(dt,'unixepoch'))) as month , "
          + "       (strftime('%Y' , datetime(dt,'unixepoch'))) as year,  "
          + "       (strftime('%H' , datetime(dt,'unixepoch'))) as hour , "
		  + "       (strftime('%M' , datetime(dt,'unixepoch'))) as minute , "

      if(groupBy != "*") SQL = SQL + " sum(value) as value ";
      else               SQL = SQL + " value ";

      SQL = SQL + " from rawValues where ID<>0 AND device=? AND chanel=? "
	  SQL = SQL                            + " AND strftime('%Y' , datetime(dt,'unixepoch'))=? ";
	  SQL = SQL                            + " AND strftime('%m' , datetime(dt,'unixepoch'))=? ";
	  
      params.push(device);
      params.push(chanel);
	  params.push(year);
	  params.push(month);
  
  if(groupBy != "*") SQL = SQL + " group by " + groupBy;

  SQL = SQL + " Order by dt";


  if( DB.fetchQuery( sqliteDB , SQL , params , format ))
 {
   console.log("OK-Return from DB.fetchValue_from_Query() : " + DB.last_dbResult );
   res.send( "OK => " + DB.last_dbResult );
 }
  else
  {
    console.log("Error-Return from DB.fetchValue_from_Query() : " + DB.last_ErrMsg );
    res.send( "ERROR => " + DB.last_ErrMsg );
  }
}



function selectRecords_byDay(req , res )
 // Bsp.: http://emssvrservice02:4002/lsByMonth/DIEGOtest/IMP1_IMP1/2023/03/*/JSON 
{
  var year    = req.params.year;
  var month   = req.params.month;
  var day     = req.params.day;
  var device  = req.params.device;
  var chanel  = req.params.chanel;
  var groupBy = req.params.groupBy;
  var format  = req.params.format;
  var params  = [];

  if((format=='*')||(format=='')) format='JSON';
 
  var SQL = "select (strftime('%d' , datetime(dt,'unixepoch'))) as day , "
          + "       (strftime('%m' , datetime(dt,'unixepoch'))) as month , "
          + "       (strftime('%Y' , datetime(dt,'unixepoch'))) as year,  "
          + "       (strftime('%H' , datetime(dt,'unixepoch'))) as hour , "
		  + "       (strftime('%M' , datetime(dt,'unixepoch'))) as minute , "

      if(groupBy != "*") SQL = SQL + " sum(value) as value ";
      else               SQL = SQL + " value ";

      SQL = SQL + " from rawValues where ID<>0 AND device=? AND chanel=? "
	  SQL = SQL                            + " AND strftime('%Y' , datetime(dt,'unixepoch'))=? ";
	  SQL = SQL                            + " AND strftime('%m' , datetime(dt,'unixepoch'))=? ";
	  SQL = SQL                            + " AND strftime('%d' , datetime(dt,'unixepoch'))=? ";
	  
      params.push(device);
      params.push(chanel);
	  params.push(year);
	  params.push(month);
	  params.push(day);
  
  if(groupBy != "*") SQL = SQL + " group by " + groupBy;

  SQL = SQL + " Order by dt";


  if( DB.fetchQuery( sqliteDB , SQL , params , format ))
 {
   console.log("OK-Return from DB.fetchValue_from_Query() : " + DB.last_dbResult );
   res.send( "OK => " + DB.last_dbResult );
 }
  else
  {
    console.log("Error-Return from DB.fetchValue_from_Query() : " + DB.last_ErrMsg );
    res.send( "ERROR => " + DB.last_ErrMsg );
  }
}



function selectDevices (req , res )
{
  var format='JSON';
  var SQL    = "select distinct device from rawValues order by device";
  var params = [];

 if( DB.fetchQuery( sqliteDB , SQL , params , format ))
 {
   console.log("OK-Return from DB.fetchValue_from_Query() : " + DB.last_dbResult );
   res.send( "OK => " + DB.last_dbResult );
 }
  else
  {
    console.log("Error-Return from DB.fetchValue_from_Query() : " + DB.last_ErrMsg );
    res.send( "ERROR => " + DB.last_ErrMsg );
  }
}



function selectChanels ( req , res )
{
  var device    = req.params.device;
 
 console.log("lsChanels for device " + device + " from remote IP: " + req.connection.remoteAddress);

 if( DB.fetchQuery( sqliteDB , "select distinct chanel from rawValues Where device=? order by chanel" , [device] , "JSON" ))
 {
   console.log("OK-Return from DB.fetchValue_from_Query() : " + DB.last_dbResult );
   res.send( "OK => " + DB.last_dbResult );
 }
  else
  {
    console.log("Error-Return from DB.fetchValue_from_Query() : " + DB.last_ErrMsg );
    res.send( "ERROR => " + DB.last_ErrMsg );
  }
}



function deviceState (req , res )  
//state/:device/:chanel'    
{
  var device  = req.params.device;
  var chanel  = req.params.chanel;

  if(DB.deviceState( sqliteDB , device , chanel ))
  {
    console.log("OK-Return from DB.DeviceState() : " + DB.last_dbResult );
    res.send( "OK => " + DB.last_dbResult );
  }
  else
  {
    console.log("Error-Return from DB.DeviceState() : " + DB.last_ErrMsg );
    res.send( "ERROR => " + DB.last_ErrMsg );
  }

}

function pragma( req , res )
{
  var tabl    = req.params.table;
  console.log("pragma from (table) :" + tabl );

  if(  DB.fetchQuery( sqliteDB , "PRAGMA table_info("+tabl+")" , null , "JSON" ))
  {
    console.log("OK-Return from DB.fetchValue_from_Query() : " + DB.last_dbResult );
    res.send( "OK => " + DB.last_dbResult );
  }
   else
   {
     console.log("Error-Return from DB.fetchValue_from_Query() : " + DB.last_ErrMsg );
     res.send( "ERROR => " + DB.last_ErrMsg );
   }
}


function login( req , res )
{
  var device    = req.params.device;
  var remoteIP  = req.connection.remoteAddress;
  var ID_device = "";
  var ID_login  = "";

  console.log("login from (device) :" + device + " from remote IP: " + remoteIP);

  var d      = new Date();
  var t      = Math.floor(d.getTime()/1000);

  if (DB.runSQL( sqliteDB , "insert into login(device , DT , remoteIP ) values( ? ,? , ?)" , [device , t , remoteIP] ) );
  {
    ID_login = JSON.parse(DB.last_dbResult).lastInsertRowid;
    console.log("insert into login : -> ID = " + ID_login );
  }

  console.log("login: ->  " + t );
  res.send(  JSON.stringify({DT:t,ID:ID_login} ));
}


function ping( req , res )
{
  res.send( "PONG" );
} 



async function selectMSSQL( req , res )
{
      console.log("dive ito testMSSQL..."); 
      
      var queryResult = await DB_mssql.runSQL( mssqlDB , "select * from rawValues" , {} ); 
          
      console.log("return from runSQL() with result:"); 
      console.dir(queryResult);

      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Type', 'application/json');
      res.send( queryResult );
    
} 

async function insertMSSQL( req , res )
{
  var queryResult = await DB_mssql.runSQL( mssqlDB , "Insert into rawValues(dt,source,chanel,value,unit) values(@dt,@source,@chanel,@value,@unit)" , {dt:"",source:"TestX",chanel:"chanX",value:815,unit:"kWh"});
    
      console.log("insertMSSQL Result");
      console.log("queryResult: " + queryResult );

      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Type', 'application/json');
      res.send( queryResult );
    
} 

async function distributeMSSQL(req, res) 
{
  if (DB.fetchQuery(sqliteDB, 'Select * from rawValues where id not in(Select ID_record from distributed_mssql) order by dt,device', [], 'JSON')) 
  {
    res.send("OK");
  } else {
           res.send("ERROR: Fehler bei Abfrage der Messdaten aus sqlite-DB");
           return;
         }

  try {
    console.log('try to parse JSON ...');
    var items = JSON.parse(DB.last_dbResult);
    console.log('...ok');
  } catch (err) {
                 console.error('parse Error:' + err);
                 return;
                }

  for (var i = 0; i < items.length; i++) 
  {
    console.log('copy item ' + (i + 1) + ' to mssql');
    var item = items[i];

    var queryResult = await DB_mssql.runSQL(mssqlDB, "Insert into rawValues(dt,source,chanel,value,unit) values(@dt,@source,@chanel,@value,@unit)",
      { dt: formatDateTime(item.dt * 1000), source: item.device, chanel: item.chanel, value: item.value, unit: "imp" });

      if (queryResult.rowsAffected > 0)
      {
        DB.runSQL(sqliteDB,'Insert into distributed_mssql(id_record) values(?)',[item.ID]);
      }

    console.log(queryResult);
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------

function callBack_onCommittValues( message )
// Der Versand der Daten wird von uns selbst aboniert.
// Der Empfang eines Datensatzes kann als Bestätigung aufgefasst werden, dass die Daten beim Broker angekommen sind
{
  console.log("MQTT-Message => onCommittValues ");
  try { 
         var item = JSON.parse(message) 
         console.dir( item );
         if (item.ID)  DB.runSQL(sqliteDB,'Insert into distributed_mqtt(id_record) values(?)',[item.ID]);
        }
  catch(err) {console.error(err)}
}


function callBack_onRestartCommitt( message )
{
  console.log("MQTT-Message => onRestartCommitt");
  try { 
    var msg = JSON.parse(message) 
    console.dir( msg );
    if (msg.cmd=="reset") DB.runSQL(sqliteDB,'delete from distributed_mqtt' , [] );
   }
catch(err) {console.error(err)}
}


function callBack_onForceCommit( message )
{
  console.log("MQTT-Message => onForceCommit");
  try { 
    var msg = JSON.parse(message) 
    console.dir( msg );
    if (msg.cmd=="committ") distributeMQTT();
   }
catch(err) {console.error(err)}
}


function mqttPing()
{
  diegoMQTT.publish(diegoMQTT.topic_committValues , {dt:now(), msg:"Test PING"} );
}





function distributeMQTT() 
{
  var thisMoment = Date.now() / 1000;
  
  if((thisMoment-mqttLastPublish)<mqttRefract) return;

  mqttLastPublish = thisMoment;
   
  console.log("Distribute MQTT");
  console.log("try to find new records ...");

  if (!DB.fetchQuery(sqliteDB, 'Select * from rawValues where id not in(Select ID_record from distributed_mqtt) order by dt,device', [], 'JSON'))
  { 
    console.error(DB.lastErrMsg); 
    return;
  }

  try {
    console.log('try to parse JSON ...');
    var items = JSON.parse(DB.last_dbResult);
    console.log('...ok');
  } catch (err) {
                 console.error('parse Error:' + err);
                 return;
                }

  for (var i = 0; i < items.length; i++) 
  {
    console.log('publish item ' + (i + 1) + ' to MQTT-Brooker');
    var item = items[i];
        mq
        DB.runSQL(sqliteDB,'Insert into distributed_mqtt(id_record) values(?)',[item.ID]);
  }
}



function mqttStartPublishing(req, res) 
{
  if(mqttPublishing) 
  {
    res.send("Publish process is alredy running");
    return;
  }
  else
       {
        res.send("start Publishing ...");
        mqttPublishing = true;
       }
}      

// jede Sekunde prüfen, ob volle Stunde erreicht wurde ....
setInterval( ()=>{
                   var dt = new Date(now());
                   if(dt.getMinutes()==0) distributeMQTT();
                 } , 1000 
            );  


// CORS
httpApp.use(( req , res , next ) =>
{
  console.log("request from: " + req.hostname + " (IP: "+req.ip+")" + "  at: " + now() );
  console.log("URL         : " + req.originalUrl);
  console.log("Params      : " + JSON.stringify(req.params));
  console.log("Query       : " + JSON.stringify(req.query));
  console.log("Body        : " + JSON.stringify(req.body));
  console.log("");
  console.log("--------------------------------------------------------------------------------------");
  console.log("use CORS ...");
  res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');

  next();

});



httpApp.use( express.static( staticPath  ) );

httpApp.get('/txiput/:device/:chanel/:timeStamp/:value'                           , insertRecord  );

httpApp.get('/ls/:device/:chanel/:from/:to/:groupBy/:format'                      , selectRecords );

httpApp.get('/lsByYear/:device/:chanel/:year/:groupBy/:format'                    , selectRecords_byYear );
httpApp.get('/lsByMonth/:device/:chanel/:year/:month/:groupBy/:format'            , selectRecords_byMonth );
httpApp.get('/lsByDay/:device/:chanel/:year/:month/:day/:groupBy/:format'         , selectRecords_byDay );


httpApp.get('/lsDev'                                                               , selectDevices );

httpApp.get('/lsChan/:device'                                                      , selectChanels );

httpApp.get('/state/:device/:chanel'                                               , deviceState );

httpApp.get('/login/:device'                                                       , login );

httpApp.get('/ping'                                                                , ping );

httpApp.get('/pragma/:table'                                                       , pragma );

httpApp.get('/mqttPing'                                                            , mqttPing );
httpApp.get('/mqttStartPublishing'                                                 , mqttStartPublishing );

//-----------------------------------------------------------------------------------------------
httpApp.get('/lsMSSQL'                                                            , selectMSSQL  );
httpApp.get('/insMSSQL'                                                           , insertMSSQL  );
httpApp.get('/distributeMSSQL'                                                    , distributeMSSQL  );
//------------------------------------------------------------------------------------------------



const  webServer=http.createServer( httpApp );

webServer.listen( port , () => {console.log('Server listening on Port ' + port )});
