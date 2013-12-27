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
                // crée une option
                var $addOption = $("<option>");
                // Met le texte de l'option
                $addOption.html(track.name);
                // ajoute le nom de l'artiste et le nom du sons à l'option
                $addOption.data("artisteName", data.name);
                $addOption.data("trackName", data.name);
                // ajoute l'option à la liste des sons
                $("#songs").append($addOption);
                    
                //test console
                console.log(track.name);
                    
                //ajoute les options avec un titre
                addOption(track.name);                   
            })//each
            // Par défaut on charge les articles le premier élément de la liste #songs
            var $premiereOption = $("#songs").find("option").first();
            youtubeSearch( $premiereOption.data("artisteName") , $premiereOption.data("trackName") );
            // evenement sur changement de la liste des sons
            $("#songs").on("change", function(event) {
                youtubeSearch( $("#songs option:selected").data('artisteName'), $("#songs option:selected").data('trackName') );
            });//getJSON 
            console.log(artisteName)
            console.log("fin catch_artist");  
        });
} //catch_artist
    
    
function youtubeSearch(artisteName, trackName){
    console.log("debut youtbeSearch");
    
    $.getJSON("https://gdata.youtube.com/feeds/api/videos?q="+artisteName+"+"+trackName+"&max-results=1&v=2", {
        }, function(data){    
     
        });
}        

    /*
     * Fonction qui peuple la drop down list des titres de musique
     */
    //function addOption(track_name){
    // var option = $("<option/>");
    // option.text(track_name);
    //  $("#songs").append(option);
    //}
