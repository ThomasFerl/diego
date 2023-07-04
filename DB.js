const sqlite    = require('better-sqlite3');

const DEBUGGING = true;

function log(s)
{
  if(DEBUGGING) console.log(s);
}

module.exports.last_ErrMsg   = "";
module.exports.last_dbResult = "";

exports.runSQL=( db , SQL , params )=>
 {
        result        = true;
   this.last_ErrMsg   = "";
   this.last_dbResult = "";

   log('runSQL with SQL: ' + SQL + '  with params: ' + params );

   try {
          var connection    = sqlite( db );
          log('connection.Properties : ' + JSON.stringify(connection));

          var stmt               = connection.prepare(SQL);
          var execInfo           = stmt.run( params );
          this.last_dbResult     = JSON.stringify( execInfo );
          log('runSQL  : ' + this.last_dbResult );
       }
        catch(error) { result=false ; this.last_ErrMsg=error ; log('runSQL ERROR: ' + this.last_ErrMsg );}

   connection.close();

   return result;

 } // runSQL()


module.exports.fetchValue_from_Query=( db , SQL , params )=>
{
           result        = true;
      this.last_ErrMsg   = "";
      this.last_dbResult = "";

      try {
             var connection     = sqlite( db );
             log('connection.Properties : ' + JSON.stringify(connection));
             log('fetchValue_from_Query with SQL: ' + SQL + '  with params: ' + params );

             var stmt           = connection.prepare(SQL);
             var execInfo       = stmt.get( params );

             if(!execInfo)  // leere Ergebnismenge
             {
               log('leere Ergebnismenge (null) ');
               this.last_dbResult = "";
             }
             else
                {
                  log("execInfo : " + JSON.stringify(execInfo))

                  var objKeys        = Object.keys(execInfo);
                  var key            = objKeys[0];
                  this.last_dbResult = execInfo[key];

                  log('fetchValue_from_Query : ' + this.last_dbResult );
                }
           }
           catch(error) { result=false ; this.last_ErrMsg=error ; log('fetchValue_from_Query ERROR: ' + this.last_ErrMsg )}

      connection.close();

      return result;

} // fetchValue_from_Query()



module.exports.fetchQuery=( db , SQL , params , format )=>
{
           result        = true;
      this.last_ErrMsg   = "";
      this.last_dbResult = "";

      try {
            var connection     = sqlite( db );
            log('connection.Properties : ' + JSON.stringify(connection));
            log('fetchQuery with SQL   : ' + SQL + '  with params: ' + params );

            var query          = connection.prepare( SQL );

            if (params)  var execInfo       = query.all( params ); 
            else         var execInfo       = query.all( );

            if(format=="JSON") { this.last_dbResult = JSON.stringify(execInfo) }
            if(format=="HTML")
            {
               var HTML    = [];
               var dataset = [];
               for (const record of query.iterate())  { dataset.push(record); }

               HTML.push('<Table>');
               for (var recNo=0 ; recNo < dataset.length ; recNo++ )
               {
                   HTML.push(' <tr>');
                   for (var field in dataset[recNo] ) { HTML.push("    <td>" + dataset[recNo][ field ] + "</td>"); }
                   HTML.push(' </tr>');
               }
               HTML.push('</Table>');

              this.last_dbResult = '';
              for (var i=0 ; i < HTML.length ; i++ ) { this.last_dbResult = this.last_dbResult + ' ' + HTML[i] + '\n' ;}
             }
             if(format=="CSV")
            {
               var result  = [];
               var dataset = [];
               var row     = "";

               for (const record of query.iterate())  { dataset.push(record); }

               for (var recNo=0 ; recNo < dataset.length ; recNo++ )
               {
                   row = "";
                   for (var field in dataset[recNo] ) { row=row + ";" + dataset[recNo][ field ]; }
                   result.push(row + + '\n' );
               }

              this.last_dbResult = result;

             }


          }
           catch(error) { result=false ; this.last_ErrMsg=error ; log('fetchQuery ERROR: ' + this.last_ErrMsg )}

      connection.close();

      return result;

} // fetchValue_from_Query()



module.exports.deviceState=( db , device , chanel )=>
{
  var JSONresult = {lastLogin:"", numLogins:0, numRecords:0, firstRecord:0 , lastRecord:0 , sumRecords:0};
  var objKeys;
  var key;
  var stmt;
  var execInfo;


       result        = true;
  this.last_ErrMsg   = "";
  this.last_dbResult = "";


  // numLogins
  try {
         var connection     = sqlite( db );
         log('connection.Properties : ' + JSON.stringify(connection));

         stmt           = connection.prepare( "select count(*) from login Where device=?" );
         execInfo       = stmt.get( [device] );

         log("numLogins :" + JSON.stringify(execInfo));

         if(!execInfo)  // leere Ergebnismenge
         {
           log('leere Ergebnismenge (null) ');
           JSONresult.numLogins = "-";
         }
         else
            {
              objKeys              = Object.keys(execInfo);
              key                  = objKeys[0];
              JSONresult.numLogins = execInfo[key];
            }
       }
       catch(error) { result=false ; this.last_ErrMsg=error ; log('deviceState ERROR: ' + this.last_ErrMsg )}


  //lastLogin
  try {
        stmt           = connection.prepare( "select max(dt) from login Where device=?" );
        execInfo       = stmt.get(  [device]  );

        log("lastLogin :" + JSON.stringify(execInfo));

        if(!execInfo)  // leere Ergebnismenge
        {
          log('leere Ergebnismenge (null) ');
          JSONresult.lastLogin = "-";
        }
        else
           {
             objKeys          = Object.keys(execInfo);
             key              = objKeys[0];
             JSONresult.lastLogin = execInfo[key];
           }
      }
      catch(error) { result=false ; this.last_ErrMsg=error ; log('deviceState ERROR: ' + this.last_ErrMsg )}

//numRecords
try {
  stmt           = connection.prepare( "select count(*) from rawValues where device = ? AND chanel=?"  );
  execInfo       = stmt.get([device , chanel]);

  log("numRecords :" + JSON.stringify(execInfo));

  if(!execInfo)  // leere Ergebnismenge
  {
    log('leere Ergebnismenge (null) ');
    JSONresult.numRecords = "-";
  }
  else
     {
       objKeys          = Object.keys(execInfo);
       key              = objKeys[0];
       JSONresult.numRecords = execInfo[key];
     }
}
catch(error) { result=false ; this.last_ErrMsg=error ; log('deviceState ERROR: ' + this.last_ErrMsg )}


//firstRecord
try {
  stmt           = connection.prepare( "select dt from rawValues where device = ? AND chanel=? order by dt LIMIT 1" );
  execInfo       = stmt.get( [device,chanel] );

  log("firstRecord :" + JSON.stringify(execInfo));

  if(!execInfo)  // leere Ergebnismenge
  {
    log('leere Ergebnismenge (null) ');
    JSONresult.firstRecord = "-";
  }
  else
     {
       objKeys            = Object.keys(execInfo);
       key                = objKeys[0];
       JSONresult.firstRecord = execInfo[key];
     }
}
catch(error) { result=false ; this.last_ErrMsg=error ; log('deviceState ERROR: ' + this.last_ErrMsg )}


//lastRecord
try {
  stmt           = connection.prepare( "select dt from rawValues where device=? AND chanel=? order by dt desc LIMIT 1" );
  execInfo       = stmt.get([device,chanel]);

  log("lastRecord :" + JSON.stringify(execInfo));

  if(!execInfo)  // leere Ergebnismenge
  {
    log('leere Ergebnismenge (null) ');
    JSONresult.lastRecord = "-";
  }
  else
     {
       objKeys               = Object.keys(execInfo);
       key                   = objKeys[0];
       JSONresult.lastRecord = execInfo[key];
     }
}
catch(error) { result=false ; this.last_ErrMsg=error ; log('deviceState ERROR: ' + this.last_ErrMsg )}



//sumRecords
try {
  stmt           = connection.prepare( "select sum(value) from rawValues where device=? AND chanel=? ");
  execInfo       = stmt.get([device,chanel]);

  log("sumRecords :" + JSON.stringify(execInfo));

  if(!execInfo)  // leere Ergebnismenge
  {
    log('leere Ergebnismenge (null) ');
    JSONresult.sumRecords = "-";
  }
  else
     {
       objKeys               = Object.keys(execInfo);
       key                   = objKeys[0];
       JSONresult.sumRecords = execInfo[key];
     }
}
catch(error) { result=false ; this.last_ErrMsg=error ; log('deviceState ERROR: ' + this.last_ErrMsg )}

    this.last_dbResult = JSON.stringify(JSONresult) ;

    return result;

}
