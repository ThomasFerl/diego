
import * as globals  from "./globals.js";
import * as utils    from "./utils.js";
import * as symbols  from "./symbols.js";
import * as dialogs  from "./tfDialogs.js";



export class TFWindow
{ 
  self     = {};
  
  constructor ( aParent , aCaption , aWidth , aHeight )
  {
    // falls kein Parent übergeben wurde, dann ist das Application.mainWindow das Parent-Fenster 
    if (!globals.Screen) globals.setScreen( new Screen() );
    
    if (aParent) this.parent = aParent; 
    else
        {
          if(globals.webApp) 
          {
            if(globals.webApp.activeWorkspace) this.parent = globals.webApp.activeWorkspace; 
            utils.log("TFObject.constructor() ... parent ermittelt aus Workspace:"+this.parent);
          }
          else
          { 
            this.parent = globals.Screen;
            utils.log("TFObject.constructor() ... parent ermittelt aus screen:"+this.parent);
          }  
    } 
    
    self          = this; 
    this.what     = 'floating window';
    this.handle   = -1;
    this.widthPx  = aWidth;
    this.heightPx = aHeight;
    this.leftPx   = Math.round((globals.Screen.width  - this.width  ) / 2 );
    this.topPx    = Math.round((globals.Screen.height - this.height ) / 2 );

    if(this.leftPx<0) this.leftPx=0;
    if(this.topPx <0) this.topPx =0;

    this.callBack_onTitleClick = undefined;
    this.callBack_onClick      = undefined;
    this.callBack_onMouseMove  = undefined;
    

    this.container                = document.createElement("DIV");
    this.container.className      = "cssWindowContainer";
    this.container.style.height   = this.heightPx + 'px';
    this.container.style.width    = this.widthPx + 'px';
    this.container.style.left     = this.leftPx + 'px';
    this.container.style.top      = this.topPx  + 'px';
    this.container.style.zIndex   = globals.webApp.windows.length ? globals.webApp.windows.length+10 : 10;
    
    this.parent.DOMelement.appendChild( this.container );
    globals.webApp.windows.push( this );
    this.handle = globals.webApp.windows.length - 1;
    console.log('CAPTION------');
    this.caption             = document.createElement("DIV"); 
    this.caption.className   = "cssWindowCaption";

    //interne Drag&Drop Steuerung ....
    this.caption.addEventListener('mousemove', ( e )=>{e.stopPropagation(); self.onTitleMouseMove(e); return true} );

    this.container.appendChild( this.caption );

    var table                =  document.createElement( "table" );
        table.style.width    = "100%";
        table.style.height   = "1.5em";
        table.style.margin   = "-1px";
        table.style.padding  = "-1px";

    this.caption.appendChild( table );

    var tr      =  table.insertRow( 0 );

    var td_left =  document.createElement("td");
        td_left.style.width  = (this.widthPx-30) + 'px';
        td_left.style.border = "0";
        td_left.style.borderSpacing = "0px";
        td_left.innerHTML = aCaption;
        tr.appendChild( td_left );

    var td_right =  document.createElement("td");
        td_right.style.width  = "30px";
        td_right.style.border = "1px solid black";
        td_right.style.background = "RGB(220,220,220)";
        td_right.style.paddingTop = "3px";
        td_right.data = this;

        td_right.onclick  = function( ev )
                            {
                              var dom = ev.target; 
                              var wnd = dom.data;
                              while(!wnd) 
                              {
                                dom = dom.parentElement
                                wnd = dom.data;
                              } 
                              wnd.closeWindow();
                            }         

        td_right.style.borderSpacing = "0px";
        td_right.innerHTML    = '<center><img src="'+symbols.asBase64('close')+'" style="height:20px; width:20px;margin:-2px" ></center>';
        tr.appendChild( td_right );
        
    this.hWnd                = document.createElement("DIV");
    this.hWnd.className      = "cssWindow";
    this.container.appendChild( this.hWnd );

    
  }

  set width( value )
  {
    if(value>10) if(this.container) { this.container.style.width = value+'px'; this.widthPx=value;}
  } 

  get width()
  {
    return this.widthPx;
  } 


  set height( value )
  {
    if(value>10) if(this.container) {this.container.style.height = value+'px';  this.heightPx=value;}
  } 

  get height()
  {
    return this.heightPx;
  } 
  
  set left( value )
  { 
    var v=value; 
    if(v<0) v=0;
       if(this.container) { this.container.style.left = v+'px'; this.leftPx = v; }
  } 

  get left()
  {
    return this.leftPx;
  } 


  set top( value )
  {
    var v=value; 
    if(v<0) v=0;  
    if(this.container) { this.container.style.top = v+'px'; this.topPx = v; }
   
  } 

  get top()
  {
    return this.topPx;
  } 


    closeWindow()
    {
       var ndx = globals.webApp.windows.indexOf( this  );
       utils.log('ndx:' + ndx);
       if(ndx>-1)   globals.webApp.windows.slice( ndx , 1 );
       utils.log( "close Window : this: " + this + "  parent" + this.parent + "   container: " + this.container );
       this.parent.DOMelement.removeChild( this.container ); 
    }

    onTitleClick()
    {
      if (this.callBack_onTitleClick) this.callBack_onTitleClick();
    }

    onClick()
    {
      if (this.callBack_onClick) this.callBack_onClick();
    }
    
    onMouseMove()
    {
      if (this.callBack_onMouseMove) this.callBack_onMouseMove(); 
    }
        
     appendChild(aDOMelement)
     {
      this.hWnd.appendChild(aDOMelement);
     }
   

    HTML( aContent )
    {
      this.hWnd.innerHTML = aContent;      
    }

    DOMelement()
    {
      return this.hWnd;
    }
    
    
    getCanvas( aID , aLeft , aTop , aWidth , aHeight )
    {
      var canvasID, left, top , width , height ;
      if (aID)      canvasID=aID    ; else cannvasID="wnd" + this.handle;
      if (aLeft)    left    =aLeft  ; else left =1;
      if (aTop)     top     =aTop   ; else top  =1;
      if (aWidth)   width   =aWidth ; else width=this.width-2;
      if (aHeight)  height  =aHeight; else height=this.height-2;

      var newCanvas                = document.createElement('canvas');
          newCanvas.width          = width;
          newCanvas.height         = height;
          newCanvas.left           = left;
          newCanvas.top            = top;
          newCanvas.style.position = "absolute";

          this.hWnd.appendChild(newCanvas);

          return newCanvas;
    } 

   
 showModal( wnd , fieldDef , fieldData )
 {
    var formData = []; 
    // Default Defenition der Felder erzeugen. Kann nach Init und vor build angerpasst werden !
    for(var key in fieldData ) formData.push( new {fieldName:key , fieldType:fieldDef[key]} );

    alert(formData);
  
  
  //d3.select(wnd).selectAll('text').data()
 
   
 }

 
 // ---------Steuerung der Fenster-Bewegung durch das Klicken mit der Maus in den Titel ----------------
 
 onTitleMouseMove(event)
{
  if(event.buttons > 0)  // wird die Maustaste gedrückt ?
  {
   this.left = this.left + event.movementX;
   this.top  = this.top  + event.movementY;
  } 
}



/*
        cpt.addEventListener('mousedown', onMouseDown , false);
        cpt.addEventListener('mouseup'  , onMouseUp   , false);
        cpt.addEventListener('mousemove', onMouseMove , false);

    var theCaption                = document.createElement("P");
        theCaption.className      = "caption";
        theCaption.style.position = "absolute";
        theCaption.style.left     = "10px";
        theCaption.style.top      = "-4px";
        theCaption.innerHTML      = "<B><I>" + caption + "</I></B>";
        wnd.appendChild( theCaption );


    var dlg                = document.createElement("IFRAME");
        wnd.appendChild(dlg);

        dlg.setAttribute("src", url );

        dlg.style.width    =  "100%";
        dlg.style.height   =  (h-captionSize) + 'px';
        dlg.style.border   = "none";
        dlg.style.position = "absolute";
        dlg.style.left     = "0px";
        dlg.style.top      = captionSize + 'px';

        window.onmessage = function(event)
        {
            if (event.data == 'onBtnOk')
            {
                document.getElementById('htmlBody').className = "";
                wnd.remove();
                wnd = null;
                return true;
            }

            if (event.data == 'onBtnAbort')
            {
               document.getElementById('htmlBody').className = "";
               wnd.remove();
               wnd = null;
               return false;
            }
      };

  }

  } 

*/

}
