$(document).ready(function(){
    $(window).scroll(function() {
        var w = $(window).width();
        if(w > 750) {
            if($(window).scrollTop() > 50){
                $('#sign').css({'display':'none'});
                $('#sign2').css({'display':'block'});
                $('ul.nav1').animate({top:'40px'},0);
                $('#nav').css({'height': '100px'})
            } else {
                $('#sign').css({'display':'block'});
                $('#sign2').css({'display':'none'});
                $('ul.nav1').animate({top:'100px'},0);
                $('#nav').css({'height': '180px'})
            }
        }
    });
    $(window).resize(function(){
        var w = $(window).width();
        if(w > 750 && $('#overlay').css('display')==='none') {
            $('ul.nav1').css({'display':'block'});

        } else {
            $('ul.nav1').css({'display':'none'});
        }
        if(w <= 750 && $('#overlay').css('display')==='none') {
            $('#menu').css({'display':'block'});
        } else {
            $('#menu').css({'display':'none'});
        }
        if($('#overlay').css('display')!=='none') {
                $('#close').css({'display':'block'});
        }
        if(w <= 750) {
            $('#sign').css({'display':'none'});
            $('#sign2').css({'display':'block'});
            $('#nav').css({'height': '60px'})
        } else {
            if($(window).scrollTop() > 50){
                $('#sign').css({'display':'none'});
                $('#sign2').css({'display':'block'});
                $('#nav').css({'height': '80px'})
            } else {
                $('#sign').css({'display':'block'});
                $('#sign2').css({'display':'none'});
                $('#nav').css({'height': '160px'})
            }
        }
    });
    $('.defaultlink').hover((event)=>{
        $(event.currentTarget).css({'color':'gray'});
        }, (event)=>{
        $(event.currentTarget).css({'color':'black'});
    });
    $('a h1').hover((event)=>{
        $(event.currentTarget).css({'color':'rgb(60, 60, 60)'});
        }, (event)=>{
        $(event.currentTarget).css({'color':'white'});
    });
    $('.icon').on('click', (event)=>{
        $('#overlay').fadeToggle();
        $('body').toggleClass('stopscroll');
    })
    $('#menu').on('click', (event)=>{
        event.preventDefault();
        $('#menu').fadeToggle();
        $('#close').fadeToggle();
    })
    $('#close').on('click', (event)=>{
        event.preventDefault();
        if($(window).width()<=750) {
            $('#menu').fadeToggle();
            $('#close').fadeToggle();
        } else {
            $('ul.nav1').css({'display':'block'});
            $('#close').fadeToggle();
        }
    })
    $(".icon").hover(function(){
        $(this).css({"transform": "scale(1.1)"});
        }, function(){
        $(this).css({"transform": "scale(1.0)"});
    });
});    