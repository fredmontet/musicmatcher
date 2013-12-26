/*
* Fichier de gestion des envois de données vers sling
*/

$(document).ready(function(){
    
    //Variable de connexion
    /*
    *   ATTENTION
    *   A changer lors de la "mise en prod"
    */
    var host = "http://localhost:8080"


    /*
     * Fonction qui insere une musique dans le serveur sling
     */
    function createMusic(song_title, song_artist, song_url, latitude, longitude) {
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
            }
            
            
    /*
     * Fonction qui list les musiques pour afficher les marker google maps
     * afin de les afficher sur la carte des musiques.
     */
    function listMusic() {
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
    }
            
});
                  