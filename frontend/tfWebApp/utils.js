import * as globals      from "./globals.js";

const debug          = false;
const msPerDay       = 24*60*60*1000;
const beginUnixTime  = 25569;             // 01.01.1970

function mod(a,b) { if(b!=0) return Math.floor(a/b); else return NaN;}

export class TDateTime
{
    
  constructor( param )
  {
      if(!param) this.uxDateTime = new Date();
      else {
            var kind = param.constructor.name.toUpperCase();
            console.log('TDateTime.constructor("'+param+'")  --typ--> '+kind);

            if (kind =='STRING'   ) { this.uxDateTime =  strToUxDate(param) ; console.log('strToUxDate("'+param+'")  ---> '+this.formatDateTime()) }
            if (kind =='DATE'     )   this.uxDateTime = new Date(param.valueOf()); 
            if (kind =='TDATETIME')   this.uxDateTime = new Date(param.uxDateTime.valueOf()); 
            if (kind =='NUMBER'   )
            {
              if (Math.log10(param)>7) this.uxDateTime = new Date(param); 
              else                     this.uxDateTime = new Date(param*msPerDay+beginUnixTime); 
            }  
           
          } 
          
      if(!this.uxDateTime) alert('TDateTime() wrong param !  ('+param+')');   
         
  }
    valueOf() { return (this.uxDateTime.valueOf()/msPerDay)+beginUnixTime; }

    valueOf_uxDateTime() { return this.uxDateTime.valueOf(); }

    now(){ var d = new Date() ; return (d.valueOf()/msPerDay)+beginUnixTime; }

    incDays(d)
    {
      this.uxDateTime = new Date(this.uxDateTime.valueOf()+(d*msPerDay));
      return this;
    }
    
    get tt() {return this.uxDateTime.getDay()}
    get dd() {return this.uxDateTime.getDate()}
    get mm() {return this.uxDateTime.getMonth()+1}
    get yy() {return this.uxDateTime.getFullYear()}
    get hh() {return this.uxDateTime.getHours()}
    get mn() {return this.uxDateTime.getMinutes()}
    get ss() {return this.uxDateTime.getSeconds()}

    
    set dd( value ) {  this.uxDateTime = new Date(this.yy, this.mm-1, value , this.hh, this.mn, this.ss);}
    set mm( value ) {  this.uxDateTime = new Date(this.yy, value-1, this.tt , this.hh, this.mn, this.ss);}
    set yy( value ) {  this.uxDateTime = new Date(value , this.mm-1, value , this.hh, this.mn, this.ss);}
    set hh( value ) {  this.uxDateTime = new Date(this.yy, this.mm-1, value , value , this.mn, this.ss); }
    set mn( value ) {  this.uxDateTime = new Date(this.yy, this.mm-1, value , this.hh, value , this.ss);}
    set ss( value ) {  this.uxDateTime = new Date(this.yy, this.mm-1, value , this.hh, this.mn, value);}


    incMonth(m)
    {
      var dy  =m % 12;
      var dm  =m-(dy*12);
      this.mm = this.mm + dm;
      this.yy = this.yy + dy;
      this.uxDateTime = new Date(this.yy, this.mm-1, this.dd, this.hh, this.mn, this.ss);
      return this;
    }

    monthBetween(dateTo)
    { 
      if (dateTo.constructor.name.toUpperCase()=='TDATETIME') var to=dateTo.uxDateTime;
      else                                                    var to=new TDateTime(dateTo).uxDateTime;
      return to.getMonth() - this.uxDateTime.getMonth() + (12 * (to.getFullYear() - this.uxDateTime.getFullYear())) 
    }

    yearsBetween(dateTo) {return mod(this.monthBetween(dateTo) , 12 );}

    formatDate(){return (this.dd<10?'0'+this.dd:this.dd)+'.'+(this.mm<10?'0'+this.mm:this.mm)+'.'+this.yy; }
  
    formatTime(withSeconds){return (this.hh<10?'0'+this.hh:this.hh)+':'+(this.mn<10?'0'+this.mn:this.mn)+(withSeconds?(this.ss<10?':0'+this.ss:':'+this.ss):''); }
    
    formatDateTime(){return this.formatDate() + ' ' + this.formatTime() }

    lastDayOfMonth()
    {
      var thisDay  = new Date( this.uxDateTime.valueOf() );
      var help     = new Date(thisDay.getFullYear(), thisDay.getMonth()+1, 0);
      return new TDateTime( help );
    }

} 




export function strToUxDate(str)
{
  console.log('strToUxDate('+str+')');

    // Standrd-ISO kann JS Date() selber parsen...
    if(str.split('-').length>1) 
    {
      console.log('DATE ist ISO conform: '); 
      var dt = new Date(str);
      console.log('parsed timestamp: ' + dt);
      return dt;
    }
    else {
           var dd,mm,yy,hh,mn,ss ;

            // Uhrzeit vom datum trennen
            var h = str.split(' ');
            var dStr = h[0];
            var tStr = '';
            if (h.length > 1) tStr=h[1];

            // Datumsbestandteile trennen
            var prts = dStr.split('.');

           if(!isNaN(prts[0])) dd = prts[0]*1;
           if(!isNaN(prts[1])) mm = prts[1]*1;
           if(!isNaN(prts[2])) yy = prts[2]*1;

          hh=0;
          mn=0;
          ss=0;

          if(tStr)
          {
            // Falls eine Uhrzeit vorhanden, diese in Bestandteile zerlegen  
            prts = tStr.split(':');
           
            if(!isNaN(prts[0])) hh = prts[0]*1;
            if(!isNaN(prts[1])) mn = prts[1]*1;
            if(!isNaN(prts[2])) ss = prts[2]*1;
         }
       
         return new Date( yy, mm-1, dd, hh, mn, ss );
    }   
    
}

export function tab(len)
{
 var s="";
 for(var i=0 ; i<len; i++) s=s+" ";
 return s;
}

export function fill(len)
{
 return tab(len);
}

export function prefix0( value )
{
  if(value<10) return '0' + value;
  else         return ''  + value;
}


export function randomColor() {return "#" +  Math.floor(Math.random()*16777215).toString(16);};


export function log(s)
{
   if(debug) console.log(s);  
}

export function rndColor() {return randomColor();};


export function formatFloat( floatValue , nachkomma )
{   
  var vk = "";  var nk = "";  var r  = "";  var j  = 0 ;
  var st = "" + floatValue.toFixed(nachkomma);
      st = st.replace('.',',');
      if(st.indexOf(",")>=0) { vk=st.split(',')[0] ; nk=',' + st.split(',')[1]; }
      else                   { vk=st ; nk='' };

      for (var i=vk.length-1; i>=0 ; i--)
      {
       r=vk[i]+r;
       j++;
       if (((j%3)==0)&&(i>0)) r="."+r;
      }
      return r+nk;
 }

  export function formatInteger( intValue )
{
  var r  = "";  var j = 0 ;
  var st = "" + intValue;
      for (var i=st.length-1; i>=0 ; i--)
      {
       r=st[i]+r;
       j++;
       if(((j%3)==0)&&(i>0)) r="."+r;
      }
      return r;
}

export function formatBoolean( boolValue)
{
  var r = "Nein"; 
  if( (boolValue==1)||(boolValue=="1")||(boolValue.toUpperCase()=="TRUE")||(boolValue.toUpperCase()=="ON") ) r = "Ja";
  return r;
}


export function formatUXdateTime( uxdt )
{
   var dt = new TDateTime(uxdt);
   return dt.formatDateTime();
}

export function formatUXDateMonth( uxdt , withMonthName )
{
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year   = uxdt.getFullYear();

  if(withMonthName) var result  = months[uxdt.getMonth()] + ' ' + year;
  else              var result  = prefix0(uxdt.getMonth()+1) + ' / ' + year;

  return result;
}



export function formatUXdate( uxdt )
{
   var dt = new TDateTime(uxdt);
   return dt.formatDate();
}


export function formatUXtime( uxdt )
{
   var dt = new TDateTime(uxdt);
   return dt.formatTime();
}

export function pathJoin(pathArr)
{
  var result = pathArr.map(function(path){
      if(path[0] === "/"){
          path = path.slice(1);        
      }
      if(path[path.length - 1] === "/"){
          path = path.slice(0, path.length - 1);   
      }
      return path;     
  }).join("/");

  if (result[0]!='/') result = '/' + result;
 
  return result;

}


//----------------------------------------------------------------
//------------------------------------------------------------------

// Hilfsfunktion für nodeJS-Antworten früherer Versionen .....
export function trimRequest( str )
{
  if (str.indexOf('[')>-1)
  {
    var p1  = str.indexOf('[');
    var p2  = str.lastIndexOf(']');
  }
  else
  {
    var p1  = str.indexOf('{');
    var p2  = str.lastIndexOf('}');
  }
  return str.substring(p1, p2+1);
}




export function httpRequest( url , header )
{
  const request = new XMLHttpRequest();
  request.open('GET', encodeURI(url) , false );  // `false` makes the request synchronous
  if(header) request.setRequestHeader( header.keyWord , header.argument );
  try {request.send(null);} catch {}
  if (request.readyState == 4 && request.status == 200) { return request.responseText }
  else                                                    return JSON.stringify( {ERROR:true, STATE:request.status} );
}


export function webApiRequest( cmd , param )
{
  var url =  globals.URL_webAppRequest+btoa(JSON.stringify( {cmd:cmd , param:param } )); 

  const request = new XMLHttpRequest();
  
  request.open('GET', url , false );  // `false` makes the request synchronous
  
  try {request.send(null);} catch(err) {return { ERROR:true, STATE:err.toString() };}
  
  if (request.readyState == 4 && request.status == 200) 
  { 
    var responseStr = request.responseText;
    console.log('response:' + responseStr );

    try        { var response = JSON.parse(responseStr); }
    catch(err) {return { ERROR:true, STATE:err.toString() };}

    if(response.Err) return {ERROR:true, STATE:response.ErrMsg};
    else             return response.result;
  }
   else return {ERROR:true, STATE:request.status};
}


export function loadContent( url ) 
{
  var result         = {ERROR:false, state:"" , script:"", body:"" , doc:""};

  var script         = ''; 
  var body           = ''; 
  var responseText   = httpRequest(encodeURI(url));

  if(responseText.indexOf('{ERROR')==0)
  {
    var responseJSON   = JSON.parse(responseText);
    log('Error on httpRequest('+url+')  State:'+responseJSON.STATE );
    result.ERROR = true;
    result.state = responseJSON.STATE;
 }
  else
      {
        result.doc = responseText; 
        // zuerst alle Script-tags finden und bündeln ... sofern vorhanden ...
         var scriptTags = responseText.split('<script>');
         if(scriptTags.length>1)
         for(var i=0; i<scriptTags.length; i++) script = script + scriptTags[i].replace('</script>','');
     
        // body-tag finden und isolieren...
        var scriptBody = responseText.split('<body>');
        if(scriptBody.lengt>1) body = scriptBody[0].replace('</body>','');

        if(body=='') body = responseText; 

        result.state='OK (scriptTags:'+scriptTags.length+' , bodyTag:'+scriptBody.lengt;
        result.script =script;
        result.body   =body;
      }
 
  return result; 
}

export function _copyStringToClipboard (str) 
{
  console.log( 'utils.copyStringToClipboard('+str+')' );
  
  navigator.clipboard
    .writeText(str)
    .then(() => {
      alert("Inhalt in Zwischenablage kopiert");
    })
    .catch(() => {
      alert("Inhalt konnte nicht in die Zwischenablage kopiert werden !");
    });
}


export function copyStringToClipboard (str) 
{
  let text = str;
 
  if (window.clipboardData && window.clipboardData.setData) {
    // IE: prevent textarea being shown while dialog is visible
    return window.clipboardData.setData("Text", text);

  } else if (document.queryCommandSupported && 
             document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    // Prevent scrolling to bottom of page in MS Edge
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      // Security exception may be thrown by some browsers
      return document.execCommand("copy");
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}







