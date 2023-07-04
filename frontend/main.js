import * as globals         from "./tfWebApp/globals.js";
import * as utils           from "./tfWebApp/utils.js";
import    { Screen   }      from "./tfWebApp/tfObjects.js";
import    { tfWebApp }      from "./tfWebApp/tfWebApp.js";
import    { TFTreeView }    from "./tfWebApp/tftreeView.js";
import    { TDateTime }     from "./tfWebApp/utils.js";
import    { THTMLTable }    from "./tfWebApp/tfgrid.js";
import * as dialogs         from "./tfWebApp/tfDialogs.js";
import * as chartJS         from "./tfWebApp/chart.js";

const username            = "unknown";
const server              = "EMSSVRSERVICE02:4002";
const url_lsDevices       = "http://" +server+ "/lsDev";
const url_lsChanels       = "http://" +server+ "/lsChan/";
const url_loadRecords     = "http://" +server+ "/ls/";
const url_loadRecordsMonth= "http://" +server+ "/lsByMonth/";
const url_loadRecordsDay  = "http://" +server+ "/lsByDay/";
const url_State           = "http://" +server+ "/state/";


export function main(capt1,capt2)
{
  globals.setScreen( new Screen() );
  const webApp = new tfWebApp(capt1,capt2);
  globals.initWebApp( webApp );

  var mainSpace     = webApp.selectWorkSpace('main');

  var tixiCloud     = new TTixiCloud( mainSpace );
      tixiCloud.start();
}


export class TTixiCloud
{
 
  constructor( parent )
  {
    this.selectedDevice = '';
    this.selectedChanel = '';

    this.chart_Days     = null;
    this.chart_Month    = null;
    this.chart_Hours    = null;

    this.devicePanel    = dialogs.addPanel ( parent , '' , '21%' , '94%'  );
    this.deviceTree     = new TFTreeView   ( this.devicePanel , {width:'100%',height:'100%'} );

    var helpPanel       = dialogs.addPanel ( parent    , ''              , '77%' , '31%'  );
    this.infoPanel      = dialogs.addPanel ( helpPanel , 'cssWhitePanel' , '49.4%' , '97%'  );
    this.monthPanel     = dialogs.addPanel ( helpPanel , 'cssWhitePanel' , '49.4%' , '97%'  );
    
    helpPanel           = dialogs.addPanel ( parent    , ''              , '77%' , '31%'  );
    this.daysPanel      = dialogs.addPanel ( helpPanel , 'cssWhitePanel' , '49.4%' , '97%'  );
	this.hoursPanel     = dialogs.addPanel ( helpPanel , 'cssWhitePanel' , '49.4%' , '97%'  );
   
    helpPanel           = dialogs.addPanel ( parent    , ''              , '77%' , '31%'  );
   

  }

  start()
  {
  console.log('utils.httpRequest('+url_lsDevices+');'); 	  
  var request = utils.httpRequest(url_lsDevices);
  console.log('lsDevices()');
  if (request.indexOf('ERROR')==-1)
  {
    try { var devices = JSON.parse( utils.trimRequest ( request ) ); }
    catch(e) { console.log(e.toString); return -1 }
    
    for (var i = 0 ; i < devices.length ; i++ ) 
    { 
      console.log(devices[i].device);
      var n= this.deviceTree.addNode(devices[i].device , devices[i] );
          n.callBack_onClick = function(selectedNode)
                                                 {
                                                   var aDevice = selectedNode.content;
                                                   console.log("onTixiClick: " + selectedNode.caption);
                                                   this.selectedDevice = aDevice;
												   this.selectedChanel = '';
                                                   this.lsChanels( selectedNode , aDevice.device );  
                                                 }.bind(this);


    }
    this.deviceTree.buildNodeList()
  }
  else { console.warn( request) ; alert(request); } 

  
  }



  showState( aDevice  , aChanel )
  {
      console.log("function showDeviceState() ");
      console.log("ID_Device  : " + aDevice  );
 
      var url = url_State + aDevice+'/'+aChanel;
      console.log("url  : " + url  );
 
      var response =  utils.httpRequest( url );
      console.log("response : " + response  );
 
      if (response.indexOf('OK')>-1)
      {
         response = utils.trimRequest(response);
         var state = JSON.parse( response );
 
         var hlp   = [];  // *1 explizites TypeCasting von String -> Float/Int
		     hlp.push({"Anzahl Logins":utils.formatFloat(state.numLogins*1,0)} );
			 hlp.push({"letzter Login":utils.formatUXdateTime(state.lastLogin*1000)} );
             hlp.push({"Anzahl Messwerte":utils.formatFloat(state.numRecords*1,0)} );
             hlp.push({"erster Wert":utils.formatUXdateTime(state.firstRecord*1000)} );
             hlp.push({"letzter Wert":utils.formatUXdateTime(state.lastRecord*1000) });
             hlp.push({"Summe":utils.formatFloat(state.sumRecords*1) });
			 
			 console.log("help:" + JSON.stringify(hlp) );
            
             dialogs.valueList( this.infoPanel , '' , hlp );
      }
      else {console.warn( response) ; alert(response); return null }  
  }


  lsChanels( selectedNode , aDevice )   
  {  
      // falls kein Parent (selectedNode) übergeben wird, ist TREEView selber der parent.
      // sämtliche addNode() landen somit in der rootList....
      if(!selectedNode) selectedNode = this.deviceTree;
      var url = url_lsChanels + aDevice;
      console.log("URL     : " + url );
      var response = utils.httpRequest( url );

      if (response.indexOf('ERROR')==-1)
      {
        try { var chanels = JSON.parse( utils.trimRequest ( response ) ); }
        catch(e) { console.log(e.toString); return -1 }
        
        for (var i = 0 ; i < chanels.length ; i++ ) 
        { 
          var chan  =  chanels[i].chanel;
          var n     = selectedNode.addNode( chan , {dev:aDevice,chan:chan} ); 
              n.callBack_onClick = function(selectedNode)
              {
                 var aChan           = selectedNode.content;
                 this.selectedDevice = selectedNode.content.dev;
                 this.selectedChanel = selectedNode.content.chan;
                 console.log("onTixiClick: " + selectedNode.caption);
                 console.log("Device     : " + selectedNode.content.dev);
                 console.log("Chanel     : " + selectedNode.content.chan);
                 this.showBarChart_Month ( selectedNode.content.dev , selectedNode.content.chan );
             }.bind(this);
        }
        this.deviceTree.buildNodeList()
      }
      else { console.warn( response) ; alert(response); }
  }


  showBarChart_Month( aDevice , aChanel )
  {
    this.showState( aDevice , aChanel );
    
    var canvas   = dialogs.createCanvas( this.monthPanel , 'barChartMonth' );
	var url      = url_loadRecords+aDevice+"/"+aChanel+"/*/*/month/JSON";      // z.B.: http://emssvrservice02:4002/ls/DIEGOtest/IMP1_IMP1/*/*/month/JSON
    var response = utils.httpRequest(url);
 
       console.log("response      : " + response   );
 
       if (response.indexOf('ERROR')==-1)  // kein Error im response ...
       {
                var records = JSON.parse( utils.trimRequest ( response ) );
                var chartValues=[];
                for (var i=0 ; i<records.length ; i++ )
                {
                  var uxdt = new Date(records[i].year, records[i].month-1 , records[i].day);
                  chartValues.push( {X:utils.formatUXDateMonth(uxdt) , Y:records[i].value} );
                }
                //                                    ( aParent         , aChart           , chartType , caption             , jsonData    , onChartClick           ,  bindTo)       
                this.chart_Month = dialogs.createChart( this.monthPanel , this.chart_Month , 'bar'     , aDevice+"."+aChanel , chartValues , this.onChartMonthClick ,  this  );
       }
       else {console.warn( response) ; alert(response); return null }
  }


  onChartMonthClick( clickInfo )  // self => bindTo   /lsByMonth/:device/:chanel/:year/:month/:groupBy/:format'      
  {
      console.log('onChartMonthClick:' + clickInfo );

      var self          = clickInfo.bindTo;
      var monthYear     = clickInfo.selectedLabel.split("/");
      var month         = monthYear[0].trim();
      var year          = monthYear[1].trim();
               
      console.log( "Month : " + month );
      console.log( "Year  : " + year );
    
      var url     = url_loadRecordsMonth+self.selectedDevice+"/"+self.selectedChanel+"/"+year+"/"+month+"/day/JSON";
      console.log("URL          : " + url   );
      var response = utils.httpRequest(url);
      console.log("response      : " + response   );
      if (response.indexOf('ERROR')==-1)
      {
               var records = JSON.parse( utils.trimRequest ( response ) );
               var chartValues=[];
               for (var i=0 ; i<records.length ; i++ )
               {
                 var uxdt = new Date(records[i].year, records[i].month-1 , records[i].day);
                 chartValues.push( {X:utils.formatUXdate(uxdt) , Y:records[i].value} );
               }
               
               //                                  ( aParent        , aChart           , chartType , caption   , jsonData    , onChartClick           ,  bindTo)       
               self.chart_Day = dialogs.createChart( self.daysPanel , self.chart_Day   , 'bar'     , monthYear , chartValues , self.onChartDayClick   ,  self  );

      } else {console.warn( response) ; alert(response); return null }
   }



  onChartDayClick( clickInfo )
  {
      console.log('onChartDayClick => ' + clickInfo.selectedLabel );
      
      var self          = clickInfo.bindTo;
      var dayMonthYear  = clickInfo.selectedLabel.split(".");
      var day           = dayMonthYear[0].trim();
      var month         = dayMonthYear[1].trim();
      var year          = dayMonthYear[2].trim();

      var theDay        = new TDateTime(day+"."+month+"."+year);
      var theDayPlus1   = new TDateTime(day+"."+month+"."+year).incDays(1);
          
      console.log( "von : " + theDay.formatDate() );
      console.log( "bis : " + theDayPlus1.formatDate() );
    
      var url     = url_loadRecordsDay+self.selectedDevice+"/"+self.selectedChanel+"/"+year+"/"+month+"/"+day+"/*/JSON";
      console.log("URL          : " + url   );
      var response = utils.httpRequest(url);
      console.log("response      : " + response   );
      if (response.indexOf('ERROR')==-1)
      {
               var records = JSON.parse( utils.trimRequest ( response ) );
               var chartValues=[];
               for (var i=0 ; i<records.length ; i++ )
               {
                 var uxdt = new Date(records[i].year, records[i].month-1 , records[i].day ,  records[i].hour , records[i].minute );
                 chartValues.push( {X:utils.formatUXtime(uxdt) , Y:records[i].value} );
               }
               
               //                                    ( aParent         , aChart             , chartType  , caption             , jsonData    , onChartClick           ,  bindTo)       
               self.chart_Hours = dialogs.createChart( self.hoursPanel , self.chart_Hours   , 'line'     , theDay.formatDate() , chartValues , undefined              ,  self  );

      } else {console.warn( response) ; alert(response); return null }
    
   }


 
  

  
  



}

