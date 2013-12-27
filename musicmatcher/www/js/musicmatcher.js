/*
*
*/

$(document).ready(function(){
    
    //Variable de connexion
    /*
    *   ATTENTION
    *   A changer lors de la "mise en prod"
    */
    var host = "http://localhost:8080";
    
});//Document ready


/*
 * Fonction qui insere une musique dans le serveur sling
 */
function send_song(song_title, song_artist, song_url, latitude, longitude){
        
    $.ajax(host+"/content/musicmatcher/music/*", {
        type: "POST",
        data: {
            "created": null,
            "song_title": song_title,
            "song_artist": song_artist,
            "song_url": song_url,
            "latitude": latitude,
            "longitude": longitude,
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
        },
        complete: function(xhr) {
            console.log("musique enregistrée dans sling motherducker    ")
        }
    });
        
}//send_song
            
            
/*
 * Liste les musiques pour afficher les marker google maps
 * afin de les afficher sur la carte des musiques.
 */
function list_music() {
        
    $.ajax(host+"/content/musicmatcher/music.1.json", {
        type: "GET",
        complete: function(xhr) {
            var list = $("#list");
            var json = xhr.responseJSON;

            console.log(json);

            $("#list").empty();
            for (var key in json) {
                if (json[key] instanceof Object) {


                    list.append("<div><b>" + key + "</b> : " + json[key].created + " -> " + json[key].localisation + "</div>"); 


                }
            }
        }
    });
        
}//list_music
    

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
                // cr�e une option
                var $addOption = $("<option>");
                // Met le texte de l'option
                $addOption.html(track.name);
 
                // ajoute l'option � la liste des sons
                $("#songs").append($addOption);
                
                var $artist_name = track.artists[0].name
                localStorage.setItem('artist_name',$artist_name)

            //test console

                    
                    
                    

            })//each
            console.log("fin catch_artist");  
        });
            
} //catch_artist
function save_name(){
    
    var x=document.getElementById("songs").selectedIndex;
    var y=document.getElementById("songs").options;
    var $track_name = y[x].text;
    localStorage.setItem('track_name',$track_name)
    
}

/*
*   Fonction qui prend un nom d'artiste et une de ses musiques et retourne le premier resultat youtube
*   
*/
function youtube_search(song_artist, song_title){
    console.log("debut youtbe_search");
        
    //test en dur
    var song_artist = "eminem";
        
    var song_artist = encodeURIComponent(song_artist);
        
    var song_title = "lose yourself";
    var song_title = encodeURIComponent(song_title);
        
    $.get("https://gdata.youtube.com/feeds/api/videos?q="+song_artist+"+"+song_title+"&max-results=1&v=2&alt=jsonc", {}, 
              
        function(data){ 
            var video_id = data.data.items[0].id;
            localStorage.setItem('song_url', video_id);
            console.log("id_video: "+localStorage.getItem('song_url'));
                
        });
        
    console.log("fin youtube_search");
}//youtubeSearch        


/*
 * Fonction qui peuple la drop down list des titres de musique
 */
/// function addOption(track_name){
//  var option = $("<option/>");
//option.text(track_name);
// $("#songs").append(option);
// }


/*
*   Fonction qui va chercher l'emplacement geogrpahique de l'utilisateur
*/
function get_location() {
        
    navigator.geolocation.getCurrentPosition(on_success, on_error);
        
}//getLocation


/*
*  onSuccess Geolocation
*/ 
function on_success(position) {
        
    localStorage.setItem('latitude', position.coords.latitude);
    localStorage.setItem('longitude', position.coords.longitude);
        
}//on_success
    

/*
     *  on_error Callback receives a PositionError object
     */
function on_error(error) {
        
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
        
}//on_error

