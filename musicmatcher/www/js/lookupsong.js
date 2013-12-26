/*
*   Fichier allant chercher les infos de spotify pour peupler les champs de recherche
*/

$(document).ready(function(){
    
    $("#artist").keyup(catch_artist($("#artist")));  
    
    
});
    
    function catch_artist(artist){
        console.log("début catch_artist");
       
      var artist = $(this).artist.text();
       
      $.ajax("http://ws.spotify.com/search/1/track?q=artist:"+artist,  function (data){
                         
          console.log(data);
            
        });
        
      console.log("fin catch_artist");
    }