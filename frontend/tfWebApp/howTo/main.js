import * as globals      from "./globals.js";
import * as utils        from "./utils.js";
import * as dialogs      from "./tfDialogs.js";

import { Screen }      from "./tfObjects.js";
import { tfWebApp }      from "./tfWebApp.js";
import { createWindow }  from "./tfDialogs.js";


export function main(capt1,capt2)
{
  utils.log("InitWebApp()");
  globals.setScreen( new Screen() );
  globals.Screen.HTML = "ScreenSize:  w=" + globals.Screen.width+" x h="+globals.Screen.height + " px"
  
  globals.initWebApp( new tfWebApp(capt1,capt2) );

  var w = createWindow(null , "Test" , 200 , 300 );
  var b = dialogs.addButton(w,"","200px","100px","close");
      b.callBack_onClick = function() {console.log("CLOSE"); w.closeWindow();}




}  
