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
    console.log("DEVICE READY");
}

$(document).bind("mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
    $.mobile.allowCrossDomainPages = true;
});

$(document).on("pageshow", "#tag_map", function() {
    console.log("pageInit tag_map");
    google.maps.event.addDomListener(window, 'load',tag_map());
});

$(document).on("pageinit", "#tag_song", function() {
    catch_artist();
});

$(document).on("pageinit", "#menu", function() {
    localStorage.clear();
    get_location();
});

$(document).on("pageinit", "#radar", function() {
    radar();
});


/*
 * Fonction lancee lors de l'appui sur le bouton #match
 */
function match() {
    console.log("match");	
    console.log(
        "track_name : " + localStorage.getItem('track_name') + '\n' +
        "artist_name: " + localStorage.getItem('artist_name') + '\n' +
        "song_url : " + localStorage.getItem('song_url') + '\n' +
        "latitude: " + localStorage.getItem('latitude') + '\n' +
        "longitude: " + localStorage.getItem('longitude')
        );
    
    send_data();
  
    console.log("fin match");
}//match

/*
 * Fonction qui insere une musique dans le serveur sling
 */
function send_data() {
	
    $.ajax("http://localhost:8080/content/musicmatcher/music/*", {
        type: "POST",
        data: {
            "created": null,
            "title": "music",
            "track_name": localStorage.getItem('track_name'),
            "artist_name": localStorage.getItem('artist_name'),
            "song_url": localStorage.getItem('song_url'),
            "latitude": localStorage.getItem('latitude'),
            "longitude": localStorage.getItem('longitude'),
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
        }
    });

}//send_data


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
                    console.log(artist.name);
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
        artist_name = trim(artist_name);
        localStorage.setItem('artist_name', artist_name);
        console.log("artist_name local storage = " + localStorage.getItem('artist_name'));
        var text = localStorage.getItem('artist_name');
        $(this).closest('[data-role=listview]').prev('form').find('input').val(text);
        $(this).closest('[data-role=listview]').children().addClass('ui-screen-hidden');
        catch_tracks();
    });

    console.log("fin catch_artist");
}//catch_artist


/*
 * Fonction qui cherche les titres d'un artiste et les affiches dans une liste 
 */
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
        });
        $ul.html(html);
        $ul.listview().listview('refresh');
        $ul.trigger("updatelayout");

    });

    $("#tracks_autocomplete").on("click", "li", function() {
        var track_name = $(this).text();
        track_name = trim(track_name);
        localStorage.setItem('track_name', track_name);
        console.log("track_name local storage = " + localStorage.getItem('track_name'));
        var text = $(this).find('.ui-link-inherit').text();
        $(this).closest('[data-role=listview]').prev('form').find('input').val(text);
        $(this).closest('[data-role=listview]').children().addClass('ui-screen-hidden');
        youtube_search();
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
            console.log("ls id_video: " + localStorage.getItem('song_url'));
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

function tag_map() {
    var map;
    var MY_MAPTYPE_ID = 'custom_style';
    console.log("tag_map");
    var featureOpts = [
    {
        stylers: [
        {
            hue: '#007dd3'
        },
{
            visibility: 'simplified'
        },
{
            gamma: 0.5
        },
{
            weight: 0.5
        }
        ]
    },
    {
        elementType: 'labels',
        stylers: [
        {
            visibility: 'on'
        }
        ]
    },
    
    {
        featureType: 'water',
        stylers: [
        {
            color: '#007dd3'
        }
        ]
    }
    ];
       
    //Variables de test à enlever...
    //localStorage.setItem('latitude', "46.4604589");
    //localStorage.setItem('longitude', "6.8377167");

    // Coordonnées -> latitude + longitude -> localStorage
    var myLatlng = new google.maps.LatLng(localStorage.getItem('latitude'), localStorage.getItem('longitude'));

    // Carte centrée sur les coordonées zoom 10
    var mapOptions = {
        zoom: 15,
        center: myLatlng,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
        },
        mapTypeId: MY_MAPTYPE_ID
    };

    // Création de la carte
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    var styledMapOptions = {
        name: 'Custom Style'
    };
    var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
    map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
    // Création du Marker
    var marker = new google.maps.Marker({
        // Coordonnées 
        position: myLatlng,
        map: map,
        title: 'musicMatcher',
        visible: true

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
    
    //Affichage infowindow
    infowindow.open(map, marker);
    
    /*
    //affichage de la fenêtre d'information au click
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
    */

    console.log("fin tag_map");
}//google_map


/*
 *	Fonction pour enlever l'espace d'origine inconnue � la fin des variable localstorage 
 */
function trim (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}


function radar(){
		   console.log("radar");
					 
					var map;
					
					var MY_MAPTYPE_ID = 'custom_style';
					
					var featureOpts = [
					{
						stylers: [
						{
							hue: '#007dd3'
						},
				{
							visibility: 'simplified'
						},
				{
							gamma: 0.5
						},
				{
							weight: 0.5
						}
						]
					},
					{
						elementType: 'labels',
						stylers: [
						{
							visibility: 'on'
						}
						]
					},
					{
						featureType: 'water',
						stylers: [
						{
							color: '#007dd3'
						}
						]
					}
					];


			var markers = [['MaPosition', localStorage.getItem('latitude'), localStorage.getItem('longitude')]];
			
				$.ajax({
					url:"http://localhost:8080/content/musicmatcher/music.1.json",
					type: "GET",
					beforeSend: function(xhr) {
						xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
					}
				})
				.then(function(data) {  
						
						$.each(data, function(i, music_node) {
							if( i == "jcr:createdBy" || i == "jcr:created" || i == "jcr:primaryType"){
								return true;
							}else{

								//Creation d'un tableau avec une musique
								var music = ['<div id="content">' + 
								'<div id="artiste">' + "Artiste: " + music_node.artist_name+ '</div>' +
								'<div id="morceau">' + "Morceau: " + music_node.track_name + '</div>' +
								'</div>', music_node.latitude, music_node.longitude];
								
								markers.push(music);
								}	
							});
							
							
							

							
							
							
															
						var locations = markers;
						console.log("locations Oh yeah: "+markers);
							
							
						// Ma position actuelle
						var myLatlng = new google.maps.LatLng(localStorage.getItem('latitude'), localStorage.getItem('longitude'));
						
						// Carte centrée sur les coordonées zoom 15
						var mapOptions = {
							zoom: 15,
							center: myLatlng,
							mapTypeControlOptions: {
								mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
							},
							mapTypeId: MY_MAPTYPE_ID
						};
							 
						// cr?ation de la map centr?e sur ma position 
						var map = new google.maps.Map(document.getElementById("map"), mapOptions);
						var styledMapOptions = {
							name: 'Custom Style'
						};
						var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
						map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

						var infowindow = new google.maps.InfoWindow();

						// cr?ation des markers
						var marker, i;

						for (i = 0; i < locations.length; i++) {  
							
							marker = new google.maps.Marker({
								position: new google.maps.LatLng(locations[i][1], locations[i][2]),
								map: map
							});

							google.maps.event.addListener(marker, 'click', (function(marker, i) {
								return function() {
									infowindow.setContent(locations[i][0]);
									infowindow.open(map, marker);
								}
							})(marker, i));
							
						}   						
				});	

			
   console.log("fin radar");
}

/* les diff?rentes coordon?es GPS
		   var locations = [
		  ['MaPosition', (localStorage.getItem('latitude'), localStorage.getItem('longitude'))],   
		  ['Neuch�tel', 46.95, 6.75],
		  ['Neuch�tel 1', 46.96, 6.75],
		  ['Neuch�tel 2', 46.97, 6.75],
		  ['Neuch�tel 3', 46.98, 6.75],
		];
		*/


