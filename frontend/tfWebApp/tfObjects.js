import * as globals  from "./globals.js";
import * as utils    from "./utils.js";
import * as dialogs  from "./tfDialogs.js";



//--------------------------------------------Events-------------------------------------------

function _internHandle_updateScreenSize(e)
{
   Screen.clientWidth  = window.innerWidth;
   Screen.clientHeight = window.innerHeight;
   console.log("updateScreenSize: Height=" + Screen.clientHeight + " / Width="+Screen.clientHeight);
}
function _internHandle_onmousemove(e)
{
    var o=this.data;
    //if(o) utils.log("onMouseMove -> X:"+e.offsetX+"  Y:"+e.offsetY+"  in DOMelement:"+this.tagName+" gebunden an Object:"+o.objName);

    if (o.callBack_onMouseMove)
    {
      o.callBack_onMouseMove(e);
      e.stopPropagation();
    }     
}
function _internHandle_onmouseout(e)
{
  var o=this.data;
  if(o) utils.log("onMouseMove -> X:"+e.offsetX+"  Y:"+e.offsetY+"  in DOMelement:"+this.tagName+" gebunden an Object:"+o.objName);

    if (o.callBack_onMouseOut)
    {
      o.callBack_onMouseOut(e);
      e.stopPropagation();
    }     
}
function _internHandle_onClick(e)
{
  var o=this.data;
  if(o) utils.log("onMouseMove -> X:"+e.offsetX+"  Y:"+e.offsetY+"  in DOMelement:"+this.tagName+" gebunden an Object:"+o.objName);

  if (o.callBack_onClick)
      {
        o.callBack_onClick(e);
        e.stopPropagation();
      }     
}
function _internHandle_onmousedown(e)
{
  var o=this.data;
  if(o) utils.log("onMouseMove -> X:"+e.offsetX+"  Y:"+e.offsetY+"  in DOMelement:"+this.tagName+" gebunden an Object:"+o.objName);

  if (o.callBack_onMouseDown)
    {
      o.callBack_onMouseDown(e);
      e.stopPropagation();
    }     
}
function _internHandle_onmouseup(e)
{
  var o=this.data;
  if(o) utils.log("onMouseMove -> X:"+e.offsetX+"  Y:"+e.offsetY+"  in DOMelement:"+this.tagName+" gebunden an Object:"+o.objName);

  if (o.callBack_onMouseUp)
    {
      o.callBack_onMouseUp(e);
      e.stopPropagation();
    }     
}
function _internHandle_onDblclick(e)
{
  var o=this.data;
  if(o) utils.log("onMouseMove -> X:"+e.offsetX+"  Y:"+e.offsetY+"  in DOMelement:"+this.tagName+" gebunden an Object:"+o.objName);

  if (o.callBack_onDblClick)
    {
      o.callBack_onDblClick(e);
      e.stopPropagation();
    }     
}
function _internHandle_onWheel(e)
{
  var o=this.data;
  if(o) utils.log("onMouseMove -> X:"+e.offsetX+"  Y:"+e.offsetY+"  in DOMelement:"+this.tagName+" gebunden an Object:"+o.objName);

  if (o.callBack_onWheel)
    {
      o.callBack_onWheel(e);
      e.stopPropagation();
    }     
}
function _internHandle_onKeypress(e)
{
  var o=this.data;
  if(o) utils.log("onMouseMove -> X:"+e.offsetX+"  Y:"+e.offsetY+"  in DOMelement:"+this.tagName+" gebunden an Object:"+o.objName);

  if (o.callBack_onKeypress)
    {
      o.callBack_onKeypress(e);
      e.stopPropagation();
    }     
}
function _internHandle_onKeyDown(e)
{
  var o=this.data;
  if(o) utils.log("onMouseMove -> X:"+e.offsetX+"  Y:"+e.offsetY+"  in DOMelement:"+this.tagName+" gebunden an Object:"+o.objName);

  if (o.callBack_onKeyDown)
        {
          o.callBack_onKeyDown(e);
          e.stopPropagation();
        }     
}
function _internHandle_onKeyUp(e)
{
  var o=this.data;
  if(o) utils.log("onMouseMove -> X:"+e.offsetX+"  Y:"+e.offsetY+"  in DOMelement:"+this.tagName+" gebunden an Object:"+o.objName);

  if (o.callBack_onKeyUp)
    {
      o.callBack_onKeyUp(e);
      e.stopPropagation();
    }     
}

//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

export class Screen
{
  constructor()
  {
    this.className               = this.constructor.name;  
    this.isTFObject              = true;
    this.objName                 = "Screen";
    this.width                   = window.innerWidth;
    this.height                  = window.innerHeight;
    this.DOMelement              = window.document.body;
    this.DOMelement.data         = this;
    
    this.DOMelement.onclick      = _internHandle_onClick;
    this.DOMelement.ondblclick   = _internHandle_onDblclick;
    this.DOMelement.onkeypress   = _internHandle_onKeypress;
    this.DOMelement.onkeydown    = _internHandle_onKeyDown;
    this.DOMelement.onkeyup      = _internHandle_onKeyUp;
    this.DOMelement.onwheel      = _internHandle_onWheel;
    this.DOMelement.onmousemove  = _internHandle_onmousemove;
    this.DOMelement.onmouseout   = _internHandle_onmouseout;
    this.DOMelement.onmousedown  = _internHandle_onmousedown;
    this.DOMelement.onmouseup    = _internHandle_onmouseup;
   
    this.childList               = [];
    
    this.callBack_onKeypress     = undefined;
    this.callBack_onKeyDown      = undefined;
    this.callBack_onKeyUp        = undefined;
    this.callBack_onClick        = undefined;
    this.callBack_onDblClick     = undefined;
    this.callBack_onMouseDown    = undefined;
    this.callBack_onMouseUp      = undefined;
    this.callBack_onWheel        = undefined;
    this.callBack_onMouseMove    = undefined;
    this.callBack_onMouseOut     = undefined;
 
    window.addEventListener('resize',  function() 
                                       {  
                                         this.width  = window.innerWidth;
                                         this.height = window.innerHeight;
                                         utils.log("update ScreenSize: Height=" + this.height + " / Width="+this.width);
                                       } ); 
         
  } 
  
  appendChild(aDOMelement) {this.DOMelement.appendChild(aDOMelement); }


  set HTML( st ) {this.DOMelement.innerHTML = st;}
}


export class TFObject
{
  constructor (aParent , aParams ) // aParent ist entweder ein TFObject oder ein DOMelement // aParams : JSONStruct
  {
    this.isTFObject  = true;
    this.objName     = "TFObject";
    this.className   = this.constructor.name;  
    this._orientation= "LEFT";

    if (aParams) this.params = aParams; 
    else         this.params = {};

    utils.log(" TFObject.constructor() aPparent:"+aParent+"  ,  aParams:"+JSON.stringify(this.params));

    if (!globals.Screen) globals.setScreen(new Screen() );
    
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
    
    if(!this.params.dontRegister)
    { 
      // nur wenn das Parent ein TFObj. ist wird das akt. Obj. in die Childlist des Parents eingefügt
      if(this.parent.isTFObject) 
      {
        utils.log("TFObject.constructor() ... parent ist ein tfObject -> this in parent.childList pushen");
        this.parent.childList.push(this);
      }
      else utils.log("TFObject.constructor() ... parent ist KEIN tfObject -> keine Registrierung innerhalb der tfObjekt-Hirachie ");
    }  
    else utils.log("TFObject.constructor() ... dotRegister=true -> keine Registrierung innerhalb der tfObjekt-Hirachie ");

    this.childList             = [];
    this.callBack_onKeypress   = undefined;
    this.callBack_onKeyDown    = undefined;
    this.callBack_onKeyUp      = undefined;
    this.callBack_onClick      = undefined;
    this.callBack_onDblClick   = undefined;
    this.callBack_onMouseDown  = undefined;
    this.callBack_onMouseUp    = undefined;
    this.callBack_onWheel      = undefined;
    this.callBack_onMouseMove  = undefined;
    this.callBack_onMouseOut   = undefined;

    if(this.params.object) 
    {
        utils.log("TFObject.constructor() ..."+this.params.object+" mit className: "+this.params.css+" wird als DOMelement erzeugt");
        
        if(this.params.object.toUpperCase()=='TFCHECKBOX')
        {
          var hID = 'CB_'+Math.random()*1000000;
          this.DOMelement = document.createElement('Input'); 
          this.DOMelement.setAttribute('ID'   ,  hID);
          this.DOMelement.setAttribute('type' , 'checkbox');
          this.DOMelement.className = 'cssCheckBox';
          var l           = document.createElement('Label'); 
              l.htmlFor   = hID;
              l.className = 'cssLabel';
              l.setAttribute('display' , 'block');
              if(this.params.caption) l.innerHTML = this.params.caption;
              this.DOMelement.appendChild( l );
         } 
        else
        {   this.DOMelement = document.createElement(this.params.object); 
            if(this.params.css) this.DOMelement.className =  this.params.css;
            else                this.DOMelement.className = "cssObject";
        }    
    
        if(this.params.position)        this.DOMelement.style.position        = this.params.position;
        if(this.params.left)            this.DOMelement.style.left            = this.params.left;
        if(this.params.top)             this.DOMelement.style.top             = this.params.top;
        if(this.params.width)           this.DOMelement.style.width           = this.params.width;
        if(this.params.height)          this.DOMelement.style.height          = this.params.height;
        if(this.params.margin)          this.DOMelement.style.margin          = this.params.margin;
        if(this.params.padding)         this.DOMelement.style.padding         = this.params.padding;
        if(this.params.backgroundColor) this.DOMelement.style.backgroundColor = this.params.backgroundColor;
        if(this.params.color)           this.DOMelement.style.color           = this.params.color;
        
        this.DOMelement.data         = this;
        this.DOMelement.onclick      = _internHandle_onClick;
        this.DOMelement.ondblclick   = _internHandle_onDblclick;
        this.DOMelement.onkeypress   = _internHandle_onKeypress;
        this.DOMelement.onKeydown    = _internHandle_onKeyDown;
        this.DOMelement.onKeyup      = _internHandle_onKeyUp;
        this.DOMelement.onwheel      = _internHandle_onWheel;
        this.DOMelement.onmousemove  = _internHandle_onmousemove;
        this.DOMelement.onmouseout   = _internHandle_onmouseout;
        this.DOMelement.onmousedown  = _internHandle_onmousedown;
        this.DOMelement.onmouseup    = _internHandle_onmouseup;

        if(this.parent.isTFObject)
        {
          utils.log("Variante1 parent==TFObject -> erzeugtes DOMelement "+this.params.object+" wird in "+this.parent.DOMelement+" eingefügt");
          this.parent.DOMelement.appendChild( this.DOMelement );  
        }   
        else 
             {
              utils.log("Variante2 parent<>TFObject -> erzeugtes DOMelement "+this.params.object+" wird in parent -> "+this.DOMelement+" eingefügt");
              this.parent.appendChild( this.DOMelement );  
        } 
       
    }
    else this.DOMelement = null;
   
  } 
   
  
  hide()
  {
    this.DOMelement.style.display = 'none';  
  }

  show()
  {
    this.DOMelement.style.display = 'block';  
  }

  appendChild(aDOMelement)
  {
    this.DOMelement.appendChild(aDOMelement);
  }

  
  set width( value )
  {
    utils.log("setter width: " + value );
    if(this.DOMelement) this.DOMelement.style.width = value;
  } 

  get width()
  {
    var r=undefined;
    if(this.DOMelement)  r = this.DOMelement.offsetWidth;
    return r;
  } 


  set height( value )
  {
    if(this.DOMelement) this.DOMelement.style.height = value;
  } 

  get height()
  {
    var r=undefined;
    if(this.DOMelement)  r = this.DOMelement.offsetHeight;
    return r;
  } 
  
  set left( value )
  { 
    utils.log("setLEFT=" + value);
    var v=this.value; 
    if(v<0) v=0;
       if(this.DOMelement)
    {
       this.DOMelement.style.position = "absolute"; 
       this.DOMelement.style.left     = v;
    }
  } 

  get left()
  {
    var r=undefined;
    if(this.DOMelement)  r = this.DOMelement.offsetLeft;
    return r;
  } 


  set top( value )
  {
    utils.log("setTOP=" + value);
    var v=this.value; 
    if(v<0) v=0;
    if(this.DOMelement)
    {
       this.DOMelement.style.position = "absolute";  
       this.DOMelement.style.top      = v;
    } 
  } 

  get top()
  {
    var r=undefined;
    if(this.DOMelement)  r = this.DOMelement.offsetTop;
    utils.log("getTOP=" + r);
    return r;
  } 

  set backgroundColor(value)
  {
    if(this.DOMelement) this.DOMelement.style.backgroundColor = value;
  } 

  get backgroundColor()
  {
    var r=undefined;
    if(this.DOMelement)  r = this.DOMelement.style.backgroundColor;
    return r;
  } 

  set color(value)
  {
    if(this.DOMelement) this.DOMelement.style.color = value;
  } 

  get color()
  {
    var r=undefined;
    if(this.DOMelement)  r = this.DOMelement.style.color;
    return r;
  } 

  set orientation( value )
  {
   this._orientation = value;
   if( !this.DOMelement)  return ;
  
  if(value.toUpperCase()=="CENTER")
  {
    this.left                      = Math.round((this.parent.width  - this.width  ) / 2 )+"px";
  }

  if(value.toUpperCase()=="LEFT")
  {
    this.left                      = "0px";
  }
  
  if(value.toUpperCase()=="MIDDLE")
  {
    this.left                      = Math.round((this.parent.width  - this.width  ) / 2 )+"px";
    this.top                       = Math.round((this.parent.height - this.height ) / 2 )+"px";
  }  
}
 
  get orientation()
  {
    return this._orientation;
  }

  set margin( value ) 
  {
    if(this.DOMelement) this.DOMelement.style.margin = value;
  }

  get margin()
  {
    return this.DOMelement.style.margin;
  }


  destroy()
  {
    while(this.childList.lenth>0)
    {
      var o=this.childList.pop();
      o.destroy();
      o=null;
    }
    
    parent.DOMelement.removeChild(this.DOMelement); 
    
  }
}   //end class ...


export class TFLabel extends TFObject 
{
  constructor( aParent , aParams ) 
  {
    aParams.object               = "P";
    if(!aParams.css) aParams.css = "cssLabel";

    super( aParent , aParams);
    if(aParams.caption) this.caption = aParams.caption;

    this.objName    = "TFLabel";

  } 
  
  set caption( value )
  {
    this._caption = value;
    if(this.DOMelement) this.DOMelement.innerHTML = value;
  } 

  get caption()
  {
    return this._caption;
  } 
}   //end class ...


export class TFPanel extends TFObject 
{
  constructor( aParent , aParams ) 
  {
    aParams.object               = "DIV";
    if(!aParams.css) aParams.css = "cssPanel";

    super( aParent , aParams);  

    this.objName    = "TFPanel";
  }  
}   //end class ...


export class TFCheckBox extends TFObject 
{
  constructor( aParent , aParams ) 
  {
    aParams.object               = "TFCHECKBOX";
    if(!aParams.css) aParams.css = "";

    super( aParent , aParams);  
    this.objName    = "TFCheckbox";
  } 
  
  checked() { return this.DOMelement.checked  }

}   //end class ...




export class TFEdit 
{
  constructor ( aParent , params )  
  {
    this.objName                = "TFEdit";
    this.className              = this.constructor.name;  
    this.callBack_onChange      = undefined;
    this.callBack_onClick       = undefined;
    this.container              = undefined;
    this.cell4Label             = undefined;
    this.cell4Edit              = undefined;
    this.cell4Appendix          = undefined;

    utils.log(" TFEdit.constructor() aPparent:"+aParent+"  ,  params:"+JSON.stringify(params));

    if (!globals.Screen) globals.setScreen(new Screen() );
    
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
            this.parent = Screen;
            utils.log("TFObject.constructor() ... parent ermittelt aus screen:"+this.parent);
          }  
    }         

    // ein Edit-Objekt befindet sich immer in einer Tabellen-Zeile mit 2 oder 3 Spalten.
    // ist das Label der Eingabezelle vorangestellt (labelPosition=left) werden 3TD's  mit label / edit / appendix erstellt
    // ist das Label der Eingabezelle übergestellt (labelPosition=top) werden 2TD's mit label+edit / appendix erstellt.
    var width  = "100px";
    var height = "3em";
    if(params.width)  width=params.width;
    if(params.height) width=params.height;

    this.container = dialogs.addPanel ( this.parent , "cssPanelForInput" , width , height );
   
    var helpTable             = document.createElement("TABLE");  
        helpTable.className   = "cssGridLayout";
          
        this.container.DOMelement.appendChild( helpTable );     
    var tr = document.createElement('tr');
        helpTable.appendChild(tr)
    
        var w1 = 40;
        if(!params.labelText) w1=0;
    
        var w3 = 20;
        if(!params.appendix) w3=0;
    
        var w2 = 100-w1-w3-1;
    
        var w4 = 80;
        if(!params.appendix) w4=100;
    
    
        if(params.labelPosition.toUpperCase()=="LEFT")
        {
             this.cell4Label             = document.createElement('td');
             this.cell4Label.className   = "cssGridCell";
             if(params.labelWidth) this.cell4Label.style.width = params.labelWidth;
             else                  this.cell4Label.style.width = w1+"%";
             tr.appendChild(this.cell4Label);
             
             this.cell4Edit            = document.createElement('td');
             this.cell4Edit.className  = "cssGridCell";    
             if(params.editWidth) this.cell4Edit.style.width = params.editWidth;
             else                 this.cell4Edit.style.width = w2+"%";
             tr.appendChild(this.cell4Edit);
        }
        else
            {
              this.cell4Label           = document.createElement('td');  
              this.cell4Label.className = "cssGridCell";  
              if(params.editWidth) this.cell4Label.style.width = params.editWidth;
              else                 this.cell4Label.style.width = w4+"%";
              tr.appendChild(this.cell4Label);
              this.cell4Edit   = this.cell4Label;    
        }  
     
        if( params.appendix) 
        {
          this.cell4Appendix           = document.createElement('td');   
          this.cell4Appendix.className = "cssGridCell";
          if(params.appendixWidth) this.cell4Appendix.style.width = params.appendixWidth;
          else                     this.cell4Appendix.style.width = "20%";
          tr.appendChild(this.cell4Appendix);
        }  
    

    // Tabellengerüst steh, nun werden Label, Edit und ggf der Apendix eingefügt
    this.label = document.createElement("LABEL");
    this.label.className = params.cssLabel ? params.cssLabel : "cssLabelForInput";
    if(params.labelText) this.label.innerHTML = params.labelText; 
    this.cell4Label.appendChild( this.label );  
     
    this.input             = document.createElement("INPUT");
    this.input.className   = params.cssEdit ? params.cssEdit : "cssEditField";
    this.cell4Edit.appendChild( this.input ); 

    if( params.appendix ) 
    {
        this.appendix = document.createElement("LABEL");
        this.appendix.className = params.cssAppendix  ? params.cssAppendix : "cssLabelForInput";
        this.appendix.innerHTML = params.appendix;
        this.cell4Appendix.appendChild( this.appendix );     
    }
  } 
  
  set text( txt )
  {
    this.input.value = txt;
  }

  get text()
  {
    return this.input.value;
  }



}  //end class ...


export class TFCombobox 
{
  constructor ( aParent , params )  
  {
    this.objName                = "COMBOBOX";
    this.className              = this.constructor.name;  
    this.items                  = [];
    this.combobox               = undefined;
    this.callBack_onChange      = undefined;
    this.callBack_onClick       = undefined;
    this.container              = undefined;
    this.cell4Label             = undefined;
    this.cell4Edit              = undefined;
    this.cell4Appendix          = undefined;

    utils.log(" TFEdit.constructor() aPparent:"+aParent+"  ,  params:"+JSON.stringify(params));

    if (!globals.Screen) globals.setScreen(new Screen() );
    
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
            this.parent = Screen;
            utils.log("TFObject.constructor() ... parent ermittelt aus screen:"+this.parent);
          }  
    }         

    // ein Edit-Objekt befindet sich immer in einer Tabellen-Zeile mit 2 oder 3 Spalten.
    // ist das Label der Eingabezelle vorangestellt (labelPosition=left) werden 3TD's  mit label / edit / appendix erstellt
    // ist das Label der Eingabezelle übergestellt (labelPosition=top) werden 2TD's mit label+edit / appendix erstellt.
    var width  = "100px";
    var height = "3em";
    if(params.width)  width=params.width;
    if(params.height) width=params.height;

    this.container = dialogs.addPanel ( this.parent , "cssPanelForInput" , width , height );
   
    var helpTable             = document.createElement("TABLE");  
        helpTable.className   = "cssGridLayout";
          
        this.container.DOMelement.appendChild( helpTable );     
    var tr = document.createElement('tr');
        helpTable.appendChild(tr);

    var w1 = 40;
    if(!params.labelText) w1=0;

    var w3 = 20;
    if(!params.appendix) w3=0;

    var w2 = 100-w1-w3-1;

    var w4 = 80;
    if(!params.appendix) w4=100;


    if(params.labelPosition.toUpperCase()=="LEFT")
    {
         this.cell4Label             = document.createElement('td');
         this.cell4Label.className   = "cssGridCell";
         if(params.labelWidth) this.cell4Label.style.width = params.labelWidth;
         else                  this.cell4Label.style.width = w1+"%";
         utils.log("TCombobox.cell4label.Width:"+this.cell4Label.style.width);
         tr.appendChild(this.cell4Label);
         
         this.cell4Edit            = document.createElement('td');
         this.cell4Edit.className  = "cssGridCell";    
         if(params.editWidth) this.cell4Edit.style.width = params.editWidth;
         else                 this.cell4Edit.style.width = w2+"%";
         utils.log("TCombobox.cell4edit.Width:"+this.cell4Edit.style.width)
         tr.appendChild(this.cell4Edit);
    }
    else
        {
          this.cell4Label           = document.createElement('td');  
          this.cell4Label.className = "cssGridCell";  
          if(params.editWidth) this.cell4Label.style.width = params.editWidth;
          else                 this.cell4Label.style.width = w4+"%";
          utils.log("TCombobox.cell4(label&edit).Width:"+this.cell4Edit.style.width);
          tr.appendChild(this.cell4Appendix);
          this.cell4Edit  = this.cell4Label;    
    }  
 
    if( params.appendix) 
    {
      this.cell4Appendix           = document.createElement('td');   
      this.cell4Appendix.className = "cssGridCell";
      if(params.appendixWidth) this.cell4Appendix.style.width = params.appendixWidth;
      else                     this.cell4Appendix.style.width = "20%";
      utils.log("TCombobox.cell4appendix.Width:"+this.cell4Appendix.style.width);
      tr.appendChild(this.cell4Appendix);
    }  

    // Tabellengerüst steh, nun werden Label, Edit und ggf der Apendix eingefügt
    this.label = document.createElement("LABEL");
    this.label.className = params.cssLabel ? params.cssLabel : "cssLabelForInput";
    if(params.labelText) this.label.innerHTML = params.labelText; 
    this.cell4Label.appendChild( this.label );  

    this.combobox             = document.createElement("SELECT");
    this.combobox.className   = params.cssEdit ? params.cssEdit : "cssComboBox";
    this.combobox.name        = "combobox"+Math.round(Math.random()*100000);
 
    this.combobox.addEventListener('change',  function() { this.itemIndex=this.combobox.value;  if(this.callBack_onClick) this.callBack_onClick( this.combobox.value ) }.bind(this));
      
    this.cell4Edit.appendChild( this.combobox ); 

    if(params.items.length) this.setItems(params.items)
   
    if( params.appendix ) 
    {
        this.appendix = document.createElement("LABEL");
        this.appendix.className = params.cssAppendix  ? params.cssAppendix : "cssLabelForInput";
        this.appendix.innerHTML = params.appendix;
        this.cell4Appendix.appendChild( this.appendix );     
    }
 }

 set text( txt )
 {
  this.combobox.value = txt;
 }

 get text()
 {
  var ndx = this.combobox.selectedIndex;
  return this.combobox.options[ndx].text;
 }

 setItems( items )
 {
  while(this.items.length>0) {this.items.splice(0,1)}
  utils.log("set Items : " + items );
  for(var i=0; i<items.length;i++) this.addItem( items[i] );
 } 

getItems()
{
  return this.items;
} 

addItem( txt )
{
  this.items.push( txt );
  var  newItem = new Option( txt , this.items.length-1);
  utils.log("add Item : " + newItem + " text:" + txt );
  this.combobox.add( newItem , undefined);

  /*

  var item = document.createElement('OPTION');
      item.name = "option"+this.items.length;
      item.value = this.items.length-1;    
      item.innerHTML = txt;
     utils.log("add Item : " + item + " text:" + txt );
     this.input.appendChild(item);
  */   
}

itemIndex() { return this.combobox.selectedIndex; }


} // end class


export class TFWorkSpace
{
  constructor( ID , caption1 , caption2 )  
  {
    this.isWorkspace        = true;
    this.isTFObject         = true;
    this.objName            = "TFWorkspace";
    this.className          = this.constructor.name;  
    this.wsID               = ID;
    this.handle             = null;

    // vorsichtshalber ...
    if (!globals.Screen) globals.setScreen(new Screen() );

    this.container            = document.createElement('DIV');  
    this.container.className  = "cssWorkSpaceContainer";  
    this.container.id         = ID;
    globals.Screen.DOMelement.appendChild(this.container);

    var cTop = "";
    utils.log("caption1="+caption1+"   caption2="+caption2);

    if(caption1 || caption2)
    {
      utils.log("erzeuge Panel für Caption"); 
      this.caption             = document.createElement('DIV');  
      this.caption.id          = ID+"_caption";
      this.caption.className   = "cssWorkSpaceCaption";  
      this.caption.style.height= "4em";  
      cTop                     = "4em";
      this.container.appendChild(this.caption);
           
       if(caption1) 
       { 
         var l1            = document.createElement('P');  
             l1.className  = "cssCaption1";  
             this.caption.appendChild(l1);
             l1.innerHTML  = caption1;
       }       
      
       if(caption2) 
       { 
         var l2            = document.createElement('P');  
             l2.className  = "cssCaption2";  
             this.caption.appendChild(l2);
             l2.innerHTML  = caption2;
       }       
    } 
    else {
          utils.log("erzeuge Null-Panel, da kein Caption angezeigt werden soll"); 
          this.caption             = document.createElement('DIV');  
          this.caption.id          = ID+"_caption";
          this.caption.className   = "cssWorkSpaceCaption";  
          // einige Styles vom WorkspaceCaption überschreiben wenn leer ...
          this.caption.style.height   = "1px";  
          this.caption.style.margin   = "0px";
          this.caption.style.border   = "none";
          this.caption.style.color    = "inherit";
          this.caption.style.backgroundColor = "inherit";
          this.container.appendChild(this.caption); 
          cTop                     = "0px";
     } 
    
    utils.log("Erzeuge Workspace mit TOP:"+cTop);
    this.handle = new TFObject( this , {object:"DIV",css:"cssWorkSpace", top:cTop, dontRegister:true});
    
  }

  get childList()
  {
    utils.log("get Workspace.childList this:"+this.objName );
    return this.handle.childList;
  }

  get DOMelement()
  {
    if(this.handle)
    {
       utils.log("get Workspace.DOMelement this:"+this.objName+"  this.handle:"+this.handle.objName );
       return this.handle.DOMelement;
    } 
    else {
          utils.log("get Workspace.DOMelement (das erste Element bekommt dn Container als DOMelent präsentiert) container:"+this.container.id);
          return this.container;
     }
  } 

  appendChild (aDOMelement) {this.DOMelement.appendChild(aDOMelement); }

  removeChild (aDOMelement) {this.DOMelement.appendChild(aDOMelement); }   
  
  select()
  {
      utils.log("Workspace.select( this="+this.container.id+")");
      globals.webApp.activeWorkspace.hide();
      globals.webApp.activeWorkspace = this;
      utils.log("selectWorkspace ... aktivieren von "+this.container.id);
      globals.webApp.activeWorkspace.show()  
  }


  hide()
  {
    this.container.style.display = 'none';  
  }

  show()
  {
    this.container.style.display = 'block';  
  }
}  //end class ...


export class TFButton extends TFObject
{
  constructor( aParent , params )
  {
     params.object = "BUTTON";
     if(!params.css) params.css = "cssButton01";
  
      super( aParent , params);
      if(params.caption) this.caption = params.caption;
  
      this.objName    = "TFButton";
      
  } 

  set caption( txt )
  {
    this.DOMelement.innerHTML = txt;
  }

  get caption()
  {
    return this.DOMelement.innerHTML; 
  }
}  

export class TFNavigationBar
{
  constructor( aParent , params )
  {
    this.className        = this.constructor.name;  
    this.DOMelement_Panel = dialogs.addPanel( aParent , "cssNavigationBar" , "100%" , "35px" )
  } 
}  

