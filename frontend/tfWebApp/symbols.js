import * as d3 from "./d3_v7.js"


export function onCloseSymbolClick( pointerEvent )
{
  var w = this.__data__;
  if(w)  w.closeWindow();
}




export function asBase64( symbolNname )
{
 var ret = "";

if(symbolNname == "close") ret ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADlSURBVDhPtZMhDgIxEEXrkEiOgERyBCQSieQISG6ARCKRSCQSiUQikUgs/Jfsb4bddlH85IWm05n+6Q7pX5qKjTiJc7Oei58aCZLeFS5iLIoi+SlKiZGXmIiOsOpDt7A297AmPhBZC+EgNhF9e4+2SDiEvbXI2gkHYCmQH5LkmcC+z7CfdRWxALgIaicD75VV6jne0HYIFMw6ihiMtu1kL+IZXGfxIA7wiO2eXSRehKssZuAhCJC0bX59GNjznBDrDBQ3xoQ+VqIorPZNIzd/ff+SaIeBiV+G9ui/+j+oaSgoWFFKHxyrfnGS+h1YAAAAAElFTkSuQmCC";  



  return ret;
}    



