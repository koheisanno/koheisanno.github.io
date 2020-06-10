$(document).ready(function(){
    var w = $(window).width();
    if(w > 600) {
        $('#menu').css({'display':'none'});
        $('#sign').css({'display':'block'});
        $('#nav').css({'height': '120px'});
        $('ul.nav1').css({'top': '80px'});
    }
    else{
        $('#menu').css({'display':'block'});
        $('#content').css({'margin':'80px auto 50px'});
        $('ul.nav1').css({'display':'none'});
    }
    $(window).scroll(function() {
        var w = $(window).width();
        if(w > 600) {
            if($(window).scrollTop() > 50){
                $('#sign').css({'display':'none'});
                $('ul.nav1').animate({'top':'15px'},0);
                $('#nav').css({'height': '65px'})
            } else {
                $('#sign').css({'display':'block'});
                $('ul.nav1').animate({'top':'80px'},0);
                $('#nav').css({'height': '120px'})
            }
        }
    });
    $(window).resize(function(){
        var w = $(window).width();
        if(w > 600 && $('#overlay').css('display')==='none') {
            $('ul.nav1').css({'display':'block'});

        } else {
            $('ul.nav1').css({'display':'none'});
        }
        if(w <= 600 && $('#overlay').css('display')==='none') {
            $('#menu').css({'display':'block'});
            $('#content').css({'margin':'80px auto 50px'});
            $('#nav').css({'height': '60px'})
        } else {
            $('#menu').css({'display':'none'});
            $('#content').css({'margin':'160px auto 50px'});
        }
        if($('#overlay').css('display')!=='none') {
            $('#close').css({'display':'block'});
        }
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