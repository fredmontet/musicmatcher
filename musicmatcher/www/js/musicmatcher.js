/*
* Gestion des envois de données vers sling
*/

$(document).ready(function(){
    
    //Variable de connexion
    /*
    *   ATTENTION
    *   A changer lors de la "mise en prod"
    */
    var host = "http://localhost:8080"
    
    
    
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
                    // ajoute le nom de l'artiste et le nom du sons � l'option
                    $addOption.data("artisteName", data.artist);
                    $addOption.data("trackName", data.name);
                    // ajoute l'option � la liste des sons
                    $("#songs").append($addOption);
                        
                    //test console
              
                         
                })//each
                // Par d�faut on charge les articles le premier �l�ment de la liste #songs
                var $premiereOption = $("#songs").find("option").first();
                youtube_search( $premiereOption.data("artisteName") , $premiereOption.data("trackName") );
                // evenement sur changement de la liste des sons
                $("#songs").on("change", function(event) {
                    youtube_search( $("#songs option:selected").data('artisteName'), $("#songs option:selected").data('trackName') );
                });//getJSON 
    
                console.log("fin catch_artist");  
            });
            
    } //catch_artist
    
    
    /*
    *   Fonction qui prend un nom d'artiste et une de ses musiques et retourne le premier resultat youtube
    */
    function youtube_search(artisteName, trackName){
        console.log("debut youtbeSearch");
        $.get("https://gdata.youtube.com/feeds/api/videos?q="+artisteName+"+"+trackName+"&max-results=1&v=2", {
            }, function(data){  
            });
        
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
     function getLocation() {
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }

     // onSuccess Geolocation
     //
    function onSuccess(position) {
         alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n');
        
        var element = document.getElementById('geolocation');
        element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />';
        
        $("#radar").append(element);
    }

     // onError Callback receives a PositionError object
     //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

