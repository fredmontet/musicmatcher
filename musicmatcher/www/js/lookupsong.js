/*
*   Fichier allant chercher les infos de spotify pour peupler les champs de recherche
*/

$(document).ready(function(){
    
    $("#songname").keyup(catch_artist($("#artist"));  
    
    
});
    
    function catch_artist(artist){
       
      var artist = $(this).artist;
       
      $.ajax("http://ws.spotify.com/search/1/track?q=artist:"+artist,  function (data){
                         
          console.log(data)
            
        }