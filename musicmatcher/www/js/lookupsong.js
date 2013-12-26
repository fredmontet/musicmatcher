/*
 *   Fichier allant chercher les infos de spotify pour peupler les champs de recherche
 */

// Quand le DOM est charg�

/*$(document).ready(function(){
    
    // Quand on appuie sur une touche du champ artiste
    $("#songname").on("click",catch_artist($("#artist")));  
    
    
});
*/

function catch_artist(){
    console.log("debut catch_artist");

    var artistName = $("#artist").val();   
        
        $.getJSON("http://ws.spotify.com/search/1/track.json?q=artist:"+artistName, {
            }, function(data){       
                    // Creer une nouvelle liste
                    $("#selectSong").html('<select id="songs"></select>');
                    
                    //Pour chaque track
               $.each(data.tracks, function(i, track){
                    
                    //test console
                    console.log(track.name);
                    
                    //ajoute les options avec un titre
                    addOption(track.name);   
                    
                })//each
                
                });//getJSON 
                
                /* RiZe
                if(data.num_results > 0){
                    // Creer une nouvelle liste
                    $("#selectSong").html('<select id="songs"></select>');
                    // pour chaque sons presents$.each(data.t
                    $.each(data.tracks, function(value) {
                        // cr�e une option
                        var $currentOption = $("<option>");
					
                        // Met le texte de l'option
                        $currentOption.html(value.name);
                        
                        // ajoute l'option � la liste des sons
                        $("#artistes").append($currentOption);

					
                    }); // Each
    
                }// if
                else {
                    // supprime la liste
                    $("#selectArtist").html('');
                }// else
                RiZe*/
                
            console.log("fin catch_artist");   
} //catch_artist
            
            


function addOption(track_name){
    var option = $("<option/>");
    option.text(track_name);
    $("#songs").append(option);
}


    /**
$(document).ready(function(){
    
    $("#songname").keyup(catch_artist($("#artist")));  
    
    
});
    
    function catch_artist(artist){
        console.log("début catch_artist");
       
      var artist = $(this).artist.text();
       
      $.ajax("http://ws.spotify.com/search/1/track?q=artist:"+artist,  function (data){
                         
          console.log(data);
            
        });
        
      console.log("fin catch_artist");
    }
        
      console.log("start Artist!")
      //var artist = $(this).artist;
      var artist = $('#artist');
     $.getJSON("http://ws.spotify.com/search/1/track?q=artist:"+artist, 
     
      function (data){   
          alert(data)
          console.log(artist)
          console.log(data)
          console.log("end Artist!")
      })
  }
     */

