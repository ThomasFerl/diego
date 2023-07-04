import * as globals      from "./globals.js";
import { Screen }        from "./tfObjects.js";
import { tfWebApp }      from "./tfWebApp.js";
import { createWindow }  from "./tfDialogs.js";
import { tfAnalogClock}  from "./tfAnalogClock.js";
         
export function main(capt1,capt2)
{
  globals.setScreen( new Screen() );
  globals.initWebApp( new tfWebApp(capt1,capt2) );

  var w      = createWindow(null , "Uhrzeit" , 400 , 400 );
  console.log('var clock  = new tfAnalogClock( w.hWnd );');
  var clock  = new tfAnalogClock( w.hWnd );
  console.log(' clock  = '+clock );
  clock.construktor(w.hWnd);
  clock.run();



}  
