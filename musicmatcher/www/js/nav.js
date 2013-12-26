$(window).load(function() {
      
});

$(document).ready(function(){
    $(document).scrollTop($('#home').offset().top);
    $('#home').hide();
    $('#home').fadeIn(500);
    
});

function addsong(){
    $(document).scrollTop($('#add3').offset().top);
}

function radar(){
    $(document).scrollTop($('#radar').offset().top);
}
