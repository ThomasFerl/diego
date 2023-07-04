const msPerDay       = 24*60*60*1000;
const beginUnixTime  = 25569;             // 01.01.1970

function mod(a,b) { if(b!=0) return Math.floor(a/b); else return NaN;}

class TDateTime
{
    
  constructor( param )
    {
      console.log('TDateTime('+param+')  param vom Typ: ' + param.constructor.name.toUpperCase()); 
      
      if(param==undefined) this.uxDateTime = new Date();
      else {
            if (param.constructor.name.toUpperCase()=='STRING')
            {
              // Standrd-ISO kann JS Date() selber parsen...
              if(param.split('-').length>1) {console.log('DATE ist ISO conform: '); this.uxDateTime = new Date(param)}
              else {
                      // Uhrzeit vom datum trennen
                      var h = param.split(' ');
                      var dStr = h[0];
                      if (h.length > 1) var tStr=h[1];

                      //console.log('dStr:'+dStr);
                      //console.log('tStr:'+tStr);
                      
                      // Datumsbestandteile trennen
                      var prts = dStr.split('.');
                      //console.log('D prts:' + prts);

                     if(!isNaN(prts[0])) this.dd = prts[0]*1;
                     if(!isNaN(prts[1])) this.mm = prts[1]*1;
                     if(!isNaN(prts[2])) this.yy = prts[2]*1;

                    this.hh=0;
                    this.mn=0;
                    this.ss=0;

                    if(tStr)
                    {
                      // Falls eine Uhrzeit vorhanden, diese in Bestandteile zerlegen  
                      prts = tStr.split(':');
                      //console.log('T prts:' + prts);
                      if(!isNaN(prts[0])) this.hh = prts[0]*1;
                      if(!isNaN(prts[1])) this.mn = prts[1]*1;
                      if(!isNaN(prts[2])) this.ss = prts[2]*1;
                   }
                 
                   this.uxDateTime = new Date(this.yy, this.mm-1, this.dd, this.hh, this.mn, this.ss);
              }   
              
            }
      
            if (param.constructor.name.toUpperCase()=='DATE')      this.uxDateTime = new Date(param.valueOf()); 
            if (param.constructor.name.toUpperCase()=='TDATETIME') this.uxDateTime = new Date(param.uxDateTime.valueOf()); 
            if (param.constructor.name.toUpperCase()=='NUMBER')    this.uxDateTime = new Date(param*msPerDay+beginUnixTime); 
           
           }  
      
      this._update();

      //console.log('TDateTime('+param+') -> ' + this.formatDateTime() ); 
      
    }
    
    _update()
    {
      this.tt=this.uxDateTime.getDay();
      this.dd=this.uxDateTime.getDate()
      this.mm=this.uxDateTime.getMonth()+1;
      this.yy=this.uxDateTime.getFullYear();
      this.hh=this.uxDateTime.getHours();
      this.mn=this.uxDateTime.getMinutes();
      this.ss=this.uxDateTime.getSeconds();
    }

    valueOf() { return (this.uxDateTime.valueOf()/msPerDay)+beginUnixTime; }


    now(){ return (this.uxDateTime.valueOf()/msPerDay)+beginUnixTime; }

    incDays(d)
    {
      this.uxDateTime = new Date(this.uxDateTime.valueOf()+(d*msPerDay));
      this._update();
      return this;
    }
    
    incMonth(m)
    {
      this._update();
      var dy  =m % 12;
      var dm  =m-(dy*12);
      this.mm = this.mm + dm;
      this.yy = this.yy + dy;
      this.uxDateTime = new Date(this.yy, this.mm-1, this.dd, this.hh, this.mn, this.ss);
      this._update();
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
    
    formatDateTime() {return this.formatDate() + ' ' + this.formatTime()}

} 

function calculateScaleTicks(min, max, tickCount) 
{ // DANKE: stackOverflow.com
    var span     = max - min,
        step     = Math.pow(10, Math.floor(Math.log(span / tickCount) / Math.LN10)),
        err      = tickCount / span * step;

    var roundFak = Math.floor(Math.log(span / tickCount)/Math.LN10);
    //console.log('1.calculateScaleTicks() rounfFak: ' + roundFak);
    if (roundFak<0) roundFak = 2*Math.abs(roundFak)
    //console.log('2.calculateScaleTicks() rounfFak: ' + roundFak);
        
        // Ergänzung von tferl
        roundFak = roundFak + 1;    
        roundFak = Math.pow(10, roundFak); 
        if(isNaN(roundFak)) roundFak = 1;
        //console.log('3.calculateScaleTicks() rounfFak: ' + roundFak);    

    // Filter ticks to get closer to the desired count.
    if (err <= .15) step *= 10;
    else if (err <= .35) step *= 5;
    else if (err <= .75) step *= 2;

    // Round start and stop values to step interval.
    var tstart     = Math.ceil(min / step) * step,
        tstop      = Math.floor(max / step) * step + step * .5;
    var scaleTicks = [];
    for (i=tstart; i < tstop; i += step) scaleTicks.push(Math.round(i*roundFak)/roundFak);  
    
    return scaleTicks;
}


function drawText( ctx ,  txt ,  x , y , txtDist , _90Grad )
{
      
       if(_90Grad)
       {
        // 90 Grad drehen
       ctx.save();
       ctx.textAlign = "center";
       ctx.rotate(-Math.PI / 2);
       // x <-> y vertauschen und y negativ
       ctx.fillText( txt , -y , x ,  txtDist*10);
       ctx.restore();
       }
       else ctx.fillText( txt , x , y , txtDist*2 );

}



tfChart = class
{
    constructor( canvasId )     
    { 
      this.title            =  '******* Title *******';
      this.xLabel           =  'X-Achse';
      this.yLabel           =  'Y-Achse';
      this.labelFont        = '1em Arial'; 
      this.dataPointFont    = '.7em Arial';
      this.isDateTimeScale  = false;
      this.canvas           = document.getElementById(canvasId);
      this.ctx              = canvas.getContext("2d");
      this.chartHeight      = this.canvas.getAttribute('height');
      this.chartWidth       = this.canvas.getAttribute('width');
      this.points           = [];
      this.margin           = { top   : 40, left: 75, right: 0, bottom: 75 };
      this.drawRect         = { left  :this.margin.left, 
                                top   :this.margin.top, 
                                width :this.chartWidth -this.margin.left-this.margin.right, 
                                height:this.chartHeight-this.margin.top -this.margin.bottom,
                                right :this.chartWidth-this.margin.right,
                                bottom:this.chartHeight-this.margin.bottom
                             };
      this.renderType       = 'lines'; // 'points';
      this.maxXValue        = 0;
      this.maxYValue        = 0;
      this.minXValue        = 1E99;
      this.minYValue        = 1E99;
      this.ratioY           = 1;
      this.ratioX           = 1;
      this.x0               = 0;
      this.y0               = 0;
      this.valueY0          = 0;
      this.valueX0          = 0;

    }
    
    setValues( values  )
    {
       console.log(values);

        this.points = values;

      for( var i=0; i < values.length; i++ ) 
      {
        var X = values[i].x;
        if (isNaN(X)) X=i;
        if (X > this.maxXValue) this.maxXValue = X;
        if (X < this.minXValue) this.minXValue = X;
        if (values[i].y > this.maxYValue) this.maxYValue = values[i].y;
        if (values[i].y < this.minYValue) this.minYValue = values[i].y;

        if(this.isDateTimeScale) console.log('setValues: ' + new TDateTime(X).formatDate() + ' -> ' + values[i].y)
      }  
    
    //console.log("maxXValue, maxYValue , minXValue , minYValue " + this.maxXValue + ' / '+ this.maxYValue + ' / ' + this.minXValue + ' / '+this.minYValue );
   
    var deltaX = this.maxXValue-this.minXValue;
    var deltaY = this.maxYValue-this.minYValue;
    //console.log("deltaX, deltaY " + deltaX + '    /    ' + deltaY);

    if(deltaY!=0) this.ratioY = this.drawRect.height / deltaY * 0.9;
    if(deltaX!=0) this.ratioX = this.drawRect.width  / deltaX * 0.9;

    //console.log("ratioX, ratioY " + this.ratioX + '    /    '+this.ratioY);
   
    // Ausgangspunkt ist eine Y-Achse am linken Diagram-Rand
    this.x0 = this.drawRect.left;
    
    // beginnt der X-Bereich im Negativen, "rutscht" die Y-Achse um den negativen Anteil nach rechts
    // so dass diese wieder bei "0" ist
    if(this.minXValue<0) {this.valueX0 = 0;  this.x0   = this.x0 + Math.round(Math.abs(this.ratioX*this.minXValue));}
    
    // beginnt der X-Bereich rechts von "0" im Positiven "bleibt die Y-Achse wo sie ist, stattdessen wird der Daten-Nullpunkt auf den 
    // kleinsten X-Wert gesetzt
    if(this.minXValue>0) this.valueX0  = this.minXValue;

    // gleiche Logik für X-Achse ...
    this.y0 = this.drawRect.bottom;
    if(this.minYValue<0) this.y0        = this.y0 - Math.round(Math.abs(this.ratioY*this.minYValue));
    if(this.minYValue>0) this.valueY0   = this.minYValue;


    } 

    
    realToPix(pt)
    {
      return {x:Math.round((pt.x-this.valueX0)*this.ratioX)+this.x0, y:this.y0-Math.round((pt.y-this.valueY0)*this.ratioY)}
    }

    pixToReal(pt)
    {
      return {x:this.valueX0+((pt.x-this.x0)/this.ratioX), y:this.valueY0+((this.y0-pt.y)/this.ratioY)} 
    }


      
    drawLine( startPoint , endPoint ,  strokeStyle , lineWidth) 
    {
       // console.log('drawLine()  P1: '+JSON.stringify(startPoint) + '    P2:'+JSON.stringify(endPoint) );

        if (strokeStyle != null) this.ctx.strokeStyle = strokeStyle;
        if (lineWidth   != null) this.ctx.lineWidth   = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint.x, startPoint.y);
        this.ctx.lineTo(endPoint.x  , endPoint.y  );
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawGradientCircle( center , radian , color )
    {
      var radgrad = this.ctx.createRadialGradient(center.x, center.y, radian-1 , center.x - radian ,center.y - radian , 0 );
          radgrad.addColorStop(0, color);
          radgrad.addColorStop(0.9, 'White');
  
          this.ctx.beginPath();
          this.ctx.fillStyle = radgrad;
  
          //Render circle
          this.ctx.arc(center.x, center.y, radian, 0, 2 * Math.PI, false)
          this.ctx.fill();
          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = '#000';
          this.ctx.stroke();
          this.ctx.closePath();
    }
  


    
    renderBackground() 
    {
        var lingrad = this.ctx.createLinearGradient(this.drawRect.left, this.drawRect.top, this.drawRect.right, this.drawRect.bottom);
            lingrad.addColorStop(0.0, '#D4D4D4');
            lingrad.addColorStop(0.2, '#fff'   );
            lingrad.addColorStop(0.8, '#fff'   );
            lingrad.addColorStop(1  , '#D4D4D4');
        this.ctx.fillStyle = lingrad;
        this.ctx.fillRect(this.drawRect.left, this.drawRect.top, this.drawRect.width , this.drawRect.height);
        this.ctx.fillStyle = 'black';
    };

    

    renderText() 
    {
        this.ctx.font     = this.labelFont;
        this.ctx.textAlign = "center";
        var textHeight     = this.ctx.measureText('00').width;
        
        // title
        this.ctx.fillText(this.title, (this.drawRect.width/2)+this.drawRect.left , textHeight );

        //X-axis text
        this.ctx.fillText(this.xLabel , (this.drawRect.width/2)+this.drawRect.left , this.chartHeight);

        //Y-axis text
        this.ctx.save();
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.font = this.labelFont;
        var txtSize   = this.ctx.measureText(this.yLabel);
        this.ctx.fillText( this.yLabel, -this.drawRect.height/2-this.drawRect.top-txtSize.width/2 , textHeight/1.7 );
        this.ctx.restore();
    }

    
    renderLinesAndLabels() 
    {
        if (this.points.length==0) return;

        this.ctx.font = this.dataPointFont;
        var txtDist   = this.ctx.measureText('000').width;
        var txt       ='';
      
    var yScaleTicks = calculateScaleTicks(this.minYValue , this.maxYValue , 20 );
    for(var i=0; i<yScaleTicks.length; i++)
    {
        var lfdy = this.realToPix({ x:0 , y:yScaleTicks[i] } ).y;
        this.drawLine( {x:this.drawRect.left , y:lfdy } , { x:this.drawRect.right , y:lfdy } , '#e7e7e7' , 1 );
        txt  = String( yScaleTicks[i] ) ;
        this.ctx.textAlign = "left";
        drawText( this.ctx , txt , 2*txtDist , lfdy , txtDist*2 );
    }

    var xScaleTicks = calculateScaleTicks(this.minXValue , this.maxXValue , 10 );
    for(var i=0; i<xScaleTicks.length; i++)
    {
        var lfdx = this.realToPix({ x:xScaleTicks[i] , y:0} ).x;
        this.drawLine( {x:lfdx , y:this.drawRect.top } , { x:lfdx , y:this.drawRect.bottom } , '#e7e7e7' , 1 );
        if (this.isDateTimeScale) txt = new TDateTime(lfdx).formatDate();
        else                      txt = String( xScaleTicks[i] ) ;
        
        drawText( this.ctx , txt , lfdx+7 , this.drawRect.bottom+(1.6*txtDist) , 2*txtDist , true );
        console.log('')
    }

       //Horizontal Line
       this.drawLine({x:this.drawRect.left, y:this.y0} , {x:this.drawRect.right, y:this.y0}  , 'gray' , 3 );
       //Vertical line 
       this.drawLine({x:this.x0, y:this.drawRect.top} , {x:this.x0, y:this.drawRect.bottom}  , 'gray' , 3 );
      
    }


    renderData() 
    {
        if (this.points.length<2) return;


        for (var i = 1; i < this.points.length; i++)  this.drawLine(this.realToPix( this.points[i-1] ) , this.realToPix(this.points[i]) , 'red', 1 );

        if(this.renderType=='points')
        for (var i = 0; i < this.points.length; i++)  this.drawGradientCircle(this.realToPix( this.points[i] ) , 4 , 'blue' );
    
    

        


            
   /*
          if (this.renderType=='points') 
            {
                var radgrad = this.ctx.createRadialGradient(this.ptX, ptY, 8, ptX - 5, ptY - 5, 0 );
                radgrad.addColorStop(0,   'Green');
                radgrad.addColorStop(0.9, 'White');
                this.ctx.beginPath();
                this.ctx.fillStyle = radgrad;
                //Render circle
                this.ctx.arc(ptX, ptY, 8, 0, 2 * Math.PI, false)
                this.ctx.fill();
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = '#000';
                this.ctx.stroke();
                this.ctx.closePath();
            }

            prevX = ptX;
            prevY = ptY;
        }
    */    
    };


    render() 
    {
       this.renderBackground();
       this.renderText();
       this.renderLinesAndLabels();
       this.renderData();
    };
}
    
