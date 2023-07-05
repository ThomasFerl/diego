
const mssql = require('mssql');

 async function runQuery(query) 
 {

    const config = {
        user    : "import",
        password: "daten",
        database: "DIEGO_Values",
        server  : "EMSSVRSQL01",
        options : {
                    encrypt               : true, // for azure
                    trustedConnection     : true ,
                    trustServerCertificate: true // change to true for local dev / self-signed certs
                  }
        }

    console.log("runQuery");
    try {
      await mssql.connect(config);
      var request = new mssql.Request();
      console.log('var result = await request.query('+query+');');
      var result = await request.query(query);
      console.log('return from query...');
      console.dir(result);
      return result.recordset;

    } catch (err) {
      console.error('Fehler bei der MSSQL-Abfrage:', err);
      return {error:true,errMsg:err}
     }
  }

  
  runQuery('SELECT * FROM rawValues');
  