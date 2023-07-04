import * as utils        from "./utils.js";
import * as globals      from "./globals.js";



export function basedOn_httpRequest( aParent , url , _onRowClick)
{
    var t       = null;
    var request = utils.httpRequest( url );
    if(request=="ERROR")
    {
      utils.log('Fehler bei  utils.httpRequest( '+url+' )');
      utils.log(request);
      aParent.DOMelement.innerHTML = request;
    }
    else
        { utils.log("OK => " + request);
          t  = new THTMLTable( JSON.parse( request ) );
          if(_onRowClick) t.onRowClick = _onRowClick;
          t.build( aParent.DOMelement );
        }      
     
   return t;
}



export class TFieldDef
{
 constructor( aField , aCaption , testValue)
 {
    this.columnWidth             = -1;
    this.columnHeight            = -1;
    this.field                   = aField;
    this.fieldType               = "";
    this.fieldFormat             = "";

    // Vorbelegung des Feld-Types
    if(!isNaN(testValue)) 
    {
      var num=Number(testValue);
      var int=parseInt(testValue);
      this.fieldType="float";
      this.fieldFormat="2";
      if(num==int) {this.fieldType="int";this.fieldFormat="";}
    }
    else
        {
          if( (testValue.toUpperCase()=="TRUE")||(testValue.toUpperCase()=="FALSE")||(testValue.toUpperCase()=="ON")||(testValue.toUpperCase()=="OFF")   ) {this.fieldType="bool"}
          if( (testValue.length>=10) && (testValue[2]=='.') && (testValue[5]=='.') )  this.fieldType = "date";
    }

    this.fieldBorderStyle        = "0.7px gray solid";
    this.fieldPadding            = "4px";
   
    this.fieldBackgroundColor    = "white"
    this.fieldFontSize           = "1em";
    this.fieldFontColor          = "black";
    this.fieldFontWeight         = "normal";
    this.fieldTextAlign          = "center";  // left , right , center
    
    this.caption                 = aCaption;
    this.captionBorderStyle      = "0.7px black solid";
    this.captionPadding          = "2px";
    this.captionBackgroundColor  = "gray";
    this.captionFontSize         = "1.1em"
    this.captionFontColor        = "white";
    this.captionFontWeight       = "bold";
    this.captionTextAlign        = "center";   // left , right  
  }

  calcBackgroundColor(selected)
  {
    //console.log('calcBackgroundColor('+selected+')');

    var result = this.fieldBackgroundColor;
    
    if(selected) var result = "blue";

    //console.log('---> ' + result);
    
    return result;
  }
}    



export class THTMLTable
{
 constructor( aJsonData )
 {
   this.width          = "100%"; 
   this.margin         = "7px";
   this.jasonData      = aJsonData;
   this.fieldDefs     = [];
   this.onCellClick   = undefined;
   this.onRowClick    = undefined;
   this.onEditCell    = undefined;
   this.itemIndex     = -1;

   this._onCellClick  = function( td ) 
   { 
     // row:rowNo , col:ndx , fieldDef:data , field:aDataRow 
     this.itemIndex   = td.__data__.row;
     this.update();

     if(this.onCellClick) this.onCellClick( td.__data__ );
     if(this.onRowClick ) this.onRowClick ( td.__data__ );
     if(this.onEditCell ) this.onEditCell ( td.__data__.fieldDef , td.__data__.field );
   }.bind(this);

  // Default Definition der Felder erzeugen. Kann nach Init und vor build angerpasst werden !
  for(var key in this.jasonData[0]) this.fieldDefs.push( new TFieldDef( key , key , this.jasonData[0][key]));

  }

  formatContent( content , format )
  {
    return content;
    /*
    if (format.fieldType              ==''     ) return content;
    if (format.fieldType.toUpperCase()=='FLOAT') return utils.formatFloat  ( content , format.fieldFormat );
    if (format.fieldType.toUpperCase()=='INT'  ) return utils.formatInteger( content );
    if (format.fieldType.toUpperCase()=='BOOL' ) return utils.formatBoolean( content );
   */ 
  }

  build( aParent )
  { 
    // beim Durchlauf einer d3-Selektion befindet sich in "this" der ans DOM-Element gebundene Datensatz ( __data__ ) // Um in dieser Phase Zugriff auf Elente des eigenen Objektes zu haben, wird das "Original-this" in "self" dubliziert
    var self           = this;
    var parentNode     = document.body;
        
    if(aParent) parentNode = aParent; 

    var calcHeight     = 1.5*globals.em2px*this.jasonData.length;
    if (calcHeight < parentNode.clientHeight) calcHeight = calcHeight+'px'
    else                                      calcHeight = '100%';

    parentNode.innerHTML = '';

    this.table = d3.select(parentNode).append("table")
                                      .style ("width"          , function() { return self.width} )
                                      .style ("height"         , calcHeight )
                                      .style ("margin"         , function( data , ndx ) { return self.margin; })
                                      .style ("border-collapse", "collapse"  );
    // head
    this.table.append("thead").append("tr")
              .selectAll("th")
              .data(this.fieldDefs) // Array von TfieldDef
              .enter().append("th")
                      .html(                     function( data , ndx ) { return data.caption;                })
                      .style("height"          , '2em'                                                        )
                      .style("border"          , function( data , ndx ) { return data.captionBorderStyle;     })
                      .style("padding"         , function( data , ndx ) { return data.captionPadding;         })
                      .style("background-color", function( data , ndx ) { return data.captionBackgroundColor; })
                      .style("font-weight"     , function( data , ndx ) { return data.captionFontWeight;      })
                      .style("color"           , function( data , ndx ) { return data.captionFontColor;       })
                      .style("font-size"       , function( data , ndx ) { return data.captionFontSize;        })
                      .style("text-align"      , function( data , ndx ) { return data.captionTextAlign;       });
                    
   
    // data
    this.tableBody = this.table.append("tbody")
    
    // Tabelle zeilenweise durchlaufen.....
    for(var rowNo=0; rowNo < this.jasonData.length ; rowNo++)
    {
     var aDataRow  = this.jasonData[rowNo];

     var tr = this.tableBody.append("tr")
                  .datum(rowNo)
                  .style("height" , '1.5em' )
                  .on("mouseover", function(mouseEvent) 
                                   { 
                                     d3.select(this).selectAll("td")
                                       .style("background-color","black")
                                       .style("color","white");
                                   })  
                  .on("mouseout" , function(mouseEvent) 
                                   { 
                                     d3.select(this).selectAll("td")
                                       .style("background-color" , function( data , ndx ) { return data.fieldDef.calcBackgroundColor(rowNo==self.ItemIndex);})
                                       .style("color"            , function( data , ndx ) { return data.fieldDef.fieldFontColor;});
                                   }); 
             
                   tr.selectAll("td")
                     .data(this.fieldDefs)

                   // Datenzellen der akt. Zeile durchlaufen
                     .enter().append("td")
                     .html(                     function(  data , ndx ) { return self.formatContent(aDataRow[data.field] , data ); })
                     .style("border"          , function(  data , ndx ) { return data.fieldBorderStyle; })
                     .style("padding"         , function(  data , ndx ) { return data.fieldPadding;   })
                     .style("background-color", function(  data , ndx ) 
                                                { 
                                                  var color=d3.color(data.calcBackgroundColor(rowNo==self.ItemIndex));
                                                  return (rowNo % 2) != 0 ? color: color.darker(0.2); 
                                                })
                     .style("font-weight"     , function(  data , ndx )   { return data.fieldFontWeight; })
                     .style("color"           , function(  data , ndx )   { return data.fieldFontColor;  })
                     .style("font-size"       , function(  data , ndx )   { return data.fieldFontSize;   })
                     .style("text-align"      , function(  data , ndx )   { return data.fieldTextAlign;  })

                     .datum(                    function( data , ndx  )   { return { row:rowNo , col:ndx , fieldDef:data , field:aDataRow , value:aDataRow[data.field]}; })  // data-Binding hart überschreiben ....
                     .on   ("click"           , function( mouseEvent  )   
                                                { self._onCellClick( mouseEvent.target);} );
                   
   };
 }; // build ....  
  


  update()
  {
     var self=this;
     this.tableBody.selectAll("th")
    .html(                     function( data , ndx ) { return data.caption;                      })
    .style("border"          , function( data , ndx ) { return data.captiondBorderStyle;          })
    .style("padding"         , function( data , ndx ) { return data.captionPadding;               })
    .style("background-color", function( data , ndx ) { return data.captionBackgroundColor;       })
    .style("font-weight"     , function( data , ndx ) { return data.captionFontWeight; })
    .style("color"           , function( data , ndx ) { return data.captionFontColor;  })
    .style("font-size"       , function( data , ndx ) { return data.captionFontSize;   })
    .style("text-align"      , function( data , ndx ) { return data.captionTextAlign;  }) ;

    this.tableBody.selectAll("td")  //.attr("dummy" , function(d) {utils.log(JSON.stringify(d));});

            .html(                     function( data , ndx ) { return self.formatContent( data.value );  })
            .style("border"          , function( data , ndx ) { return data.fieldDef.fieldBorderStyle; })
            .style("padding"         , function( data , ndx ) { return data.fieldDef.fieldPadding; })
            .style("background-color", function( data , ndx ) 
                                       { 
                                         var color=d3.color(data.fieldDef.calcBackgroundColor(data.row==self.ItemIndex));
                                         return (data.row % 2) != 0 ? color: color.darker(0.2); 
                                       })
            .style("font-weight"     , function( data , ndx ) { return data.fieldDef.fieldFontWeight; })
            .style("color"           , function( data , ndx ) { return data.fieldDef.fieldFontColor; })
            .style("font-size"       , function( data , ndx ) { return data.fieldDef.fieldFontSize; })
            .style("text-align"      , function( data , ndx ) { return data.fieldDef.fieldTextAlign;});
   
  }


  fieldByName( fieldName )
  {
    for(var i=0; i<this.fieldDefs.length; i++) 
    {
      if(this.fieldDefs[i].field.toUpperCase()==fieldName.toUpperCase()) return this.fieldDefs[i];
    }
    return null;
  }
  
}  // end Class









