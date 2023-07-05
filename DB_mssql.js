
const mssql     = require('mssql');

const DEBUGGING = true;

module.exports.last_ErrMsg   = "";
module.exports.last_dbResult = "";
module.exports.busy          = false;


async function runSQL( db , sqlStatement , params )
{
 try{
      console.log("runSQL : " + sqlStatement );
      console.log("DB     : " + JSON.stringify(db) );
      console.log("param  : " + JSON.stringify(params) );
  
      var config = {
                user     : db.userName,
                password : db.pwd,
                server   : db.Server,
                database : db.Database,
                stream   : false, 
                options  : {
                             trustedConnection     : true ,
                             encrypt               : true , // Wenn du eine verschlüsselte Verbindung verwendest (empfohlen)
                             trustServerCertificate: true // Deaktiviere die Validierung des Zertifikats
                           }
                    }
      console.log("try to connect...");
      await mssql.connect(config);
      console.log("successful connected ");

      console.log("ggf parameter ?");
      var request = new mssql.Request();
      if(params)
      {
       for(var key in params)
       {
         request.input(key , params[key] );
         console.log('-> ' + key + ' = ' + params[key] );
       }
      }
      console.log("runQuery...");
      var result = await request.query(sqlStatement);

      if(result.recordset) return result.recordset;
      else                 return {rowsAffected:result.rowsAffected};
     }
     catch(err) { console.error(err) ; return {error:true , errMsg:err}; }   
}
  

module.exports.runSQL  = runSQL;




module.exports.___runSQL=( db , sqlStatement , params , callBack )=>
{ 
  console.log("runSQL : " + sqlStatement );
  console.log("DB     : " + JSON.stringify(db) );
  console.log("param  : " + JSON.stringify(params) );
  
   var result = "";
   var errMsg = "";
   var config = {
                user     : db.userName,
                password : db.pwd,
                server   : db.Server,
                database : db.Database,
                stream   : true, 
                options  : {
                             trustedConnection     : true ,
                             encrypt               : true , // Wenn du eine verschlüsselte Verbindung verwendest (empfohlen)
                             trustServerCertificate: true // Deaktiviere die Validierung des Zertifikats
                           }
                }

                  mssql.connect( config , 
                  function(err)  // callBack on connected
                  {
                   if(err) 
                   {
                    console.log('Connection-Error ' + err);
                    module.exports.last_ErrMsg   = err;
                    module.exports.last_dbResult =  "";
                    
                    if(callBack) callBack(err , "" ); 
                   }
                   else
                       var request        = new mssql.Request();
                           request.stream = true;
                                                     
                           if(params)
                           {
                            console.log('Parameter...');
                            for(var key in params)
                            {
                              request.input(key , params[key] );
                              console.log('-> ' + key + ' = ' + params[key] );
                            }
                            
                           }

                           request.query( sqlStatement );

                    var rowCount   = 0;
                    var BATCH_SIZE = 50;

                         request.on('recordset', function(columns) 
                                              { // Emitted once for each recordset in a query   
                                                console.log('Start building result-dataset ...');     
                                                result = '[';
                                              });

                         request.on('row',    function(row) 
                                              { // Emitted for each row in a recordset
                                                console.log('ON_ROW: ');    
                                                var st =  JSON.stringify(row)
                                                if (rowCount > 0) st = ',' + st; 

                                                result = result + st;
                                                console.log(result);
                                                rowCount++;
                                              });
 
                         request.on('error',  function(err)
                                              { // May be emitted multiple times
                                                  console.error('ON_Error:' + err);

                                                  module.exports.last_ErrMsg   = err;
                                                  module.exports.last_dbResult =  "";
                                                 
                                                  if(callBack) callBack(err , "" ); 
                                              });

                         request.on('done',   function(returnValue) 
                                              {// Always emitted as the last one
                                               console.log('ON_done -> returnValue:');
                                               console.dir(returnValue);
                                               console.log('--------------------------------------------------------------------------------------------------------------------------')
                                               result = result + ']';
                                               mssql.close();
                                               module.exports.last_ErrMsg   = "";
                                               module.exports.last_dbResult = result;
                                               
                                               if(callBack) callBack( err , result , ); 
                                              });
                  });
}
