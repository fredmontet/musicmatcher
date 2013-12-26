/*
 *   Fichier allant chercher les infos de spotify pour peupler les champs de recherche
 */

/*
*   Fonction qui va chercher les titres des musiques en fonction d'un artiste
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
                
            console.log("fin catch_artist");   
} //catch_artist
            

/*
* Fonction qui peuple la drop down list des titres de musique
*/
function addOption(track_name){
    var option = $("<option/>");
    option.text(track_name);
    $("#songs").append(option);
}
