$(window).load(function() {
    $(document).scrollTop($('#add2').offset().top);  
});

$(document).ready(function(){
    $('#home').hide();
    $('#home').fadeIn(500);
});

function addsong(){
    $(document).scrollTop($('#add3').offset().top);
}

function radar(){
    $(document).scrollTop($('#add1').offset().top);
}
/*------------------------------------- DO NO TOUCH -------------------------------------*/

/*var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

        <script type="text/javascript">
            app.initialize();
        </script>
*/