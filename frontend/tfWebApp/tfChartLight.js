import {TDateTime} from "./utils.js";

export class tfChart
{
    constructor( canvas , width , height )     
    { 
      this.title            =  '******* Title *******';
      this.xLabel           =  'X-Achse';
      this.yLabel           =  'Y-Achse';
      this.labelFont        = '1em Arial'; 
      this.dataPointFont    = '.7em Arial';
      this.isDateTimeScale  = false;

      if(canvas.constructor.name=='HTMLCanvasElement')  this.canvas  = canvas;
      else                                              this.canvas  = document.getElementById(canvas);

      this.canvas.height    = height;
      this.canvas.width     = width; 

      this.chartHeight      = this.canvas.height;
      this.chartWidth       = this.canvas.width;
      this.maxNumYscale     = 10;
      this.maxNumXscale     = 20;
      
      this.ctx              = canvas.getContext("2d");
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

      this.init();
    }

    init()
    { 
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
      this.init();

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



    calculateScaleTicks(min, max, tickCount) 
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
        for (var i=tstart; i < tstop; i += step) scaleTicks.push(Math.round(i*roundFak)/roundFak);  
        
        return scaleTicks;
    }
    
    
    drawText( ctx ,  txt ,  x , y , txtDist , _90Grad )
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

      
    drawLine( startPoint , endPoint ,  strokeStyle , lineWidth) 
    {
       console.log('drawLine()  P1: '+JSON.stringify(startPoint) + '    P2:'+JSON.stringify(endPoint) );

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
      if(center.x==undefined) return -1;
      if(center.x==NaN)       return -1;
      if(center.x==Infinity)  return -1;
      if(center.y==undefined) return -1;
      if(center.y==NaN)       return -1;
      if(center.y==Infinity)  return -1;

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
      console.log('drawRect:' + JSON.stringify(this.drawRect));

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
      
    var yScaleTicks = this.calculateScaleTicks(this.minYValue , this.maxYValue , this.maxNumXscale );
    for(var i=0; i<yScaleTicks.length; i++)
    {
        var lfdy = this.realToPix({ x:0 , y:yScaleTicks[i] } ).y;
        this.drawLine( {x:this.drawRect.left , y:lfdy } , { x:this.drawRect.right , y:lfdy } , '#e7e7e7' , 1 );
        txt  = String( yScaleTicks[i] ) ;
        this.ctx.textAlign = "left";
        this.drawText( this.ctx , txt , 2*txtDist , lfdy , txtDist*2 );
    }

    var xScaleTicks = this.calculateScaleTicks(this.minXValue , this.maxXValue , this.maxNumYscale );
    for(var i=0; i<xScaleTicks.length; i++)
    {
        var lfdx = this.realToPix({ x:xScaleTicks[i] , y:0} ).x;
        this.drawLine( {x:lfdx , y:this.drawRect.top } , { x:lfdx , y:this.drawRect.bottom } , '#e7e7e7' , 1 );
        if (this.isDateTimeScale) txt = new TDateTime(xScaleTicks[i]).formatDate();
        else                      txt = String( xScaleTicks[i] ) ;
        
        this.drawText( this.ctx , txt , lfdx+7 , this.drawRect.bottom+(1.6*txtDist) , 2*txtDist , true );
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
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
       this.renderBackground();
       this.renderText();
       this.renderLinesAndLabels();
       this.renderData();
    };
}
    
