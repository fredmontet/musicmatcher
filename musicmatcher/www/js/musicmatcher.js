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


/*
 * Fonction qui insere une musique dans le serveur sling
 */
function send_song(){
    
    //Variable de connexion à Sling

    /*
    *   ATTENTION
    *   A changer lors de la "mise en prod"
    */
    var host = "http://localhost:8080";
        
    $.ajax({
        type: "POST",
        url: host+"/content/musicmatcher/music/*",
        dataType:"jsonp",
        crossDomain:"true",
        data: {
            
            /*
            "created": null,
            "song_title": localStorage.getItem('song_title'),
            "song_artist": localStorage.getItem('song_artist'),
            "song_url": localStorage.getItem('song_url'),
            "latitude": localStorage.getItem('latitude'),
            "longitude": localStorage.getItem('longitude'),
            */
            
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
        complete: function(xhr) {
            console.log("Musique enregistree");
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
                localStorage.setItem('artist_name',$artist_name);                

            })//each
            console.log("fin catch_artist");  
        });
    
}//catch_artist


/*
*   fonction de test pour sauver le titre de la
*   musique selectionee dans liste deroulante
*/
function save_name(){
    
    var x=document.getElementById("songs").selectedIndex;
    var y=document.getElementById("songs").options;
    var $track_name = y[x].text;
    localStorage.setItem('track_name',$track_name)
    
}//save_name


/*
*   Fonction qui prend un nom d'artiste et une de ses
*    musiques et retourne le premier resultat youtube   
*/
function youtube_search(song_artist, song_title){
    
    console.log("debut youtbe_search");
        
    //test en dur
    var song_artist = localStorage.getItem('artist_name');
        
    var song_artist = encodeURIComponent(song_artist);
        
    var song_title = localStorage.getItem('track_name');
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
 *
function add_option(track_name){
    
    var option = $("<option/>");
    option.text(track_name);
    $("#songs").append(option);
    
}//add_option
*/


/*
*   Fonction qui va chercher l'emplacement geographique de l'utilisateur
*/
function get_location() {
        
    navigator.geolocation.getCurrentPosition(on_success, on_error);
        
}//getLocation


/*
*   en cas de succes de get_location cette fonction met les 
*   coordonnees gps dans des variables localStorage dediees
*/ 
function on_success(position) {
    
    //à enlenver lors de la "mise en prod"
    alert(
        "latitude: "+localStorage.getItem('latitude')+'\n'+
        "longitude: "+localStorage.getItem('longitude')
    );
    
    localStorage.setItem('latitude', position.coords.latitude);
    localStorage.setItem('longitude', position.coords.longitude);
        
}//on_success
    

/*
*   Si la position n'a pas pu etre recuperee par get_location
*   on_error affiche un message d'alerte!
*/
function on_error(error) {
        
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
        
}//on_error


/*
*   Crée une map et positionne un marker sur celle-ci
*/
function google_map(){
    
    // Coordonnées -> latitude + longitude -> localStorage
    var myLatlng = new google.maps.LatLng(localStorage.getItem('latitude'),localStorage.getItem('longitude'));
    
    // Carte centrée sur les coordonées zoom 10
    var mapOptions = {
        zoom: 10,
        center: myLatlng
    }
    // Création de la carte
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    // Création du Marker
    var marker = new google.maps.Marker({
        
        // Coordonnées 
        position: myLatlng,
        map: map,
        title: 'musicMatcher'
        
    });
    //contenu de la fenêtre d'informations'
    var contentString = '<div id="content">'+
                            '<div id="artiste">'+"Artiste: "+localStorage.getItem('artist_name')+'</div>'+
                            '<div id="morceau">'+"Morceau: "+localStorage.getItem('track_name')+'</div>'+ 
                        '</div>'
                       
  
    //création de la fenêtre d'informations'
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    //affichage de la fenêtre d'information au click
    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });
    
}//google_map

