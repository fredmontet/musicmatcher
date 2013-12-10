/*
* Fichier de gestion des envois de données vers sling
*/

$(document).ready(function(){
    
    var localhost = "KNUCHH-PC:8080"

    function createMusic() {
                $.ajax(localhost+"/content/musicmatcher/music/*", {
                    type: "POST",
                    data: {
                        "created": null,
                        "song_title": "Get lucky",
                        "song_artist": "Daft punk",
                        "song_url": "http://www.youtube.com/watch?v=5NV6Rdv1a3I",
                        "latitude": "47.015514",
                        "longitude": "6.907135",
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
                    },
                    complete: function(xhr) {
                        listContent();
                    }
                });
            }
            
            function listMusic() {
                $.ajax(localhost+"/content/musicmatcher/music.1.json", {
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
            
            listContent();
});
                  