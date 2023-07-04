
var ws = null;

export function setup(capt1,capt2);
{
   if(!ws) ws = webApp.newWorkSpace("Elisabeth",capt1,capt2);
        ws.select();                         

    addButton( ws , null , 20 , 4 , "zurück" )
       .callBack_onClick = function(){webApp.selectWorkSpace("main")};
 
   for(var i=0; i<21; i++)
   {
     addCombobox( ws , 21 , "Sparte Nr."+i    , null  , null     , ["Erdgas","Strom","Wärme","Daten"]);
     addInput   ( ws , 21 , "Jahresverbrauch" , "kWh" , "20.000" );
   }  
   
}

export function anyFunction_1()
{

}


export function anyFunction_2()
{

}


export function anyFunction_3()
{

}



