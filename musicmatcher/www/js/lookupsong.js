/*
 *   Fichier allant chercher les infos de spotify pour peupler les champs de recherche
 */

// Quand le DOM est charg�
$(document).ready(function(){

    // Quand on appuie sur une touche du champ artiste
    $("#artist").on("keyup", function(){
        
        var artistName = $("#artist").val();   
        
        $.getJSON("http://ws.spotify.com/search/1/track?q=artist:"+artistName+'&callback=?', {
            }, function(reponseAJAX){
                if(reponseAJAX.num_results > 0){
                    // Cr�er une nouvelle liste
                    $("#selectSong").html('<select id="songs"></select>');
                    // pour chaque sons pr�sents
                    $.each(reponseAJAX.tracks, function(value) {
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
            }); // getJSON
    }); // #search on key up
   
});


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

