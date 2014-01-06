/********************************************************************/
/*                                                                  */
/*                           Musicmatcher                           */
/*                                                                  */
/*  Une application faite dans le cadre du cours de gestion de      */
/*  contenu pour taguer les musiques en fonction dun emplacement    */
/*  géographique.                                                   */
/*                                                                  */
/*   Louis Alleman, Flavien Knuchel, Frederic Montet                */
/*                                                                  */
/********************************************************************/

//Pour que jQuery et jQuery mobile cohabite sereinement
$.noConflict();


function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
    console.log("onLoad");
    localStorage.clear();
}

function onDeviceReady() {
// Now safe to use device APIs
    console.log("DEVICE REAAADYYYYYYYYYYYYYYYYYYYY");
}

$(document).bind("mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
    $.mobile.allowCrossDomainPages = true;
});

$(document).on("pageinit", "#radar", function() {
    console.log("pageInit radar");
    $.when(get_location()).then(radar());
});

$(document).on("pageinit", "#tag_song", function() {
    catch_artist();
});

$(document).on("pageinit", "#menu", function() {
    localStorage.clear();
});

/*
 * Fonction lancée lors de l'appui sur le bouton #match
 */
function match() {
    console.log("match");

    console.log(
            "song_title : " + localStorage.getItem('song_title') + '\n' +
            "song_artist : " + localStorage.getItem('song_artist') + '\n' +
            "song_url : " + localStorage.getItem('song_url') + '\n' +
            "latitude: " + localStorage.getItem('latitude') + '\n' +
            "longitude: " + localStorage.getItem('longitude')
            );

    $.when(get_location() == true, youtube_search()).then(send_data());

    console.log("fin match");
}//match

/*
 * Fonction qui insere une musique dans le serveur sling
 */
function send_data() {

    //Variable de connexion à Sling

    /*
     *   ATTENTION
     *   A changer lors de la "mise en prod"
     */
    //var host = "http://localhost:8080/content/musicmatcher/music/";
    //url: "./crossdomain.php",

    /*    
     $.ajax({
     type: "POST",
     url: "http://localhost:8080/content/musicmatcher/music/*",
     dataType:"json",
     username:"admin",
     password:"admin",
     crossDomain:"true",
     xhrFields: {withCredentials: true},
     data: {
     
     /*
     "created": null,
     "song_title": localStorage.getItem('song_title'),
     "song_artist": localStorage.getItem('song_artist'),
     "song_url": localStorage.getItem('song_url'),
     "latitude": localStorage.getItem('latitude'),
     "longitude": localStorage.getItem('longitude'),
     
     
     "created": null,
     "title": "music",
     "description": "un noeud musique",
     "song_title": "loudpipes",
     "song_artist": "ratatat",
     "song_url": "bmXumtgwtak",
     "latitude": "46.4604679",
     "longitude": "6.8377579"
     },
     beforeSend: function(xhr) {
     console.log("Authorization");
     xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
     },
     done: function(xhr) {
     //responseData, textStatus, jqXHR
     console.log("Musique enregistree");
     
     },
     fail: function (xhr) {
     //responseData, textStatus, errorThrown
     alert('POST failed.');
     },
     complete: function(xhr) {
     console.log("Fonction completee");
     }
     });
     */


    $.ajax({
        type: 'POST',
        url: "http://localhost:8080/content/musicmatcher/music/*?q=?",
        crossDomain: 'true',
        data: {
            "created": null,
            "title": "music",
            "description": "un noeud musique",
            "song_title": localStorage.getItem('song_title'),
            "song_artist": localStorage.getItem('song_artist'),
            "song_url": localStorage.getItem('song_url'),
            "latitude": localStorage.getItem('latitude'),
            "longitude": localStorage.getItem('longitude'),
        },
        dataType: 'json',
        beforeSend: function(xhr)
        {
            console.log("Authorization");
            xhr.setRequestHeader("Authorization", "Basic " + btoa("admin:admin"));
        }
    });

}//send_song


/*
 * Liste les musiques pour afficher les marker google maps
 * afin de les afficher sur la carte des musiques.
 */
function list_music() {

    $.ajax(host + "/content/musicmatcher/music.1.json", {
        type: "GET",
        complete: function(xhr) {
            console.log(xhr);
            var list = $("#list");
            var json = xhr.responseJSON;

            console.log(json);

            $("#list").empty();
            for (var key in json) {
                if (json[key] instanceof Object) {

                    list.append("<div><b>" + json[key].song_artist + "</b> : " + json[key].song_title + " -> " + json[key].song_url + "</div>");

                }
            }
        }
    });

}//list_music



/*
 *   Fonction qui va chercher les titres des musiques en fonction d'un artiste
 */
function catch_artist() {  
    console.log("debut catch_artist");

    $("#artist_autocomplete").on("listviewbeforefilter", function(e, data) {

        var $ul = $(this),
                $input = $(data.input),
                artistName = $input.val(),
                html = "";
        $ul.html("");

        console.log("artistName = " + artistName);

        if (artistName) {

            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
            $ul.listview("refresh");

            $.ajax({
                url: "http://ws.spotify.com/search/1/artist.json?q=artist:" + artistName,
            })
                    .then(function(data) {
                console.log(data);

                $.each(data.artists, function(i, artist) {
                    html += "<li><a href=\"#\">"+artist.name+"</a></li>";
                });
                $ul.html(html);
                $ul.listview("refresh");
                $ul.trigger("updatelayout");

                

            });
        }

    });

    $("#artist_autocomplete").on("click", "li", function() {
        var artist_name = $(this).text();
        localStorage.setItem('artist_name', artist_name);
        console.log("artist_name local storage = " + localStorage.getItem('artist_name'));
        var text = localStorage.getItem('artist_name');
        $(this).closest('[data-role=listview]').prev('form').find('input').val(text);
        $(this).closest('[data-role=listview]').children().addClass('ui-screen-hidden');
        catch_tracks();
    });

    console.log("fin catch_artist");
}//catch_artist


function catch_tracks() {
    console.log("catch_tracks");

    var $ul = $("#tracks_autocomplete"),
            artist_name = localStorage.getItem('artist_name'),
            html = "";
    $ul.html("");

    $.ajax({
        url: "http://ws.spotify.com/search/1/track.json?q=artist:" + artist_name,
    })
            .then(function(data) {

        console.log(data);

        $.each(data.tracks, function(i, track) {
            firstletter = track.name[0];
            html += "<li firstletter=" + firstletter + "><a href=\"#\">" + track.name + "</a></li>";

            /*function listview_sorter() {
                // read all list items (without list-dividers) into an array
                lis = $ul.children("li").not('.ui-li-divider').get();

                // sort the list items in the array
                lis.sort(function(a, b) {
                    var valA = $(a).text(),
                            valB = $(b).text();
                    if (valA < valB) {
                        return -1;
                    }
                    if (valA > valB) {
                        return 1;
                    }
                    return 0;
                });

                // clear the listview before rebuild
                list.empty();

                // adding the ordered items to the listview
                $.each(lis, function(i, li) {
                    list.append(li);
                });

                list.listview('refresh');
            }*/
        });
        $ul.html(html);
        $ul.listview().listview('refresh');
        $ul.trigger("updatelayout");

    });

    $("#tracks_autocomplete").on("click", "li", function() {
        var track_name = $(this).text();
        localStorage.setItem('track_name', track_name);
        console.log("track_name local storage = " + localStorage.getItem('track_name'));
        var text = $(this).find('.ui-link-inherit').text();
        $(this).closest('[data-role=listview]').prev('form').find('input').val(text);
        $(this).closest('[data-role=listview]').children().addClass('ui-screen-hidden');
    });

    console.log("fin catch_tracks");
}//catch_tracks

/*
 *   Fonction qui prend un nom d'artiste et une de ses
 *    musiques et retourne le premier resultat youtube   
 */
function youtube_search() {
    console.log("debut youtbe_search");

    var song_artist = localStorage.getItem('artist_name');
    song_artist = encodeURIComponent(song_artist);

    var song_title = localStorage.getItem('track_name');
    song_title = encodeURIComponent(song_title);

    $.get("https://gdata.youtube.com/feeds/api/videos?q=" + song_artist + "+" + song_title + "&max-results=1&v=2&alt=jsonc", {},
            function(data) {
                var video_id = data.data.items[0].id;
                localStorage.setItem('song_url', video_id);
                console.log("id_video: " + localStorage.getItem('song_url'));
            });

    console.log("fin youtube_search");
}//youtubeSearch        

/*
 * Fonction qui permet de voir la video de la musique selectionnée sur youtube
 */
function listen() {
    var url = "http://www.youtube.com/watch?v=" + localStorage.getItem('song_url');
    window.open(url);
}

/*
 *   Fonction qui va chercher l'emplacement geographique de l'utilisateur
 */

function get_location() {
    console.log("get_location");

    navigator.geolocation.getCurrentPosition(on_success, on_error);

    /*
     *   en cas de succes de get_location cette fonction met les 
     *   coordonnees gps dans des variables localStorage dediees
     */
    function on_success(position) {

        localStorage.setItem('latitude', position.coords.latitude);
        localStorage.setItem('longitude', position.coords.longitude);

        console.log(
                "latitude: " + localStorage.getItem('latitude') + '\n' +
                "longitude: " + localStorage.getItem('longitude')
                );

        return true;
        console.log("success get_location");
    }//on_success


    /*
     *   Si la position n'a pas pu etre recuperee par get_location
     *   on_error affiche un message d'alerte!
     */
    function on_error(error) {

        console.log(
                'code: ' + error.code + '\n' +
                'message: ' + error.message + '\n'
                );

        return false;
        console.log("error get_location");
    }//on_error


}//getLocation


/*
 *   Crée une map et positionne un marker sur celle-ci
 */
function radar() {
    console.log("radar");

    /*
     *FONKTION DE TèSTE EN DURE LES DONNEES DE GEOLOCALIZATION 
     */
    localStorage.setItem('latitude', "46.4604589");
    localStorage.setItem('longitude', "6.8377167");

    // Coordonnées -> latitude + longitude -> localStorage
    var myLatlng = new google.maps.LatLng(localStorage.getItem('latitude'), localStorage.getItem('longitude'));

    // Carte centrée sur les coordonées zoom 10
    var mapOptions = {
        zoom: 10,
        center: myLatlng
    };

    // Création de la carte
    var map = new google.maps.Map($("#map-canvas"), mapOptions);

    // Création du Marker
    var marker = new google.maps.Marker({
        // Coordonnées 
        position: myLatlng,
        map: map,
        title: 'musicMatcher'

    });
    //contenu de la fenêtre d'informations'
    var contentString = '<div id="content">' +
            '<div id="artiste">' + "Artiste: " + localStorage.getItem('artist_name') + '</div>' +
            '<div id="morceau">' + "Morceau: " + localStorage.getItem('track_name') + '</div>' +
            '</div>'


    //création de la fenêtre d'informations'
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    //affichage de la fenêtre d'information au click

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });

    console.log("fin radar");
}//google_map




