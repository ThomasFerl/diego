import * as globals     from "./globals.js";
import { TFWorkSpace }  from "./tfObjects.js";


export class tfWebApp
{
  constructor(caption1,caption2)
  {
    this.isTFObject      = true;
    this.body            = globals.Screen.DOMelement;
    
   if(caption1) this.caption1 = caption1;
   else         this.caption1 = "";

   if(caption2) this.caption2 = caption2;
   else         this.caption2 = "";
   
   this.activeWorkspace = undefined;
   this.workSpaces      = [];
   this.windows         = [];
   this.zIndex          =  0;
   this.clientWidth     =  globals.Screen.width;
   this.clientHeight    =  globals.Screen.height;
   
   // initiale Arbeitsfläche
   this.newWorkSpace("main" , caption1 , caption2 );
  } 
 

  newWorkSpace( ID , caption1 , caption2 )
  {
    var wsID      = "workSpace_"+this.workSpaces.length;
    if (ID) wsID  = ID;

    var ws = new TFWorkSpace( wsID , caption1 , caption2 );
    this.workSpaces.push(ws);

    if(!this.activeWorkspace) this.activeWorkspace = ws; 
    
    return ws;                          
  }

  
  selectWorkSpace(ID)
  {
    console.log("selectWorkspace("+ID+")  aus einer Liste von ["+this.workSpaces.length+"] workspaces ...");
    var ws    = null;
    for(var i=0; i<this.workSpaces.length;i++)
    {
      ws = this.workSpaces[i];
      console.log("selectWorkspace.compare with "+ws.container.id);
      if(ws.container.id==ID) {ws.select();  return ws;  }
    }
    return null;
  }
   
}
