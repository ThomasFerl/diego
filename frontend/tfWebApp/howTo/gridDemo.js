


 function onCellClick( target )
        {
          alert( JSON.stringify(target));
        }
        
        function onClick_BtnTableDemo()
        {
          console.log("onClick_BtnTableDemo");  
          var st='[{"day":"17","month":"02","year":"2022","hour":"21","minute":"31","value":6019.39558573854,"cnt":589},{"day":"01","month":"03","year":"2022","hour":"00","minute":"02","value":7589.951547779273,"cnt":743},{"day":"01","month":"04","year":"2022","hour":"00","minute":"01","value":11072.678272980502,"cnt":718},{"day":"01","month":"05","year":"2022","hour":"00","minute":"02","value":20137.905564924116,"cnt":593},{"day":"01","month":"06","year":"2022","hour":"02","minute":"00","value":22773.3,"cnt":10},{"day":"01","month":"07","year":"2022","hour":"09","minute":"00","value":21482.090909090908,"cnt":11},{"day":"05","month":"08","year":"2022","hour":"05","minute":"00","value":21341.14285714286,"cnt":7},{"day":"07","month":"09","year":"2022","hour":"04","minute":"00","value":14339.42857142857,"cnt":7},{"day":"02","month":"10","year":"2022","hour":"13","minute":"00","value":16770.666666666668,"cnt":9}]';
          var json=JSON.parse(st);

          demoTable = new THTMLTable( json );
          demoTable.width                        = "100%";

          demoTable.fieldDefs[0].caption         = "Tag";
          demoTable.fieldDefs[0].fieldTextAlign  = "center";

          demoTable.fieldDefs[1].caption         = "Monat";
          demoTable.fieldDefs[1].fieldTextAlign  = "center";

          demoTable.fieldDefs[2].caption         = "Jahr";
          demoTable.fieldDefs[2].fieldTextAlign  = "center";

          demoTable.fieldDefs[3].caption         = "Stunde";
          demoTable.fieldDefs[3].fieldTextAlign  = "center";

          demoTable.fieldDefs[4].caption         = "Minute";
          demoTable.fieldDefs[4].fieldTextAlign  = "center";

          demoTable.fieldDefs[5].caption         = "Messwert";
          demoTable.fieldDefs[5].fieldTextAlign  = "right";
          
          demoTable.fieldDefs[6].caption         = "Anzahl";
          demoTable.fieldDefs[6].fieldTextAlign  = "center";

          demoTable.onCellClick = onCellClick;
          demoTable.build( document.getElementById("divTable") );
        }  

        function onClick_BtnChangeColor()
        {
          demoTable.fieldDefs.forEach(function( aField){  aField.captionBackgroundColor = rndColor() } );
          demoTable.fieldDefs.forEach(function( aField){  aField.fieldBackgroundColor   = rndColor() } );
          demoTable.update();

        }

        function onClick_ToggleVisible()
        {
          clickCounter++;
          (clickCounter % 2) == 0 ? d3.select("#divTable").style("display","block") : d3.select("#divTable").style("display","none"); 
        }



---------------------------------------------------------------------------------------------------------------------




<button class="btn" type="button" onClick="onClick_BtnTableDemo()">Tabelle Demo</button>
<button class="btn" type="button" onClick="onClick_BtnChangeColor()">Zufalls-Farbe</button>
<button class="btn" type="button" onClick="onClick_ToggleVisible()">show/hide</button>


<div id="divTable" style="
            margin-top       : 10px;
            padding          : 0px;
            border           : 4px black;
            border-radius    : 7px;
            height           : 400px;
            width            : 800px; 
            color            : black;
            background-color : white;
            box-shadow       : 4px 4px 7px silver;
            overflow         : hidden;
           ">
            <div id="captionTable" style="
                      margin-top       : 0px;
                      padding          : 0px;
                      border-radius    : 7px 7px 0px 0px;
                      height           : 4em;
                      width            : 800px; 
                      color            : white;
                      background-color : blue;
                      background-image : linear-gradient(to right,rgb(15, 15, 54) , rgb(221, 213, 248));
                      overflow         : hidden;">
                      <b><P style="margin-top: 4px; margin-left: 7px; padding: 0px; font-size:1.25em">Caption</P></b>
                      <P style="color:lightgray; margin-top: 0px; margin-left: 7px; padding: 0px; font-size:0.77em">das ist eine nähere Beschreibung der Daten</P>
            </div>          

</div>  




