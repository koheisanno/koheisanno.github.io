$(document).ready(function(){
    $('#content').css({'margin':'160px auto 50px'});
    $('#nav').css({'height': '65px'})
    $(window).scroll(function() {
        var w = $(window).width();
        if(w > 600) {
            if($(window).scrollTop() > 50){
                $('#sign').css({'display':'none'});
                $('ul.nav1').animate({'top':'5px'},0);
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
        if(w > 600) {
            $('ul.nav1').css({'display':'block'});
            $('#menu').css({'display':'none'});
            $('#content').css({'margin':'160px auto 50px'});
        }
        if(w <= 600) {
            $('#menu').css({'display':'block'});
            $('#content').css({'margin':'80px auto 50px'});
            $('#nav').css({'height': '60px'})
            $('#sign').css({'display':'block'});
            $('ul.nav1').css({'display':'none'});
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
        if($(window).width()<=600) {
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

function updateUser() {
    var emailOption = document.createElement('option')
    emailOption.innerHTML=emailOption
    document.getElementById('profileInputEmail').appendChild(emailOption)
    if (emailOption.split(',').length == 1) {
      google.script.run.withSuccessHandler(alert2).withFailureHandler(scriptFailure).createUser()
    
      document.getElementById('enterProfileInfoMessage').removeAttribute('hidden')
      document.getElementById('profileDoneButton').setAttribute('hidden','true')
      
      createGraduationYearList(emailOption,'')
      if (document.documentElement.clientWidth<1200) {
        var fname = window.prompt("Please enter your first and last name:", "Name")
        var name = fname.split(' ')
        document.getElementById('profileInputFirstName').value=name[0]
        document.getElementById('profileInputLastName').value=name[1]
        updateInfo('firstName')
        updateInfo('lastName')
      }
      else {
        var profileModal = document.getElementById('profileModal')
        UIkit.modal(profileModal).show()
      }
    }
    
    else {
      if (emailOption != '') {
        window.alert(emailOption)
      }
      if (emailOption != '') {
        //Set First Name on profile    
        document.getElementById('profileInputFirstName').removeAttribute('placeholder')
        document.getElementById('profileInputFirstName').setAttribute('value',emailOption)
        document.getElementById('profileInputFirstName').className+=" uk-form-blank"
      }
      
      if (emailOption != '') {
        //Set last name on profile
        document.getElementById('profileInputLastName').removeAttribute('placeholder')
        document.getElementById('profileInputLastName').setAttribute('value',emailOption)
        document.getElementById('profileInputLastName').className+=" uk-form-blank"
      }
      if (emailOption != '') {
        //Set graduation year
        document.getElementById('testtest').innerHTML = "test";
        createGraduationYearList(emailOption,emailOption)
      }
      else {
        createGraduationYearList(emailOption,'')
      }
      if (emailOption == '') {
        var photoID = "1o5jNw9izcF7DeTm1r_J7S5TS3AEAet4a"
      }
      else {
        var photoID = emailOption
      }
      //Set profile image url on main page
      document.getElementById('profilePicture').style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+photoID+'")';
      
      if (emailOption == '' || emailOption == '') {
        if (document.documentElement.clientWidth<1200) {
          var fname = window.prompt("Please enter your first and last name:", "Name")
          var name = fname.split(' ')
          if (name[0] != '' && name[0] != null) {
            document.getElementById('profileInputFirstName').value=name[0]
            updateInfo('firstName')
          }
          if (name[1] != '' && name[1] != null) {
            document.getElementById('profileInputLastName').value=name[1]
            updateInfo('lastName')
          }
        } 
        else {
          document.getElementById('enterProfileInfoMessage').removeAttribute('hidden')
          document.getElementById('profileDoneButton').setAttribute('hidden','true')
           
          UIkit.modal('#profileModal').show()
        }
      }
    
      var officerships = String(splitString(safeString(emailOption))).split(',')
      var elements = document.getElementsByClassName('officerHidden')
      if (officerships.length == 0 || officerships.length == 1 && officerships[0]=='') {
        //hide officer actions
        for (var i = 0; i<elements.length; i++) {
          elements[i].setAttribute('hidden','true')
        }
      }
      else {
      //show officer actions
        for (var i = 0; i<elements.length; i++) {
          elements[i].removeAttribute('hidden')
        }
        //add club select options to Updates post, settings page
        var updatesSelectClub = document.getElementById('newUpdateClub')
        var settings = document.getElementById('settingsClubs')
        settings.innerHTML=''
        var members = document.getElementById('membersClubs')
        members.innerHTML=''
        var events = document.getElementById('eventsClubs')
        events.innerHTML=''
        var newUpdate = document.getElementById('newUpdateClub')
        newUpdate.innerHTML=''
        var newEvent = document.getElementById('newEventClub')
        newEvent.innerHTML=''
        var officerLog = document.getElementById('logClubs')
        officerLog.innerHTML=''
        var qrClubs = document.getElementById('qrClubs')
        qrClubs.innerHTML=''
        var clubs = String(splitString(safeString(emailOption))).split(',')
        for (var i = 0; i < clubs.length; i++) {
          if (clubs[i] != '') {
          var newOption = document.createElement('option')
          newOption.setAttribute('value',clubs[i])
          newOption.innerHTML = clubs[i]
          var newOption2 = document.createElement('option')
          newOption2.setAttribute('value',clubs[i])
          newOption2.innerHTML = clubs[i]
          var newOption3 = document.createElement('option')
          newOption3.setAttribute('value',clubs[i])
          newOption3.innerHTML = clubs[i]
          var newOption4 = document.createElement('option')
          newOption4.setAttribute('value',clubs[i])
          newOption4.innerHTML = clubs[i]
          var newOption5 = document.createElement('option')
          newOption5.setAttribute('value',clubs[i])
          newOption5.innerHTML = clubs[i]
          var newOption6 = document.createElement('option')
          newOption6.setAttribute('value',clubs[i])
          newOption6.innerHTML = clubs[i]
          var newOption7 = document.createElement('option')
          newOption7.setAttribute('value',clubs[i])
          newOption7.innerHTML = clubs[i]
          settings.appendChild(newOption)
          members.appendChild(newOption2)
          newUpdate.appendChild(newOption3)
          newEvent.appendChild(newOption4)
          events.appendChild(newOption5)
          officerLog.appendChild(newOption6)
          qrClubs.appendChild(newOption7)
          }
        }
        getSettingsValues()
        getMembers()
        document.getElementById('settingsImage').style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+photoID+'")'
        document.getElementById('newUpdateDate').valueAsDate = new Date()
        document.getElementById("newUpdateExpiration").valueAsDate = new Date(new Date().getTime()+604800000)
        var date = new Date()
        if (date.getMonth() > 5) {
          var year = date.getFullYear()+1
          document.getElementById("newUpdateExpiration").max = year+'-07-01'
        }
        else {
          var year = date.getFullYear()
          document.getElementById("newUpdateExpiration").max = year+'-07-01'
        }
        if (date.getMonth() > 5) {
          var year = date.getFullYear()+1
          document.getElementById("editUpdateExpiration").max = year+'-07-01'
        }
        else {
          var year = date.getFullYear()
          document.getElementById("editUpdateExpiration").max = year+'-07-01'
        }
      
        var elements = document.getElementsByClassName('officer-sponsor')
        if (emailOption == "Faculty") {
          for (var i = 0; i<elements.length; i++) {
            var value = elements[i].innerHTML
            elements[i].innerHTML = value.replace('Officer','Sponsor')
          }
        }
      }
    }
  }