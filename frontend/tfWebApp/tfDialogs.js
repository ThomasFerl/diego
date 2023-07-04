/*
Eingabefeld - Typen
===================

<input type="checkbox">
<input type="color">
<input type="date">
<input type="datetime-local">
<input type="email">
<input type="file">
<input type="month">
<input type="number">
<input type="password">
<input type="radio">
<input type="range">
<input type="search">
<input type="tel">
<input type="text">
<input type="time">
<input type="url">
<input type="week">
<meter>
<progress>
<select>
<textarea>

*/



import * as globals  from "./globals.js";
import * as utils    from "./utils.js";
import { TFWindow }  from "./tfwindows.js";

import { TFCheckBox, TFLabel     }   from "./tfObjects.js";
import { TFPanel     }   from "./tfObjects.js";
import { TFEdit      }   from "./tfObjects.js";
import { TFCombobox  }   from "./tfObjects.js";
import { TFButton    }   from "./tfObjects.js";


export function createWindow(aParent , aCaption , aWidth , aHeight )
{
   var wnd = new TFWindow( aParent , aCaption , aWidth , aHeight );
   return wnd;
} 
    
   
export function removeWindow( aWindow )
{
   var ndxOf = globals.webApp.windows.indexOf(aWindow);
   if(ndxOf>=0) globals.webApp.windows.splice(ndxOf,1);  
}
 

export function addLabel( aParent , className , text )
{
  var params = {};
  if (className) params.css = className;
  var lbl = new TFLabel( aParent , params );
  if(text) lbl.innerHTML = text;
  return lbl;
}


export function addPanel( aParent , className , width , height , dontRegister )
{
  var params = {};
  if (className)    params.css          = className;
  if (height)       params.height       = height;
  if (width)        params.width        = width;
  if (dontRegister) params.dontRegister = true;
   
  return new TFPanel( aParent , params );
}


export function addInput( aParent , TextLength  , labelText , appendix , preset ,dontRegister)
{
  var params = {};
  if (labelText)  params.labelText= labelText;
  if (TextLength) params.width    = TextLength+"em";
  if (appendix)   params.appendix = appendix;
  if (dontRegister) params.dontRegister = true;

  params.labelPosition           = "LEFT";

  var edit = new TFEdit( aParent , params );

  edit.text = preset;
  
  return edit;
}


export function addCombobox( aParent , TextLength  , labelText , appendix , preset , items , dontRegister )
{
  var params = {};
  if (labelText)  params.labelText= labelText;
  if (TextLength) params.width    = TextLength+"em";
  if (appendix)   params.appendix = appendix;
  if (items)      params.items    = items;
  if (dontRegister) params.dontRegister = true;

  params.labelPosition           = "LEFT";

  var cb = new TFCombobox( aParent , params );

  if(preset) cb.text = preset;
  
  return cb;
}


export function addButton( aParent , className , width , height , caption , dontRegister )
{
  var params = {};
  if (width)     params.width    = width+"em";
  if (height)    params.height   = height+"em";
  if (className) params.css      = className;
  if (caption)   params.caption  = caption;
  if (dontRegister) params.dontRegister = true;

  return new TFButton( aParent , params );
}


export function addCheckBox( aParent , className , caption , dontRegister )
{
  var params = {};
  if (className) params.css      = className;
  if (caption)   params.caption  = caption;
  if (dontRegister) params.dontRegister = true;

  return new TFCheckBox( aParent , params );
}
   


export function valueList( aParent , className , values )
{
  console.log('valueList() -> ' + JSON.stringify(values) );

  aParent.DOMelement.innerHTML = '';

  var css = className;
  if (!className) css='cssvalueListPanel';
  
  var i  = 0;
  var bg = aParent.backgroundColor;
  
  // ist Values ein Array von {field:value},{...}, ....
  if(values.length>1)
  {
    for (var j=0; j<values.length; j++ )
    for(var key in values[j]) 
    {
      i++;  
      var p = addPanel( aParent , css , '40%' , '1.4em' , true);
          p.DOMelement.innerHTML = '<b>'+key+'</b>';
          p.backgroundColor = (i % 2) != 0 ? "RGB(230,230,230)" : "RGB(230,230,230)"; 

          p = addPanel( aParent , css , '50%' , '1.4em' , true);
          p.DOMelement.innerHTML =  values[j][key];
          p.backgroundColor = (i % 2) != 0 ? "RGB(240,240,240)" : "RGB(240,240,240)"; 
    }
  }
  else 
      {
        for(var key in values) 
        {
          i++;
          var p = addPanel( aParent , css , '40%' , '2em' , true);
              p.DOMelement.innerHTML = '<b>'+key+'</b>';
              p.backgroundColor = (i % 2) != 0 ? "RGB(230,230,230)" : "RGB(230,230,230)"; 

              p = addPanel( aParent , css , '50%' , '2em' , true);
              p.DOMelement.innerHTML =  values[key];
              p.backgroundColor = (i % 2) != 0 ? "RGB(240,240,240)" : "RGB(240,240,240)"; 
        }
      }    
}



export function valueList_basedOn_HTTPRequest( aParent , className , url )
{
  var response = utils.httpRequest( url );
  if(response=="ERROR")
   {
      console.log('Fehler bei  utils.httpRequest( '+encodeURI(url)+' )');
      console.log(response);
      aParent.DOMelement.innerHTML = response;
   }
    else
         {
           var jsn =  JSON.parse( response );
           if (jsn.length>0) jsn = jsn[0];
           valueList( aParent , className , jsn );
         } 
}



export function playRemoteVideo( url )
{
  var w = createWindow( null , 'moviePlayer' , 1000 , 700 );
  
      w.hWnd.style.background = 'black';
      w.top                   = 10;
  
  var p = addPanel(w, 'cssPanel' , '100%'  , '7%' );
      p.DOMelement.style.background   = "RGB(70,70,70)";
      p.DOMelement.style.margin       = "0";
      p.DOMelement.style.padding      = "0";
  
      
  var b = addButton(p,"","200px","100px","++");
      b.callBack_onClick = function() 
                                    {
                                      var clip = document.getElementById("clipperVideo");  
                                          clip.playbackRate = clip.playbackRate+0.1;
                                   }

      b = addButton(p,"","200px","100px","--");
      b.callBack_onClick = function() 
                                    {
                                      var clip = document.getElementById("clipperVideo");  
                                      clip.playbackRate = clip.playbackRate-0.1;
                                    }

      b = addButton(p,"","200px","100px","+30sec");
      b.callBack_onClick = function() 
                                    {
                                     var clip = document.getElementById("clipperVideo");  
                                         clip.currentTime+=30;
                                    }                      

     b = addButton(p,"","200px","100px","-30sec");
     b.callBack_onClick = function() 
                                   {
                                    var clip = document.getElementById("clipperVideo");  
                                        clip.currentTime-=30;
                                   }                                                           

  p = addPanel(w, 'cssPanel' , '100%'  , '90%' );   
  p.DOMelement.innerHTML = '<video id="clipperVideo" autoplay controls style="width:100%;height:100%;"> <source src="'+encodeURI(url)+'"></video>';
  
  var clip = document.getElementById("clipperVideo");  
      clip.volume=0.07;
}


export function isRegisteredMovie(fileName)
{
  var response = utils.httpRequest( globals.URL_isRegistered+fileName );
  if(response=="ERROR")
   {
      console.log('Fehler bei  utils.httpRequest( '+url+' )');
      console.log(response);
      return false;
    }
  
    return  JSON.parse( response );
}



export function playRemoteVideo_basedOn_dB(fileName)
{  
  var vidInfo = isRegisteredMovie(fileName);
  if(!vidInfo) return false;

  if(!vidInfo.RESULT) return false;

var w = createWindow( null , 'moviePlayer' , 1800 , 1000 );
  
      w.hWnd.style.background = 'black';
      w.top                   = 10;
  
  var p = addPanel(w, 'cssPanel' , '100%'  , '7%' );
      p.DOMelement.style.background   = "RGB(70,70,70)";
      p.DOMelement.style.margin       = "0";
      p.DOMelement.style.padding      = "0";
  
  var b = addButton(p,"","200px","100px","--");
      b.callBack_onClick = function() 
                                    {
                                      console.log('--');
                                      var clip = document.getElementById("clipperVideo");  
                                      clip.playbackRate = clip.playbackRate-0.1;
                                    }
    
  var b = addButton(p,"","200px","100px","++");
      b.callBack_onClick = function() 
                                    {
                                      console.log('--');
                                      var clip = document.getElementById("clipperVideo");  
                                          clip.playbackRate = clip.playbackRate+0.1;
                                   }

  var b = addButton(p,"","200px","100px","-30sec");
      b.callBack_onClick = function() 
                          {
                            var clip = document.getElementById("clipperVideo");  
                                clip.currentTime-=30;
                          }     
                                                                
      
  var b = addButton(p,"","200px","100px","+30sec");
      b.callBack_onClick = function() 
                                    {
                                     var clip = document.getElementById("clipperVideo");  
                                         clip.currentTime+=30;
                                    }                      

  var panelCapture   = addPanel(w, 'cssWhitePanel' , '99%' , '50%' );
 
  var vidHTML         = '<video id="clipperVideo" controls poster="'+encodeURI(globals.URL_loadImg+vidInfo.clip.CAPTURE)+'"' +
                        'style="width:100%;height:100%;">  ' +
                        '<source src="'+encodeURI(globals.URL_loadMovie+vidInfo.clip.DIR+'/'+vidInfo.clip.FILENAME)+'"> ' +
                        '</video>';

  panelCapture.DOMelement.innerHTML  = vidHTML;
  
 for(var i=0 ; i<vidInfo.thumbs.length; i++ )
 {
  console.log(JSON.stringify(vidInfo.thumbs[i]));
  var p= addPanel(w, 'cssWhitePanel' , '300px'  , '200px' );
      p.DOMelement.innerHTML  = '<img src="'+encodeURI(globals.URL_loadImg+vidInfo.thumbs[i].thumbName)+'" style="max-width: 100%;max-height: 100%">';  
      p.callBack_onClick = function() 
      {
       var clip = document.getElementById("clipperVideo");  
           clip.currentTime=this.position;
      }.bind(vidInfo.thumbs[i]);                      
 }

 return true;

}


export function createCanvas( aParent , ID )
{
  var parent = document.body;

  if (aParent) parent = aParent; 
  else
        {
          if(globals.webApp) 
          {
            if(globals.webApp.activeWorkspace) parent = globals.webApp.activeWorkspace.DOMelement; 
            utils.log("TFObject.constructor() ... parent ermittelt aus Workspace:"+this.parent);
          }
          else
          { 
            parent = globals.Screen.DOMelement;
            utils.log("TFObject.constructor() ... parent ermittelt aus screen:"+this.parent);
          }  
    } 
    
    var c = document.createElement("Canvas");
        if(ID) c.setAttribute('ID' , ID ); 
        parent.appendChild( c );
    return c;    
}




export function createChart( aParent , aChart , chartType , caption , jsonData , onChartClick , bindTo)
{
  if( aChart != null ) aChart.destroy();
  if( !bindTo ) bindTo = this;
  
  aParent.DOMelement.innerHTML = '';

  var aChart       = {};
  var canvas       = createCanvas( aParent ); 
  var chartOptions = {showLines: true,
                      events   : ['click'], 
                      onClick  : function(e) 
                                 {   
                                  console.log('onClick:' + this.chart.constructor.name );
                                  var clickedPoints = aChart.getElementsAtEventForMode(e, 'nearest', {intersect:true}, false);
                                  if(clickedPoints.length>0)
                                  {
                                    var clickedPoint = clickedPoints[0];
                                    console.log('clickedPoint:' + clickedPoint.index );
                                    
                                    var    st = aChart.data.labels[clickedPoint.index];
                                    var label = aChart.data.labels[clickedPoint.index];
                                    var value = aChart.data.datasets[clickedPoint.datasetIndex].data[clickedPoint.index];
                                    
                                    onChartClick( {bindTo:this.self , chart:this.chart , itemIndex:clickedPoint.index, selectedLabel:label, delectedValue:value} );

                                  }  
                                 }.bind({self:bindTo, chart:aChart})  
                    }; // chartOptions 
    
  const chartParams = { type    : chartType,
                        options : chartOptions, 
                        data    : { labels  : [],
                                    datasets: [ {
                                               label          : caption,
                                               backgroundColor: 'rgb(77, 77, 77)',
                                               borderColor    : 'rgb(0 , 0 ,  0)',
                                               data           : [],
                                                } ]
                                  }
                      };

   for(var i=0 ; i<jsonData.length ; i++)
   {
      chartParams.data.labels.push(jsonData[i].X) ;
      chartParams.data.datasets[0].data.push(jsonData[i].Y);
   }

   aChart = new Chart( canvas , chartParams );
   
   return aChart; 
}






 
 /*
 ehemals addButton()
 var parent = aParent;
 if (!parent) parent = this.body;

 consoleLog("aParent:" + parent);
 consoleLog("onClickCallback:" + onClickCallback);
 
  var btn = document.createElement("BUTTON");
  btn.className   = className ;  
  btn.innerHTML   = text;
  btn.onclick     = function()
                              {
                               consoleLog('Cklick'); 
                               var callBack = new Function(onClickCallback);
                               callBack();
                             }
  parent.appendChild( btn ); 
  return btn;
}
 */ 





