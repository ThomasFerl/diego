import * as globals  from "./globals.js";
import * as utils    from "./utils.js";
import * as dialogs  from "./tfDialogs.js";

  export class TFVideoPlayer
{ 
 
  constructor ( aUrl , aCaption , aWidth , aHeight )
  {  
    this.what           = 'Videoplayer';
    this.caption = aCaption;
    this.width   = aWidth;
    this.height  = aHeight;
    this.playerTemplate = utils.loadContent(globals.URL_static+'./res/videoplayer.html');
    console.log(this.playerTemplate.doc.toString);
   
    if(!this.playerTemplate.ERROR)
    {   
      this.playerWnd   = window.open( ''  , '' , 'width="'+this.width+'", height="'+this.height+'" , fullscreen=yes , resizable=yes , status=no , menubar=no , location=no , scrollbars=no , toolbar=no ');
    
      var HTML  = this.playerTemplate.doc;
          HTML += '<video id="clipperVideo" controls style="width:90%;height:80%;">';
          HTML += '  <source src="'+aUrl+'">';
          HTML += '</video>';
          HTML += '<script>';
          HTML += '        var player = document.getElementById("clipperVideo");'
          HTML += '            player.addEventListener("timeupdate", ()=>{ showPosition( this) } , false);';
          HTML += '            player.volume=0;';
          HTML += '            player.play();';
          HTML += '</script>';
          HTML += '</body></html>';
          
          this. playerWnd.document.write(HTML); 
    }  
  } 
   
    
   
  updateContent( aUrl )
  {
    var HTML  = this.playerTemplate.doc;
          HTML += '<video id="clipperVideo" controls style="width:90%;height:80%;">';
          HTML += '  <source src="'+aUrl+'">';
          HTML += '</video>';
          HTML += '<script>';
          HTML += '        var player = document.getElementById("clipperVideo");'
          HTML += '            player.addEventListener("timeupdate", ()=>{ showPosition( this) } , false);';
          HTML += '            player.volume=0;';
          HTML += '            player.play();';
          HTML += '</script>';
          HTML += '</body></html>';

          if(this.playerWnd &&  !this.playerWnd.closed ) 
          { 
            this. playerWnd.document.body.innerHTML=''; 
            this. playerWnd.document.write(HTML);
          } 
          else 
              {
                this.playerWnd   = window.open( ''  , '' , 'width="'+this.width+'", height="'+this.height+'" , fullscreen=yes , resizable=yes , status=no , menubar=no , location=no , scrollbars=no , toolbar=no ');
                this. playerWnd.document.write(HTML); 
              }      
   
  }

}