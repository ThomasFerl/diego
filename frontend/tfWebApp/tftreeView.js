import * as dialogs  from "./tfDialogs.js";
import * as utils    from "./utils.js";


export class TFTreeNode 
{
  
  constructor( aTreeView , aParentNode , aCaption , aContent )
  {
  this.className         = this.constructor.name;  
   // console.log("TFTreeNode.Constructor( parentNode="+aParentNode+" ,  Caption=" +aCaption+" , content="+aContent );
  this.treeView          = aTreeView;
  this.dept              = 0;
  this.parentNode        = aParentNode;
  this.items             = [];
  this.caption           = aCaption;
  this.DOMelement        = null;
  this.DOMElement_switch = null;
  this.collabsed         = true;
  this.callBack_onClick  = undefined;
  this.selected          = false;
      
  // falls kein Datenobjekt übergeben wurde, dummyObj mit dummyContent erzeugen ...
  if (aContent) this.content = aContent;
  else          this.content = { dummyContent:42 };

  if(this.parentNode)
  {     
    this.dept = this.parentNode.dept + 1;
    this.parentNode.items.push( this ); 
  }
 }

 addNode(  aCaption , aContent )
 { 
    return new TFTreeNode( this.treeView ,  this , aCaption , aContent );
 }

//---end of Constructor----------------------------------------------------------

  isRootNode() { return this.parentNode==null }


  collabse(yes)
  {
    if (this.items.length<1) return -1;

    if(yes) this.collabsed = yes;
    else    this.collabsed = !this.collabsed;
    
    if (this.items.length>0)
    {
      if(this.collabsed) 
      {
        for(var i=0; i<this.items.length;i++)
        {       
          var n=this.items[i];
          n.collabse(true);
          n.DOMelement.style.display = 'block'; 
        }  
        this.DOMelement_switch.innerHTML = "<B>-</B>";
      }
      else 
      {
        for(var i=0; i<this.items.length;i++)
        {       
          var n=this.items[i];
          n.collabse(false);
          n.DOMelement.style.display = 'none'; 
        }  
        this.DOMelement_switch.innerHTML = "<B>+</B>";
      }
    }
  }


  onClickHandler(event)
  {
    var node = this;

    node.treeView.forEachNode( null , (aNode)=>{ aNode.selected=false; } );
    node.selected = true;
    node.printContent();
    event.stopPropagation();
    
    if (node.callBack_onClick) node.callBack_onClick( node );
  } 

 
  onToggleCollabse(event)
  {
    var node = this;
    //console.log("onToggleCollabse -> X:"+event.offsetX+"  Y:"+event.offsetY+"  Node: " + node.caption + "   DIV:"+node.DOMelement);
    
    event.stopPropagation();

    if (node.items.length>0) node.collabse();
  }  
    
  printContent()
  {
    if(!this.DOMelement_text) return;

    if (this.selected) this.DOMelement_text.innerHTML     = '<B><U>'+this.caption+'</U></B>';
    else               this.DOMelement_text.innerHTML     = this.caption;
    
  }

  buildNode( aDOMcontainer )
  {

    //console.log('BuildNode['+this.caption+']')
    this.DOMelement                    = document.createElement('DIV'); 
    this.DOMelement.className          = "treeNodePanel";
    this.DOMelement.style.paddingLeft  = this.dept+"em";
    this.DOMelement.value              = this;
    this.DOMelement.onclick            = this.onClickHandler.bind(this);
    aDOMcontainer.appendChild( this.DOMelement );
    this.savedStyle                    = this.DOMelement.style;
   
    this.DOMelement_switch             = document.createElement('DIV'); 
    this.DOMelement_switch.className   = "treeNodeSwitch";
    this.DOMelement_switch.onclick     = this.onToggleCollabse.bind(this);
    this.DOMelement_switch.value       = this;
    this.DOMelement.appendChild(this.DOMelement_switch);
  
    this.DOMelement_text               = document.createElement("p");
    this.DOMelement_text.className     = "treeNode";
    this.printContent();
    this.DOMelement_text.value         = this;
    this.DOMelement.appendChild(this.DOMelement_text);
   
    // falls subNodes existieren.....
    if(this.items.length > 0) 
    {
      //console.log('insertSubNodes');
      for (var i=0 ; i<this.items.length; i++)
      {
        var node = this.items[i];
        console.log('SubNode ' + node.caption);
        node.buildNode(aDOMcontainer);
      }

      this.DOMelement_switch.innerHTML = "<B>-</B>";
      this.collabsed = true;

    }
  }   

  debugLog = function()
  {
   if (this.parentNode) console.log(utils.tab(this.dept*3)+this.dept+": "+this.caption+"   Content:"+JSON.stringify(this.content)+"   my parent is: "+ this.parentNode.caption);
   else                 console.log(utils.tab(this.dept*3)+this.dept+": "+this.caption+"   Content:"+JSON.stringify(this.content)+"   my parent is: NULL");

   this.items.forEach( function(node) {node.debugLog();} ) 
  }         

} 

export class TFTreeView
{
constructor( aParent , params )
{
  this.className         = this.constructor.name;  
  this.parent=aParent;
  if(!this.parent) this.parent=document.body;

  var w=params.width;
  if(!w) w="100px";

  var h=params.height;
  if(!h) h="100%";

  this.rootNodes = [];
  this.items     = [];

  this.treeViewPanel = dialogs.addPanel( this.parent , "cssTreeViewContainer" ,  w , h , true );

  this.content = { dummyContent:42 };

 }  
   

 addNode( aCaption , aContent )
 { 
    var n = new TFTreeNode( this , null , aCaption , aContent );
    this.rootNodes.push( n );
    this.items = this.rootNodes;
    return n;
 }
 

  addSubNode( aParentNode , aCaption , aContent )
  { 
    if(aParentNode)
    {
      var n = new TFTreeNode( this , aParentNode , aCaption , aContent );
      return n;
    }
    else return null;  
  }


  buildNodeList()
  {
    var DOM = this.treeViewPanel.DOMelement;
        DOM.innerHTML='';
        for(var i=0; i<this.rootNodes.length; i++)
        { var node = this.rootNodes[i]; 
              node.buildNode(DOM);
        }
   }  
      

  debugLog()
  {
    console.log("");
    console.log("---------------TFTreeView-------------------------");
    this.rootNodes.forEach( function(rootNode) {rootNode.debugLog();} );
  }


  forEachNode( entryPoint , callback )
  {
    if(entryPoint==null)
      for (var i=0; i<this.rootNodes.length; i++)  this.forEachNode( this.rootNodes[i] , callback );

    else  
    {
       callback( entryPoint );
       for(var i=0; i<entryPoint.items.length;i++) this.forEachNode( entryPoint.items[i] , callback ); 
    }
  }  


  

}
