$(window).load(function() {
    $(document).scrollTop($('#ball').offset().top);  
});

$(document).ready(function(){
    $('#home').hide();
    $('#home').fadeIn(500);
    document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });
});

function addsong(){
    $(document).scrollTop($('#add3').offset().top);
}

function radar(){
    $(document).scrollTop($('#radar').offset().top);
}