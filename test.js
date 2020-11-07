<script>
<?
var clubData=getClubData()
var userData=String(getUserData())
var user=getUser()
?>

// general functions - alerts, gets, general javascript functions

function scriptFailure() {
  alert2('Error')
}

function alert2(alert2) {
  alert2=safeString(alert2)
  showToast(String(alert2));
  google.script.run.log2(alert2)
  /**
  if (alert2 == "Update posted." || alert2 == "Update edited." || alert2 == "Update deleted.") {
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateUpdates).getUpdates()
    document.getElementById('newUpdateTitle').value=''
    document.getElementById('newUpdateBody').value=''
    document.getElementById('newUpdateCheckbox').removeAttribute('checked')
  }**/
  if (alert2 == "Officer team updated" || alert2 == "Sponsors updated") {
    getSettingsValues()
    //google.script.run.updateUserClubCalendars()
  }
  if (alert2.indexOf('Club membership added')>-1) {
    google.script.run.joinedClub()
  }
  if (alert2.indexOf("log") > -1) {
    getMyLog()
  }
  if (alert2=='Club settings updated'){
    $('.settingChangeSpinner').attr('hidden', 'true');
  }

  if (alert2.indexOf("events removed")>-1 || alert2.indexOf("event removed")>-1) {
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateEvents).getEvents()
    //google.script.run.updateUserClubCalendars()
  }
  if (alert2.indexOf("events edited")>-1 || alert2.indexOf("Event")>-1) {
    getClubEvents()
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateEvents).getEvents()
    //google.script.run.updateUserClubCalendars()
  }
  if (alert2 == "Submission edited" || alert2.indexOf("Submissions edited") > -1 || alert2 == "Submission deleted" || alert2 == "Submissions deleted") {
    getClubLog()
  }
  if (alert2=='Attendance updated'){
    getMyLog();
  }
  if (alert2 == "New user created") {
    updateData()
  }
}

function showToast(text){
  $('.toast').css('z-index', '1100');
  $('.toast-body').text(text);
  $('.toast').toast('show');  
  setTimeout(() => {  $('.toast').toast('hide'); $('.toast').css('z-index', '1'); }, 8000)
}

function getUserName(user) {
  var users = splitString(<?=userData?>)
  for (var i = 0; i<users.length; i++) {
    if (users[i][0]==user && users[i][1] !='' && users[i][2] != '') {
      return users[i][1]+' '+users[i][2]
    }
  }
  return user+" user name not found"
}

function getUserPhoto(user) {
  var users = splitString(<?=userData?>)
  for (var i = 0; i<users.length; i++) {
    if (users[i][0] == user && users[i][3] != '') {
      return users[i][3]
    }
  }
  return "1o5jNw9izcF7DeTm1r_J7S5TS3AEAet4a"
}


function getClubColors(club) {
  var clubs = splitString(<?=clubData?>)
  for (var i = 0; i<clubs.length; i++) {
    if (clubs[i][0]==club) {
      if (clubs[i][2] != '') {
        var postBackgroundColor=clubs[i][2]
      }
      else {
        var postBackgroundColor='#F0F0F0'
      }
      if (clubs[i][3] != '') {
        var postTextColorPrimary=clubs[i][3]
      }
      else {
        var postTextColorPrimary='#000000'
      }
      if (clubs[i][4] != '') {
        var postTextColorSecondary=clubs[i][4]
      }
      else {
        var postTextColorSecondary='#000000'
      }
      return [postBackgroundColor,postTextColorPrimary,postTextColorSecondary]
    }
  }
  return ['#F0F0F0','#000000','#000000']
}


function getEventById(id){
  for (var key in officerEventData){
    var array = officerEventData[key]
    for(var i=0; i<array.length; i++){
      if (array[i][0] == id) {
        return array[i]
      }
    }
  }
  return "Error: event not found"
}


function getEventNameById(id){
  for (var t = 0; t<myEventData.length; t++) { 
    if(id == myEventData[t][0]){
      return myEventData[t][5]
    }
  }
  return "Error: event not found"
}

function splitString(string) {
  if (string == ' ' || string == '') {
    return []
  }
  var array = String(string).split(',;,')
  var array2 = []
  for (var i=0; i<array.length; i++) {
    array[i] = String(array[i]).replace(',;','')
    array[i] = String(array[i]).replace(', ',';;;;')
    var entry = String(array[i]).split(',')
    for (var n = 0; n<entry.length; n++) {
      entry[n] = String(entry[n]).replace(';;;;',', ')
    }
    array2.push(entry)
  }
  return array2
}

function safeString(string) {
  var result1 = String(string).replace('<','(')
  var result2 = result1.replace('>',')')
  return result2
}

function makeStrings(array) {
  for (var i = 0; i<array.length; i++) {
    for (var n = 0; n<array[i].length; n++) {
      array[i][n] = String(array[i][n])
    }
  }
  return array
}

function sortTable(n, id, type) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(id);
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (type=='str'){
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
        else{
          if (Number(x.innerHTML) > Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      } else if (dir == "desc") {
        if (type=='str'){
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
        else{
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function getTimeString(startTime,endTime,length) {
    if (startTime.getHours()>11) {
      var startA='PM'
    }
    else {
      var startA='AM'
    }
    if (startTime.getHours()>12) {
      var startH = startTime.getHours()-12
    }
    else if (startTime.getHours()==0) {
      var startH=12
    }
    else {
      var startH = startTime.getHours()
    }
    if (endTime.getHours()>11) {
      var endA='PM'
    }
    else {
      var endA='AM'
    }
    if (endTime.getHours()>12) {
      var endH = endTime.getHours()-12
    }
    else if (endTime.getHours()==0) {
      var endH=12
    }
    else {
      var endH = endTime.getHours()
    }
    if (startTime.getMinutes()<10) {
      var startM = "0"+startTime.getMinutes()
    }
    else {
      var startM = startTime.getMinutes()
    }
    if (endTime.getMinutes()<10) {
      var endM = "0"+endTime.getMinutes()
    }
    else {
      var endM = endTime.getMinutes()
    }
    if (endA==startA) {
      var time = String(String(startH)+":"+String(startM)+" - "+String(endH)+":"+String(endM)+" "+startA)
    }
    else {
      var time = String(String(startH)+":"+String(startM)+" "+startA+" - "+String(endH)+":"+String(endM)+" "+endA)
    }
    if (length == 1) {
      return time
    }
    else {
     return [String(startH)+":"+String(startM)+" "+startA,String(endH)+":"+String(endM)+" "+endA]
   }
 }
 
function allCheckbox(id) {
  var checked = document.getElementById(id).checked
  var elements = document.getElementsByClassName(id)
  for (var i = 0; i<elements.length; i++) {
    elements[i].checked = checked
  }
}












//style

$(document).ready(function(){
    $(".filter-button").click(function(){
        var value = $(this).attr('data-filter');
        
        if(value == "all")
        {
            $('.filter').show('1000');
        }
        else
        {
            $(".filter").not('.'+value).hide('3000');
            $('.filter').filter('.'+value).show('3000');
        }
    });
    
    var w=$(window).width();
    if(w<740){
      document.getElementById("nav-tab").className="nav nav-pills justify-content-center";
    }
    else{
    document.getElementById("nav-tab").className='nav nav-tabs';
    }
});

$(document).ready(function() {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});

$(document).on("click", ".filter-button",function(){
        var value = $(this).attr('data-filter');
        
        if(value == "all")
        {
            $('.filter').show('1000');
        }
        else
        {
            $(".filter").not('.'+value).hide('3000');
            $('.filter').filter('.'+value).show('3000');
        }
    });
    
    
$(document).on("click", ".toggleButton",function(){
  if($(this).hasClass( "expandButton" )){
    $(this).delay( 800 ).addClass('collapseButton');
    $(this).removeClass('expandButton');
  }
  else if($(this).hasClass( "collapseButton" )){
    $(this).delay( 800 ).addClass('expandButton');
    $(this).removeClass('collapseButton');
  }
});

var header = document.getElementById("clubs-filter");
var btns = header.getElementsByClassName("filter-button");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("filter-clubs active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

var header = document.getElementById("logAccordion");
var btns = header.getElementsByClassName("btn-outline-info");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("accordion-active");
    if(current.length>0){
      if(!current[0].isSameNode(this)){
        current[0].className = current[0].className.replace(" accordion-active", "");
        this.className += " accordion-active";
      }
      else{
        current[0].className = current[0].className.replace(" accordion-active", "");
      }
    }
    else{
      this.className += " accordion-active";
    }
  });
}










// initial load

var officerEventData = '';
var officerLogData = '';
var officerMembers = '';
var officerships = '';
var memberships = '';
var myEventData = '';
var myLogData='';
var spreadsheetLinks='';


function loadMain() {
  google.script.run.withSuccessHandler(setCacheData).getCacheData();
}


function setCacheData(data){
  myLogData = data[0];
  myEventData = data[1];
  officerLogData = data[2];
  officerEventData = data[3];
  officerships = data[4];
  memberships = data[5];
  officerMembers = data[6];
  console.log(myLogData);
  console.log(myEventData);
  console.log(officerLogData);
  console.log(officerEventData);
  console.log(memberships);
  
  updateUser();
  localStorage.setItem('loaded', 'false');
  document.getElementById("welcometext").innerHTML = "Welcome, " + <?=user[1]?>;
  updateData();
  google.script.run.withSuccessHandler(loadQuizData).getQuizData();
  document.getElementById("mainBody").removeAttribute("hidden");
  document.getElementById("mainSpinner").style.display = "none";
}

function updateUser() {
  var emailOption = document.createElement('option')
  emailOption.innerHTML=String(<?=user[0]?>)
  document.getElementById('profileInputEmail').appendChild(emailOption)
  if (String(<?=user?>).split(',').length == 1) {
    google.script.run.withSuccessHandler(alert2).withFailureHandler(scriptFailure).createUser()
  
    document.getElementById('enterProfileInfoMessage').removeAttribute('hidden')
    document.getElementById('profileDoneButton').setAttribute('hidden','true')
    
    createGraduationYearList(String(<?=user[0]?>),'')
    $('#profileModal').modal('show')
  }
  
  else {
    if (String(<?=user[13]?>) != '') {
      window.alert(String(<?=user[13]?>))
    }
    if (String(<?=user[1]?>) != '') {
      //Set First Name on profile    
      document.getElementById('profileInputFirstName').removeAttribute('placeholder')
      document.getElementById('profileInputFirstName').setAttribute('value',(<?=user[1]?>))
    }
    
    if (String(<?=user[2]?>) != '') {
      //Set last name on profile
      document.getElementById('profileInputLastName').removeAttribute('placeholder')
      document.getElementById('profileInputLastName').setAttribute('value',(<?=user[2]?>))
    }
    if (String(<?=user[3]?>) != '') {
      //Set graduation year
      createGraduationYearList(String(<?=user[0]?>),String(<?=user[3]?>))
    }
    else {
      createGraduationYearList(String(<?=user[0]?>),'')
    }
    if (String(<?=user[4]?>) == '') {
      var photoID = "1o5jNw9izcF7DeTm1r_J7S5TS3AEAet4a"
    }
    else {
      var photoID = String(<?=user[4]?>)
    }
    //Set profile image url on main page
    document.getElementById('profilePicture').style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+photoID+'")';
    
    if (String(<?=user[1]?>) == '' || String(<?=user[2]?>) == '' || String(<?=user[3]?>) == '') {
      document.getElementById('enterProfileInfoMessage').removeAttribute('hidden')
      document.getElementById('profileDoneButton').setAttribute('hidden','true')
         
      $('#profileModal').modal('show')
    }
  
    var officerships = String(splitString(safeString(String(<?=user[5]?>)))).split(',')
    var elements = document.getElementsByClassName('officerHidden')
    if (officerships.length == 0 || (officerships.length == 1 && officerships[0]=='')) {
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
      var settings = document.getElementById('settingsClubs')
      settings.innerHTML=''
      var members = document.getElementById('membersClubs')
      members.innerHTML=''
      var events = document.getElementById('eventsClubs')
      events.innerHTML=''
      var newEvent = document.getElementById('newEventClub')
      newEvent.innerHTML=''
      var officerLog = document.getElementById('logClubs')
      officerLog.innerHTML=''
      var qrClubs = document.getElementById('qrClubs')
      qrClubs.innerHTML=''
      var clubs = String(splitString(safeString(String(<?=user[5]?>)))).split(',')
      
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
        newEvent.appendChild(newOption4)
        events.appendChild(newOption5)
        officerLog.appendChild(newOption6)
        qrClubs.appendChild(newOption7)
        }
      }
      getSettingsValues()
      getMembers()
    
      var elements = document.getElementsByClassName('officer-sponsor')
      if (String(<?=user[3]?>) == "Faculty") {
        for (var i = 0; i<elements.length; i++) {
          var value = elements[i].innerHTML
          elements[i].innerHTML = value.replace('Officer','Sponsor')
        }
      }
    }
  }
}

function createGraduationYearList(user,value) {
    var now = new Date()
    if (now.getMonth()>3) {
      var year = new Date().getYear() + 1901
    }
    else {
      var year = new Date().getYear() + 1900
    }
    if (includesNumber(user) == false) {
      var grads = ['Faculty']
    }
    else {
      var grads = [String(year+3), String(year+2), String(year+1), String(year)]
    }
    if (String(value) != '') {
      var option = document.createElement('option')
      option.setAttribute('value', String(value))
      option.innerHTML = value
      document.getElementById('profileInputGraduationYear').appendChild(option)
    }
    else if (grads.length != 1) {
      var option = document.createElement('option')
      option.setAttribute('value','None')
      option.innerHTML = 'None'
      document.getElementById('profileInputGraduationYear').appendChild(option)
    }
    for (var i = 0; i < grads.length; i++) {
      if (grads[i] != String(value)) {
        var option = document.createElement('option')
        option.setAttribute('value',grads[i])
        option.innerHTML = grads[i]
        document.getElementById('profileInputGraduationYear').appendChild(option)
      }
    }
    if (grads.length == 1) {
      var option = document.createElement('option')
      option.setAttribute('value','None')
      option.innerHTML = 'None'
      document.getElementById('profileInputGraduationYear').appendChild(option)
    }
    if (includesNumber(user) == false && value != 'Faculty') {
      if (String(<?=user?>).split(',').length != 1) {
        updateInfo('graduationYear')
      }
    }
}


function updateInfo(info) {
  var firstName=document.getElementById('profileInputFirstName').value
  var lastName=document.getElementById('profileInputLastName').value
  var graduationYear=document.getElementById('profileInputGraduationYear').value
  if (firstName != '' && lastName != '' && graduationYear!='None') {
    document.getElementById('profileDoneButton').removeAttribute('hidden')
    document.getElementById('enterProfileInfoMessage').setAttribute('hidden','true')
  }
  
  if (info=='firstName') {
    document.getElementById("welcometext").innerHTML = "Welcome, " + firstName
    google.script.run.withSuccessHandler(alert2).withFailureHandler(scriptFailure).updateUserInfo('firstName',firstName)
  }
  if (info=='lastName') {
    google.script.run.withSuccessHandler(alert2).withFailureHandler(scriptFailure).updateUserInfo('lastName',lastName)
  }
  if (info=='graduationYear') {
    google.script.run.withSuccessHandler(alert2).withFailureHandler(scriptFailure).updateUserInfo('graduationYear',graduationYear)
  }
}


function includesNumber(string) {
  if (string.includes('0') == true) {
    return true
  }
  else if (string.includes('1') == true) {
    return true
  }
  else if (string.includes('2') == true) {
    return true
  }
  else if (string.includes('3') == true) {
    return true
  }
  else if (string.includes('4') == true) {
    return true
  }
  else if (string.includes('5') == true) {
    return true
  }
  else if (string.includes('6') == true) {
    return true
  }
  else if (string.includes('7') == true) {
    return true
  }
  else if (string.includes('8') == true) {
    return true
  }
  else if (string.includes('9') == true) {
    return true
  }
  else {
    return false
  }
}


function updateData() {
  //get data from different sheets
  var clubs = memberships.split(',');
  if (String(clubs) == 'undefined' || String(clubs) == 'null') {
    clubs = []
  }
  console.log(memberships)
  updateMyClubs(clubs)
  var users = splitString(safeString(String(<?=userData?>)))
  updateUsers(users)
  //google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateUpdates).getUpdates()
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateLinks).getLinks('All')
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateLinks).getLinks('Officer')
  //google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateClubs).getClubs()
  //google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateTasks).getTasks()
  //loadEvents()
  //getMyLog()
  //getClubEvents()
  //google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateNewEventModal2).getClubOfficerData()
  //getClubLog()
  changeQR()
}

function updateMyClubs(clubs) {
  //update club options on updates
  document.getElementById('checkinClub').innerHTML=''
  document.getElementById('events-filter-clubs').innerHTML=''
  
  var all = document.createElement("li");
  all.className='nav-item';
  
  var button=document.createElement('button');
  button.className='btn btn-default filter-events pill filter-button mx-1 active';
  button.setAttribute('data-filter', "all");
  button.innerHTML="All";
  all.appendChild(button);
  document.getElementById('events-filter-clubs').appendChild(all);
  
  for (var i = 0; i<clubs.length; i++) {
    if (clubs[i] != '') {
    //update clubs on the events page
    var node2 = document.createElement('li')
    node2.className='nav-item';
    
    var btn=document.createElement('button');
    btn.className='btn btn-default filter-events filter-button mx-1';
    btn.setAttribute('data-filter', clubs[i].replace(/\s/g, "").replace(/\./g,''));
    btn.innerHTML=clubs[i];

    node2.appendChild(btn)
    document.getElementById('events-filter-clubs').appendChild(node2)
    
    var option = document.createElement('option')
    option.value=clubs[i]
    option.innerHTML=clubs[i]
    document.getElementById('checkinClub').appendChild(option)
    
    }
  }
}

//update users for adding sponsors/officers
function updateUsers(users) {
  var datalist1 = document.getElementById('students')
  var datalist2 = document.getElementById('faculty')
  datalist1.innerHTML=''
  datalist2.innerHTML=''
  for (var i = 0; i<users.length; i++) {
    var option = document.createElement('option')
    option.value=users[i][0]
    option.innerHTML=users[i][1]+' '+users[i][2]
    if (users[i][4] == "Faculty") {
      datalist2.appendChild(option)
    }
    else {
      datalist1.appendChild(option)  
    }
  }
}














//events page --> set events page

function getEvents(){
  var time = (new Date()).getTime()
  var result1=[]
  for (var i = 0; i<myEventData.length;i++) {
    var date = (new Date(myEventData[i][2])).getTime()
    if (date>time && memberships.indexOf(myEventData[i][3])>-1) {
      var checkin1="no"
      for (var n = 1; n<myLogData.length; n++) {
        if (myLogData[n][2] == myEventData[i][0] && myLogData[n][3] == <?=user[0]?>) {
          checkin1="yes"
        }
      }
      result1.push([date,[myEventData[i][0],myEventData[i][1],myEventData[i][2],myEventData[i][3],myEventData[i][4],myEventData[i][5],myEventData[i][6],myEventData[i][7],myEventData[i][8],myEventData[i][9],checkin1]])
    }
  }
  var result1 = result1.sort()
  var result2 = []
  for (var i = 0; i<result1.length; i++) {
    result2.push(result1[i][1])
  }
  result2 = makeStrings(result2)
  
  updateEvents(result2)
}

function updateEvents(data) {
  var activities = []
  
  //get unique activities
  for (var i = 0; i<data.length; i++) {
    if (String(activities).indexOf(data[i][4]) < 0) {
      activities.push([data[i][4]])
    }
  }
  
  //update activity options
  /**document.getElementById('events-filter-activity').innerHTML=''
  for (var i = 0; i<activities.length; i++) {
    var node = document.createElement('li')
    node.setAttribute('uk-filter-control','filter: [activity="'+activities[i]+'"]; group: activity')
    
    var text = document.createElement('a')
    text.setAttribute('href','#')
    text.innerHTML=activities[i]
    text.className="text-blue"
    node.appendChild(text)
    
    document.getElementById('events-filter-activity').appendChild(node)
  }**/
  
  //update updates
  var grid = document.getElementById('eventsGrid')
  grid.innerHTML=''
  if (data.length == 0) {
    var noEvents = document.createElement('h4')
    noEvents.innerHTML = 'No events to display.'
    grid.appendChild(noEvents)
  }
  for (var i=0; i<data.length; i++) {
    var ID = data[i][0]
    var startTime = new Date(data[i][1])
    var endTime = new Date(data[i][2])
    var club = data[i][3]
    var activity = data[i][4]
    var name = data[i][5]
    var hours = data[i][6]
    var location = data[i][7]
    var type = data[i][8]
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
    var date = new Date()
    var checkin = data[i][10]
    
    var time = getTimeString(startTime,endTime,1)
    
    if (activity=="Meeting") {
      var body = "<small>Location:</small> "+location+"<p><small>Type:</small> "+type+"</p><p><small>Activity:</small> "+activity+"</p>"
    }
    else {
      var body = "<small>Location:</small> "+location+"<p><small>Hours:</small> "+hours+"</p><p><small>Type:</small> "+type+"</p><p><small>Activity:</small> "+activity+"</p>"
    }
    
    var clubColors=getClubColors(club)
    
    var cardTitle = document.createElement('h3')
    cardTitle.className="ml-2 card-title mt-2"
    cardTitle.innerHTML=name
    cardTitle.style.color=clubColors[1]
   
    var cardDate = document.createElement('h6')
    cardDate.className="ml-2 card-text"
    cardDate.innerHTML=String(String(days[startTime.getDay()])+', '+String(months[startTime.getMonth()])+' '+String(startTime.getDate())+', '+String(startTime.getFullYear())+' | '+time)
    cardDate.style.color=clubColors[2]
    
    var cardBody = document.createElement('div')
    cardBody.className='card-body';
    
    var divCard = document.createElement('div')
    divCard.className= "card filter "+ club.replace(/\s/g, "").replace(/\./g,'');
    divCard.style.display="inline-block"
    
    if (startTime.getTime()-900000 < date.getTime() && endTime.getTime()+900000 > date.getTime()) {
      var check = document.createElement('span')
      check.style.color=clubColors[1]
      check.setAttribute('id','check'+ID)
      if (checkin=="yes") {
        check.innerHTML = '   <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.646 11.354a.5.5 0 0 1 0-.708L14.293 8l-2.647-2.646a.5.5 0 0 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"/><path fill-rule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/><path fill-rule="evenodd" d="M2 13.5A1.5 1.5 0 0 1 .5 12V4A1.5 1.5 0 0 1 2 2.5h7A1.5 1.5 0 0 1 10.5 4v1.5a.5.5 0 0 1-1 0V4a.5.5 0 0 0-.5-.5H2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-1.5a.5.5 0 0 1 1 0V12A1.5 1.5 0 0 1 9 13.5H2z"/></svg>'
        check.setAttribute('onclick','checkin("'+ID+'","checkout")')
        check.setAttribute('data-toggle','tooltip')
        check.setAttribute('title','Check out of this event.')
      }
      else {
        check.innerHTML = '  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-in-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.146 11.354a.5.5 0 0 1 0-.708L10.793 8 8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"/><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 1 8z"/><path fill-rule="evenodd" d="M13.5 14.5A1.5 1.5 0 0 0 15 13V3a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 4 3v1.5a.5.5 0 0 0 1 0V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 5 13v-1.5a.5.5 0 0 0-1 0V13a1.5 1.5 0 0 0 1.5 1.5h8z"/></svg>'
        check.setAttribute('onclick','checkin("'+ID+'","checkin")')
        check.setAttribute('data-toggle','tooltip')
        check.setAttribute('title','Check in at this event')
      }
      cardTitle.appendChild(check)
    }
    
    var divBody = document.createElement('div')
    divBody.className='ml-2';
    divBody.innerHTML=body
    divBody.style.color=clubColors[1]
    
    var divFooter = document.createElement('div')
    divFooter.className="card-footer"
    divFooter.innerHTML=club
    divFooter.style.color=clubColors[1]
    
    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardDate)
    cardBody.appendChild(divBody)
    divCard.style.backgroundColor=clubColors[0]
    divCard.appendChild(cardBody)
    divCard.appendChild(divFooter)
    
    grid.appendChild(divCard)
  }
  var header = document.getElementById("events-filter-clubs");
  var btns = header.getElementsByClassName("filter-button");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("filter-events active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    });
  }
  document.getElementById('eventspinner').setAttribute('hidden','true')
}

function loadEvents() {
  event.preventDefault();
  document.getElementById('eventspinner').removeAttribute('hidden','true')
  document.getElementById('eventsGrid').innerHTML=''
  getClubEvents()
  getEvents()
}











//dashboard page --> open dashboard, refresh, set tasks, approve tasks, get & set members, load & set members page, edit & delete hours on members page, onclick misc logs, load misc logs, update misc (+ client side update), delete misc (prompt, confirmed, client side), assign misc (onclick verify, set page, assign function, client side) get & set events, delete events (confirm, client side, prompt (future & past), edit events (prompt (future & past), load modal, client side), update create event modal (officers, types), create event (onclick, (style functions), client side) get & set attendees page, update logs from attendees page (updateLogs), update qr code, get setting values, edit settings, change colors, style functions, remove officer (onclick, confirm), remove sponsor (onclick, confirm), add sponsor & officer


function openDashboard(){
  $(".dashboardSpinner").removeAttr("hidden")

  if(localStorage.getItem('loaded')==='false'){
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateTasks).getTasks();
    getMembers();
    getClubEvents();
    getClubLog();
    localStorage.setItem('loaded', 'true');
  }
  else{
    $(".dashboardSpinner").attr("hidden", true)
  }
}

$('#dasboardModal').on('shown.bs.modal', function (e) {
  openDashboard()
})

function refreshDashboard() {
  $(".dashboardSpinner").removeAttr("hidden")
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateTasks).getTasks();
    getMembers();
    getClubEvents();
    getClubLog();
}

function updateTasks(data) {
  document.getElementById('taskSpinner').removeAttribute('hidden');
  var grid = document.getElementById('nav-tasks')
  grid.innerHTML=''
  
  for (var i = 0; i<data.length; i++) {
    var ID = data[i][0]
    var date = new Date(data[i][1])
    var user = data[i][2]
    var type = data[i][3]
    var previous = data[i][4]
    var newValue = data[i][5]
    var club = data[i][6]
    var approval = data[i][7]
    var name = getUserName(user)
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    
      var time = String(String(days[date.getDay()])+', '+String(months[date.getMonth()])+' '+String(date.getDate())+', '+String(date.getFullYear()))
      if (type == "First Name" || type == "Last Name" || type == "Graduation Year" || type == "Profile Picture") {
        var title = String(type+" Change")
        var body = String("New Value: "+newValue+", Initial Value: "+previous+".")
      }
      else if (type == "New Officer" || type == "New Sponsor") {
        var title = type+' for '+club
        var body = String(name+" added <i>"+getUserName(newValue)+"</i> to the <i>"+club+"</i> leadership team.")
      }
      else if (type == "Late Check-In") {
        var title = type
        var body = String(name+" checked in to <i>"+previous+"</i> for <i>"+club+"</i> after it had ended.")
      }
      else if (type == "Miscellaneous Check-In") {
        var title = type
        var body = String(name+" logged the following service on "+time+": "+club+' '+previous+". This log was not linked to an event.")
      }
    
      var divCard = document.createElement('div')
      divCard.setAttribute('id',ID)
      divCard.className="border border-info bg-light container-sm my-4"
      divCard.style.borderRadius="5px"
      
      var divTop = document.createElement('div')
      divTop.className="bg-light d-flex justify-content-start"
      
      var divLeft = document.createElement('div')
      divLeft.style.width='50%'
      
      var hTitle = document.createElement('h3')
      hTitle.className="text-dark text-left my-2"
      hTitle.innerHTML=title
      
      var hDate = document.createElement('h6')
      hDate.className="text-gray text-left my-2"
      hDate.innerHTML=time
      
      divCard.appendChild(divTop)
      divTop.appendChild(divLeft)
      divLeft.appendChild(hTitle)
      divLeft.appendChild(hDate)

            
      var divRight = document.createElement('div')
      divRight.className='py-2'
      divRight.style.width='44%'
      divRight.style.marginLeft='6%'
      
      
      if (type != "Profile Picture") {
        var h3 = document.createElement('h3')
        h3.className="text-info text-left"
        h3.innerHTML="User: " + name
        divRight.appendChild(h3)
        
        var h6 = document.createElement('h6')
        h6.className="text-info text-left"
        h6.innerHTML=body
        divRight.appendChild(h6)
      }
      else if (type == "Profile Picture") {
        var h3 = document.createElement('h3')
        h3.className="text-info text-left"
        h3.innerHTML="User: " + name
        divRight.appendChild(h3)
        
        var divImages = document.createElement('h6')
        divImages.className="text-info text-left"
        
        var divImage1 = document.createElement('div')
        divImage1.innerHTML="New: "
        divImage1.className='align-middle mx-2'
        divImage1.style.display='inline-block'
        divImages.appendChild(divImage1)
        
        var divImage2 = document.createElement('div')
        divImage2.className="image-200 align-middle mx-2"
        divImage2.style.display='inline-block'
        divImage2.style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+newValue+'")'
        divImages.appendChild(divImage2)
        
        var divImage3 = document.createElement('div')
        divImage3.className="align-middle mx-2"
        divImage3.style.display='inline-block'
        divImage3.innerHTML="Old: "
        divImages.appendChild(divImage3)
        
        if (previous == '') {
          previous = "1o5jNw9izcF7DeTm1r_J7S5TS3AEAet4a"
        }
        
        var divImage4 = document.createElement('div')
        divImage4.className="image-200 align-middle mx-2"
        divImage4.style.display='inline-block'
        divImage4.style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+previous+'")'
        divImages.appendChild(divImage4)
        
        divRight.appendChild(divImages)
      }
      
      divTop.appendChild(divRight)

      var buttons = document.createElement('div')
      buttons.className='btn-group d-flex justify-content-start taskContainer mb-3'
      
      divCard.appendChild(buttons)
      
      var denyButton = document.createElement('button')
      denyButton.setAttribute('type', 'button')
      denyButton.innerHTML="Deny"
      denyButton.className='btn btn-danger'
      denyButton.setAttribute('onclick','approveTask("Denied","'+ID+'")')
      
      var postponeButton = document.createElement('button')
      postponeButton.setAttribute('type', 'button')
      postponeButton.innerHTML="Postpone"
      postponeButton.className='btn btn-warning'
      postponeButton.setAttribute('onclick','approveTask("Postponed","'+ID+'")')
      
      var approveButton = document.createElement('button')
      approveButton.setAttribute('type', 'button')
      approveButton.innerHTML="Approve"
      approveButton.className='btn btn-success'
      approveButton.setAttribute('onclick','approveTask("Approved","'+ID+'")')
      
      buttons.appendChild(denyButton)
      buttons.appendChild(postponeButton)
      buttons.appendChild(approveButton)
      
      grid.appendChild(divCard)
      }
  //document.getElementById('tasksSpinner').setAttribute('hidden','true');
}

function approveTask(approval,ID) {
  document.getElementById(ID).remove();
  if (approval=="Approved" || approval=="Denied") {
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).approveTask(ID,approval)
  }
  else if (approval=="Postponed") {
    alert2("Task postponed")
  }
}

//for manage members
function getMembers() {
  document.getElementById('membersTable').innerHTML=''
  document.getElementById('membersTableSpinner').removeAttribute('hidden')
  var club = document.getElementById('membersClubs').value
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(setMembers).getClubMembers(club,'all')
}

//set members on dashboard
function setMembers(data2) {
  var data = data2[0]
  var nonmembers=data2[1]
  var membersTable = document.getElementById('membersTable')
  membersTable.innerHTML=''
  for (var i = 0; i<data.length; i++) {
    if (data[i][0] != '') {
      var row = document.createElement('tr')
      var td2 = document.createElement('td')
      td2.className='align-middle text-left'
      var td3 = document.createElement('td')
      td3.className='align-middle text-left'
      var td4 = document.createElement('td')
      td4.className="align-middle text-left"
      var td5 = document.createElement('td')
      td5.className="align-middle text-left"
      var td6 = document.createElement('td')
      td6.className="align-middle text-left"
      var button = document.createElement('button')
      button.className='btn btn-info'
      button.setAttribute('type','button')
      button.innerHTML = 'Manage Hours'
      button.setAttribute('data-target','#memberModal')
      button.setAttribute('data-toggle','modal')
      button.setAttribute('data-dismiss','modal')
      button.setAttribute('onclick',"getMembersPage('"+data[i][0]+"')")
      td6.appendChild(button)
      var div1 = document.createElement('div')
      div1.style.margin="0 auto"
      var div2 = document.createElement('div')
      div2.className="image-circle-50 rounded-circle"
      div2.style.margin="0 auto"
      var photo=getUserPhoto(data[i][0])
      div2.style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+photo+'")'
      div1.appendChild(div2)
      td2.appendChild(div1)
      var name = getUserName(data[i][0])
      td3.innerHTML=name
      td4.innerHTML=data[i][1]
      td5.innerHTML=data[i][2]
       
      row.appendChild(td2)
      row.appendChild(td3)
      row.appendChild(td4)
      row.appendChild(td5)
      row.appendChild(td6)
      membersTable.appendChild(row)
    }
  }
  document.getElementById('membersTableSpinner').setAttribute('hidden','true')
}


function getMembersPage(user){
  var data = []
  var sorted =[]
  var final = []
  var events = []
  var officership = officerships.split(',')
  var byClub = {}
  //console.log(officerLogData)
  for(var i=0; i<officerLogData.length; i++){
  //console.log("number " + i)
    if(officerLogData[i][3]==user){
      data.push(officerLogData[i]);
      if(officerships.indexOf(officerLogData[i][4])>-1){
        if(officerLogData[i][4] in byClub){
         byClub[officerLogData[i][4]]+=parseFloat(officerLogData[i][6]);
        }
        else{
         byClub[officerLogData[i][4]]=parseFloat(officerLogData[i][6]);
        }
      }
    }  
  }
  
  var users = splitString(<?=userData?>)
  for(var i=0; i<users.length; i++){
    if(users[i][0]==user){
      var clubs = users[i].slice(5);
    }
  }
  
  for(var i=0;i<clubs.length;i++){
    if(!(clubs[i] in byClub)){
      byClub[clubs[i]] = 0.0;
    }
  }
  
  for(var i=0; i<data.length; i++){
    sorted.push([new Date(data[i][1]).getTime(), data[i]])
  }
  
  sorted.sort().reverse();

  for(var i=0; i<sorted.length; i++){
    final.push(sorted[i][1])
  }
  
  loadMembersPage([byClub, final, clubs, user])
}

function loadMembersPage(data){
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
  var byClubHour = data[0]
  var logs = data[1]
  var clubs = data[2]
  var user = data[3]
  var memberLogTable = document.getElementById('memberLog')
  var memberHoursTable = document.getElementById('memberHours')
  memberLogTable.innerHTML = ''
  memberHoursTable.innerHTML = ''
  
  document.getElementById('memberPageName').innerHTML = getUserName(user)
    
  for(const [key, value] of Object.entries(byClubHour)){
    var row = document.createElement('tr');
    var td1 = document.createElement('td');
    td1.innerHTML = key;
    var td2 = document.createElement('td');
    td2.innerHTML = value;
    row.appendChild(td1) 
    row.appendChild(td2) 
    memberHoursTable.appendChild(row) 
  }
    
  for(var i=0; i<logs.length; i++){
    var id=logs[i][0]
    var event = getEventById(logs[i][2])
  
    var row = document.createElement('tr');
    row.id='row'+id
    
    var td1 = document.createElement('td');
    td1.innerHTML = logs[i][4];
    
    var time = new Date(event[1])
    var td2 = document.createElement('td');
    if(event!="Error: event not found"){
      td2.innerHTML = String(String(days[time.getDay()])+', '+String(months[time.getMonth()])+' '+String(time.getDate())+', '+String(time.getFullYear()));
    }
    else{
      td2.innerHTML = "N/A";
    }
    
    
    time = new Date(logs[i][1])
    var td3 = document.createElement('td');
    td3.innerHTML = String(String(days[time.getDay()])+', '+String(months[time.getMonth()])+' '+String(time.getDate())+', '+String(time.getFullYear()));
    var td4 = document.createElement('td');
    td4.innerHTML = event[5];
    if(td4.innerHTML==":"){
      td4.innerHTML="none"
    }
    var td5 = document.createElement('td');
    
    var formGroup = document.createElement('div')
    formGroup.className='form-group has-feedback'
    var hourinput = document.createElement('input')
    hourinput.className="form-control"
    hourinput.setAttribute('type','value')
    hourinput.value=logs[i][6]
    hourinput.id='hoursMember'+id
    hourinput.setAttribute('onchange','updateMemberHours("'+id+'","'+user+'")')
    var icon = document.createElement('span')
    icon.className="oi oi-pencil editspan"
    formGroup.appendChild(hourinput)
    formGroup.appendChild(icon)

    td5.appendChild(formGroup)
    
    var td6 = document.createElement('td');
    var span = document.createElement('span');
    span.innerHTML = "×"
    span.style.fontSize = '30px'
    span.className = 'memberPageClose'
    span.style.cursor = 'pointer'
    span.setAttribute('onclick', 'deleteMemberHours("'+id+'","'+user+'")')
    td6.appendChild(span)
    //row.appendChild(td1)
    row.appendChild(td1) 
    row.appendChild(td2) 
    row.appendChild(td3)
    row.appendChild(td4)
    row.appendChild(td5)
    row.appendChild(td6)
    memberLogTable.appendChild(row) 
  }
  document.getElementById('membersPageReload').setAttribute('onclick', 'alert2("Reloading..."); getMembersPage("'+user+'")')
  document.getElementById('addHoursHours').value=0
    
  var select = document.getElementById("addHoursClub")
  select.innerHTML = ''
  for(var i=0; i<clubs.length; i++){
    if(officerships.indexOf(clubs[i])>-1){
      var option = document.createElement('option')
      option.value = clubs[i]
      option.innerHTML = clubs[i]
      select.appendChild(option);
    }
  }
  loadAddHours(user)
}

// update details
function showAddHours(){
  if(document.getElementById('addHoursEvent').value == ''){
    $('.addHoursDetail').removeAttr('hidden')
    document.getElementById('addHoursHours').value=0
  }
  else{
    $('.addHoursDetail').attr('hidden', 'true')
    var event = getEventById(document.getElementById('addHoursEvent').value)
    document.getElementById('addHoursHours').value = event[6]
  }
}

//for close button
function deleteMemberHours(id, user){
  var row = document.getElementById("row"+id);
  row.style.display='none'
  for(var i=0; i<myLogData.length; i++){
    if(myLogData[i][0]==id){
      myLogData.splice(i,1)
    }
  }
  for(var i=0; i<officerLogData.length; i++){
    if(officerLogData[i][0]==id){
      officerLogData.splice(i,1)
      google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).deleteMemberLog(id);
      getMembersPage(user)
    }
  }
}

//for hours input
function updateMemberHours(id, user){
  for(var i=0; i<officerLogData.length; i++){
    if(officerLogData[i][0]==id){
      officerLogData[i][6] = document.getElementById("hoursMember"+id).value;
      google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).updateMemberLog(id, document.getElementById("hoursMember"+id).value);
      getMembersPage(user)
    }
  }
}

function loadAddHours(user){
  var clubName = document.getElementById("addHoursClub").value;
  var select = document.getElementById("addHoursEvent");
  var events = officerEventData[clubName];
  
  select.innerHTML=''
  var option = document.createElement('option')
  option.value = ""
  option.innerHTML = "Miscellaneous"
  select.appendChild(option);
  if(events!=null){
    for(var i=0; i<events.length; i++){
      var option = document.createElement('option')
      option.value = events[i][0]
      option.innerHTML = events[i][5]+"; "+ events[i][1].slice(0,-35)+"; "+events[i][6]+" hours";
      select.appendChild(option);
    }
  }
  document.getElementById('addHoursHours').value=0;
  $('#addHoursClub').attr('onchange','loadAddHours("'+user+'")')
  $('#membersPageCheckin').attr('onclick','checkinMemberPage("'+user+'")')
  $('.addHoursDetail').removeAttr('hidden')
}

//for add hours --> process id client side, pass through to server side
function checkinMemberPage(user){
  var alreadyLogged = false;
  if(document.getElementById('addHoursTime').value==''){
    alert2('Please enter a date and time.')
    return ''
  }
  var club = document.getElementById('addHoursClub').value;
  var hours = document.getElementById('addHoursHours').value;
  var id=document.getElementById('addHoursEvent').value;
  var activity=document.getElementById('addHoursActivity').value;
  if(id!=""){
    for(var i=0; i<officerLogData.length; i++){
      if(officerLogData[i][2]==id && officerLogData[i][3]===user && officerLogData[i][2]!= ""){
        if(hours != officerLogData[i][6]){
          officerLogData[i][6]=hours;
          officerLogData[i][5]=activity;
        }
        alreadyLogged = true;
      }
    }
    if(alreadyLogged){
      google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).checkinMembersPage(false,'','',id,user,club,activity,hours)
    }
    else{
      var time = new Date();
      var SubmitID = String(time.getTime())+user
      officerLogData.push([SubmitID, time.toString(), id, user, club, activity, hours])
      google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).checkinMembersPage(true,SubmitID,time.toString(),id,user,club,activity,hours)
    }
  }
  else{
    var now = new Date();
    var SubmitID = String(now.getTime())+user
    var time=document.getElementById('addHoursTime').value;
    officerLogData.push([SubmitID, time.toString(), id, user, club, activity, hours])
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).checkinMembersPage(true,SubmitID,time.toString(),id,user,club,activity,hours)
  }
}


function sortClubEvents(club){
  var result = []
  var dataArray = officerEventData[club];
  if (dataArray != null){
    for (var i = 0; i<dataArray.length;i++) {
      var date = (new Date(dataArray[i][1])).getTime()
      result.push([date,dataArray[i]])
    }
    result.sort().reverse()

    var final = []
    for(var i = 0; i<result.length; i++) {
      final.push(result[i][1])
    }
    //document.getElementById('testtitle').innerHTML = officerData
    //document.getElementById('testtitle2').innerHTML = final

  
    for (var i = 0; i<final.length; i++) {
      var id = final[i][0]
      var attendees = []
      for (var n = 0; n<officerLogData.length; n++) {
        if (officerLogData[n][2] == id) {
          attendees.push(new Array(officerLogData[n][3],officerLogData[n][6]))
        }
      }

      final[i][9]=attendees
      //document.getElementById('testtitle').innerHTML = final[8][9]
    }
    return final
  }
  else{
    return [];
  }
}


function getClubLog() {
  var club = document.getElementById('logClubs').value
  document.getElementById('logGrid').innerHTML=''
  document.getElementById('miscList').innerHTML=''
  document.getElementById('logspinner').removeAttribute('hidden')
  parseMiscLog(club)
  //google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateMiscLog).getOfficerLog(club)
  //google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(setAssignEvents).getClubEvents(club)
}


//return event list, misc logs, member w/ hours info
function parseMiscLog(club){
  if (String(officerships).indexOf(club)<0) {
    return "Error: officership not found"
  }
  else{
    var events = sortClubEvents(club)
    var misc = []
    for (var i = 0; i<officerLogData.length; i++) {
      if (officerLogData[i][4] == club && (String(events).indexOf(officerLogData[i][2])<0 || officerLogData[i][2] == '')) {
        misc.push([new Date(officerLogData[i][1]).getTime(),officerLogData[i]])
      }
    }
    misc = misc.sort().reverse()
    var misc2 = []
    for (var i = 0; i<misc.length; i++) {
      misc2.push(misc[i][1])
    }
    misc2 = makeStrings(misc2)
    //document.getElementById('testtitle').innerHTML = events
    updateMiscLog(misc2);
  }
}

function updateMiscLog(misc) {
  //document.getElementById('testtitle2').innerHTML = $('#logspinner').attr('hidden')
  //alert2("loading logs...");
  var now = new Date()
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
  var logGrid = document.getElementById('logGrid')
  logGrid.innerHTML=''
  if (misc.length==0) {
    var none = document.createElement('div')
    none.innerHTML="No submissions to display"
    logGrid.appendChild(none)
  }
  if (misc.length>0) {
    var miscList = document.getElementById('miscList')
    miscList.innerHTML=''
    for (var i = 0; i<misc.length; i++) {
      var id = misc[i][0]
      var time = new Date(misc[i][1])
      var user = misc[i][3]
      var activity = misc[i][5]
      var hours = misc[i][6]
      
      var misctr = document.createElement('tr')
      miscList.appendChild(misctr)
      misctr.id='row'+id
      var misctd1 = document.createElement('td')
      misctr.appendChild(misctd1)
      var misccheck = document.createElement('input')
      misctd1.className="align-middle text-left"
      misccheck.setAttribute('type','checkbox')
      misccheck.value=id
      misccheck.className='misccheckbox'
      misctd1.appendChild(misccheck)
      var misctd2 = document.createElement('td')
      misctd2.className="align-middle"
      var divpicture1 = document.createElement('div')
      var divpicture2 = document.createElement('div')
      divpicture2.className="image-circle-50 rounded-circle"
      var photo=getUserPhoto(user)
      divpicture2.style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+photo+'")'
      divpicture1.appendChild(divpicture2)
      misctd2.appendChild(divpicture1)
      misctr.appendChild(misctd2)
      var misctd3 = document.createElement('td')
      misctd3.className="text-left align-middle"
      misctd3.innerHTML=getUserName(user)
      misctr.appendChild(misctd3)
      var misctd6 = document.createElement('td')
      misctd6.className="text-left align-middle"
      misctd6.innerHTML=String(String(days[time.getDay()])+', '+String(months[time.getMonth()])+' '+String(time.getDate())+', '+String(time.getFullYear())+' | '+getTimeString(time,time,2)[0])
      misctd6.style.minWidth="100px"
      misctr.appendChild(misctd6)
      var misctd4 = document.createElement('td')
      misctd4.className="text-left"
      misctr.appendChild(misctd4)
      var formGroup = document.createElement('div')
      formGroup.className='form-group has-feedback'
      var hourinput = document.createElement('input')
      hourinput.className="form-control"
      hourinput.setAttribute('type','value')
      hourinput.value=hours
      hourinput.id='hours'+id
      hourinput.setAttribute('onchange','updateMisc("Officer","'+id+'")')
      var icon = document.createElement('span')
      icon.className="oi oi-pencil editspan"
      formGroup.appendChild(hourinput)
      formGroup.appendChild(icon)
      
      misctd4.appendChild(formGroup)
      var misctd5 = document.createElement('td')
      misctr.appendChild(misctd5)
      misctd5.className="text-left"
      var activityinput = document.createElement('select')
      activityinput.className="form-control"
      activityinput.id='activity'+id
      activityinput.setAttribute('onchange','updateMisc("Officer","'+id+'")')
      misctd5.appendChild(activityinput)
      var option1 = document.createElement('option')
      option1.innerHTML="Meeting"
      activityinput.appendChild(option1)
      var option2 = document.createElement('option')
      option2.innerHTML="Service Activity"
      activityinput.appendChild(option2)
      var option3 = document.createElement('option')
      option3.innerHTML="Other"
      activityinput.appendChild(option3)
      activityinput.value=activity
      
    }
  }
  
    //$('.tag').attr("hidden","true");
    //$('#tasks').removeAttr("hidden");
    //$('#tasksnav').addClass('uk-active');
    //$('.tab-pane').removeAttr("hidden");
    document.getElementById('logspinner').setAttribute('hidden','true')
}

//from misc page in dashboard
function updateMiscClientSide(data){
  for(var i=0; i<officerLogData.length; i++){
    for(var n=0; n<data.length; n++){
      if(officerLogData[i][0]==data[n][0]){
        officerLogData[i][6] = data[n][1];
        officerLogData[i][5] = data[n][2];
      }
    }
  }
  for(var i=0; i<myLogData.length; i++){
    for(var n=0; n<data.length; n++){
      if(myLogData[i][0]==data[n][0]){
        myLogData[i][6] = data[n][1];
        myLogData[i][5] = data[n][2];
      }
    }
  }
  if(data.length>0){
    showToast("Logs updated");
  }
  else{
    showToast("No logs updated");
  }
}

function updateMisc(mode,id) {
  if (mode == "Officer") {
    var hours = document.getElementById('hours'+id).value
    var activity = document.getElementById('activity'+id).value
    if (activity == "Meeting" && hours != 0) {
      alert2('Error: hours are not available for meetings')
    }
    else {
      google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateMiscClientSide).updateMisc(id,hours,activity)
    }
  }
}

function deleteMiscConfirmed(){
  var checkbox = document.getElementsByClassName('misccheckbox')
  var ids = []
  for (var i = 0; i<checkbox.length; i++) {
    if (checkbox[i].checked==true) {
      ids.push([checkbox[i].value])
      document.getElementById('row'+checkbox[i].value).setAttribute('hidden','true')
    }
  }
  var row = 0;
  for(var i=0; i<officerLogData.length; i++){
    if(ids.indexOf(officerLogData[i][0])>-1){
      officerLogData.splice(row,1)
    }
    else{
      row+=1;
    }
  }
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).deleteMisc(ids);
}

function deleteMisc() {
  var checkbox = document.getElementsByClassName('misccheckbox')
  var ids = []
  for (var i = 0; i<checkbox.length; i++) {
    if (checkbox[i].checked==true) {
      ids.push([checkbox[i].value])
    }
  }
  if (ids.length == 0) {
    alert2("Please select a submission")
  }
  else {
    if (ids.length == 1) {
      var message = "Are you sure you want to delete the selected submission?"
    }
    else {
      var message = "Are you sure you want to delete the "+ids.length+" selected submissions?"
    }
    $('#confirmMessageModalText').html(message)
    $('#confirmMessageModal').modal('show')
    document.getElementById('confirmMessageCancel').setAttribute('data-target', '#dasboardModal'); 
    document.getElementById('clubReference').innerHTML=club
    document.getElementById('confirmMessageButton').setAttribute('onclick', 'deleteMiscConfirmed()');
  }
}

function assignMiscClientSide(data){
  if(data.indexOf("Error:")<0){
    for(var i=0; i<officerLogData.length; i++){
      for(var n=0; n<data.length; n++){
        if(officerLogData[i][0]==data[n][0]){
          officerLogData[i][2] = data[n][1];
          officerLogData[i][4] = data[n][2];
          officerLogData[i][5] = data[n][3];
          officerLogData[i][6] = data[n][4];
        }
      }
    }
    for(var i=0; i<myLogData.length; i++){
      for(var n=0; n<data.length; n++){
        if(myLogData[i][0]==data[n][0]){
          myLogData[i][2] = data[n][1];
          myLogData[i][4] = data[n][2];
          myLogData[i][5] = data[n][3];
          myLogData[i][6] = data[n][4];
        }
      }
    }
    showToast("Logs updated"); 
  }
  else{
    showToast(data);
  }
}

function loadAssignModal() {
  var elements=document.getElementsByClassName('misccheckbox')
  var ids = []
  for (var i = 0; i<elements.length; i++) {
    if (elements[i].checked==true) {
      ids.push([elements[i].value])
    }
  }
  if (ids.length == 0) {
    alert2('Please select a submission')
  }
  else {
    document.getElementById('assignedEvents').innerHTML=String(ids)
    $('#assignEventModal').modal('show')
    var club = document.getElementById('logClubs').value
    setAssignEvents(club)
  }
}

function setAssignEvents(club) {
  document.getElementById('assignEventSpinner').removeAttribute('hidden')
  var data = sortClubEvents(club);
  var now = new Date()
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
  var assignOptions = document.getElementById('assignEvent')
  assignOptions.innerHTML=''
  for (var i = 0; i<data.length; i++) {
    var startTime = new Date(data[i][1])
    if (startTime.getTime()-900000<now.getTime()) {
      var option = document.createElement('option')
      option.value=data[i][0]
      option.innerHTML=data[i][5]+"; "+String(days[startTime.getDay()])+', '+String(months[startTime.getMonth()])+' '+String(startTime.getDate())
      assignOptions.appendChild(option)
    }
  }
  document.getElementById('assignEventSpinner').setAttribute('hidden', 'true')
}

function assignEvents(ids) {
  var events = document.getElementById('assignedEvents').innerHTML
  var ids = events.split(',')
  var event = document.getElementById('assignEvent').value
  if (event == null) {
    alert2('No event chosen')
  }
  else {
    $('#assignEventModal').modal('hide')
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(assignMiscClientSide).addMiscToEvent(event,ids)
  }
}


function getClubEvents() {
  var club = document.getElementById('eventsClubs').value
  document.getElementById('eventsTable').innerHTML=''
  document.getElementById('eventsTable2').innerHTML=''
  document.getElementById('pastSpinner').removeAttribute('hidden')
  document.getElementById('futureSpinner').removeAttribute('hidden')
  getClubEventsData(club)
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateNewEventModal2).getClubOfficerData()
  document.getElementById('editEventClub').value = club
  updateNewEventTypes();
}

function getClubEventsData(club) {
  var data = officerEventData[club]
  var result1 = []
  console.log("data "+data)
  for (var i = 0; i<data.length;i++) {
    if (data[i][3] == club) {
      var date = (new Date(data[i][1])).getTime()
      result1.push([date,data[i]])
    }
  }
  result1.sort()
  var result2 = []
  for(var i = 0; i<result1.length; i++) {
    result2.push(result1[i][1])
  }
  setClubEvents(makeStrings(result2))
}


function setClubEvents(data) {
  var club = document.getElementById('eventsClubs').value
  var table = document.getElementById('eventsTable')
  var table2 = document.getElementById('eventsTable2')
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
  var now = new Date()
  
  for (var i = 0; i<data.length; i++) {
    var endTime = new Date(data[i][2])
    var startTime = new Date(data[i][1])

    if (now.getTime()<endTime.getTime()) {
      var tr = document.createElement('tr')
      tr.id='clubevent'+data[i][0]
      var td1 = document.createElement('td')
      td1.className='align-middle'
      var checkbox = document.createElement('input')
      checkbox.className="eventCheckbox"
      checkbox.setAttribute('type','checkbox')
      checkbox.value=data[i][0]
      td1.appendChild(checkbox)
    
      var startTime = new Date(data[i][1])
      var date = String(days[startTime.getDay()])+', '+String(months[startTime.getMonth()])+' '+String(startTime.getDate())
      var td2 = document.createElement('td')
      td2.className='align-middle text-left'
      td2.innerHTML=date
    
      var time = getTimeString(startTime,endTime,2)
      var td3 = document.createElement('td')
      td3.className='align-middle text-left'
      td3.innerHTML=time[0]
      var td4 = document.createElement('td')
      td4.className='align-middle text-left'
      td4.innerHTML=time[1]
    
      var td5 = document.createElement('td')
      td5.className='align-middle text-left'
      td5.innerHTML=data[i][5]
      var td6 = document.createElement('td')
      td6.className='align-middle text-left'
      td6.innerHTML=data[i][8]
      var td7 = document.createElement('td')
      td7.className='align-middle text-left'
      td7.innerHTML=data[i][4]
      var td8 = document.createElement('td')
      td8.className='align-middle text-left'
      td8.innerHTML=data[i][6]
      var td10 = document.createElement('td')
      td10.className='align-middle text-left'
      td10.innerHTML=getUserName(data[i][9])
      var td11 = document.createElement('td')
      td11.className='align-middle text-left'
      var button = document.createElement('button')
      button.className='btn btn-info'
      button.setAttribute('type','button')
      button.innerHTML = 'Attendees'
      button.setAttribute('data-target','#attendeeModal')
      button.setAttribute('data-toggle','modal')
      button.setAttribute('data-dismiss','modal')
      button.setAttribute('onclick',"getAttendeesPage('"+data[i][0]+"')")
      td11.appendChild(button)
    
      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      tr.appendChild(td4)
      tr.appendChild(td5)
      tr.appendChild(td6)
      tr.appendChild(td7)
      tr.appendChild(td8)
      tr.appendChild(td10)
      tr.appendChild(td11)
      table.appendChild(tr)
    }
    else {
      var tr = document.createElement('tr')
      tr.id='clubevent'+data[i][0]
      var td1 = document.createElement('td')
      td1.className='align-middle'
      var checkbox = document.createElement('input')
      checkbox.className="eventCheckbox2"
      checkbox.setAttribute('type','checkbox')
      checkbox.value=data[i][0]
      td1.appendChild(checkbox)
    
      var startTime = new Date(data[i][1])
      var date = String(days[startTime.getDay()])+', '+String(months[startTime.getMonth()])+' '+String(startTime.getDate())
      var td2 = document.createElement('td')
      td2.className='align-middle text-left'
      td2.innerHTML=date
    
      var time = getTimeString(startTime,endTime,2)
      var td3 = document.createElement('td')
      td3.className='align-middle text-left'
      td3.innerHTML=time[0]
      var td4 = document.createElement('td')
      td4.className='align-middle text-left'
      td4.innerHTML=time[1]
    
      var td5 = document.createElement('td')
      td5.className='align-middle text-left'
      td5.innerHTML=data[i][5]
      var td6 = document.createElement('td')
      td6.className='align-middle text-left'
      td6.innerHTML=data[i][8]
      var td11 = document.createElement('td')
      td11.className='align-middle text-left'
      td11.innerHTML=data[i][10]
      var td7 = document.createElement('td')
      td7.className='align-middle text-left'
      td7.innerHTML=data[i][4]
      var td8 = document.createElement('td')
      td8.className='align-middle text-left'
      td8.innerHTML=data[i][6]
      var td10 = document.createElement('td')
      td10.className='align-middle text-left'
      td10.innerHTML=getUserName(data[i][9])
      var td11 = document.createElement('td')
      td11.className='align-middle text-left'
      var button = document.createElement('button')
      button.className='btn btn-info'
      button.setAttribute('type','button')
      button.innerHTML = 'Attendees'
      button.setAttribute('data-target','#attendeeModal')
      button.setAttribute('data-toggle','modal')
      button.setAttribute('data-dismiss','modal')
      button.setAttribute('onclick',"getAttendeesPage('"+data[i][0]+"')")
      td11.appendChild(button)
    
      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      tr.appendChild(td4)
      tr.appendChild(td5)
      tr.appendChild(td6)
      tr.appendChild(td11)
      tr.appendChild(td7)
      tr.appendChild(td8)
      tr.appendChild(td10)
      tr.appendChild(td11)
      table2.appendChild(tr)
    }
  }
  document.getElementById('futureSpinner').setAttribute('hidden','true')
  document.getElementById('pastSpinner').setAttribute('hidden','true') 
}

function deleteEventConfirm(mode){
  if(mode=='past'){
    var elements = document.getElementsByClassName('eventCheckbox2')
  }
  else if(mode=='future'){
    var elements = document.getElementsByClassName('eventCheckbox')
  }
  var events = []
  for (var i = 0; i<elements.length; i++) {
    if (elements[i].checked==true) {
      events.push([elements[i].value])
      document.getElementById('clubevent'+elements[i].value).setAttribute('hidden','true')
    }
  }
  
  for(var i=0; i<events.length; i++){
    var event = getEventById(events[i]);
    var club = event[3]
    var dataArray = officerEventData[club]
    
    for(var n=0; n<dataArray.length; n++){
      if(dataArray[n][0]==events[i]){
        dataArray.splice(n,1);
      }
    }
    
    for(var m=0; m<officerLogData.length; m++){
      if(officerLogData[m][2]==events[i]){
        officerLogData.splice(m,1);
      }
    }
  }
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).deleteEvents(events);
}
 
 //delete from dashboard
function deleteEvents() {
  $('#dasboardModal').modal('hide')
  var elements = document.getElementsByClassName('eventCheckbox')
  var events = []
  for (var i = 0; i<elements.length; i++) {
    if (elements[i].checked==true) {
      events.push([elements[i].value])
    }
  }
  if (events.length == 1) {
    var message = "Are you sure you want to remove the "+events.length+" selected event?"
  }
  else {
    var message = "Are you sure you want to remove the "+events.length+" selected events?"
  }
  document.getElementById('confirmMessageButton').setAttribute('onclick', 'deleteEventConfirm("future")')
  document.getElementById('confirmMessageCancel').setAttribute('data-target', '#dasboardModal'); 
  $('#confirmMessageModalText').html(message)
  $('#confirmMessageModal').modal('show')
}


function deleteEvents2() {
  $('#dasboardModal').modal('hide')
  var elements = document.getElementsByClassName('eventCheckbox2')
  var events = []
  for (var i = 0; i<elements.length; i++) {
    if (elements[i].checked==true) {
      events.push([elements[i].value])
    }
  }
  if (events.length == 1) {
    var message = "Are you sure you want to remove the "+events.length+" selected event?"
  }
  else {
    var message = "Are you sure you want to remove the "+events.length+" selected events?"
  }
  document.getElementById('confirmMessageButton').setAttribute('onclick', 'deleteEventConfirm("past")')
  document.getElementById('confirmMessageCancel').setAttribute('data-target', '#dasboardModal'); 
  $('#confirmMessageModalText').html(message)
  $('#confirmMessageModal').modal('show')
}


//from clicking button
function editEvents() {
   var elements = document.getElementsByClassName('eventCheckbox')
   var events = []
   for (var i = 0; i<elements.length; i++) {
     if (elements[i].checked==true) {
       events.push([elements[i].value])
     }
   }
   if (events.length != 1) {
     alert2("Error: must select one event")
   }
   else {
     document.getElementById('editEventID').innerHTML=String(events[0])
     document.getElementById('editEventSpinner').removeAttribute('hidden')
     google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(editEventsModal).getEventById(events[0])
     var modal = document.getElementById('editModal');
     $('#dasboardModal').modal('hide')
     $(modal).modal('show')
   }
}
function editEvents2() {
   var elements = document.getElementsByClassName('eventCheckbox2')
   var events = []
   for (var i = 0; i<elements.length; i++) {
     if (elements[i].checked==true) {
       events.push([elements[i].value])
     }
   }
   if (events.length != 1) {
     alert2("Error: must select one event")
   }
   else {
     document.getElementById('editEventID').innerHTML=String(events[0])
     document.getElementById('editEventSpinner').removeAttribute('hidden')
     google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(editEventsModal).getEventById(events[0])
     var modal = document.getElementById('editModal');
     $('#dasboardModal').modal('hide')
     $(modal).modal('show')
   }
}
     
function editEventsModal(event) {
  if (event == "Error: event not found") {
    alert2("Error: event not found")
    $('#editModal').modal('hide')
  }
  else {
    document.getElementById('editEventName').value=event[5]
    
    var startTime = new Date(event[1])
    if (startTime.getMonth()+1 < 10) {var month = "0"+String(startTime.getMonth()+1);}
    else {var month = startTime.getMonth()+1;}
    if (startTime.getDate() < 10) {var date = "0"+String(startTime.getDate());}
    else {var date = startTime.getDate();}
    if (startTime.getHours() < 10) {var hours1 = "0"+String(startTime.getHours());}
    else {var hours1 = startTime.getHours();}
    if (startTime.getMinutes() < 10) {var minutes1 = "0"+String(startTime.getMinutes());}
    else {var minutes1 = startTime.getMinutes();}
    document.getElementById('editEventStartTime').value = hours1+':'+minutes1
    document.getElementById('editEventDate').value=startTime.getFullYear()+"-"+month+'-'+date
    
    var endTime = new Date(event[2])
    if (endTime.getHours() < 10) {var hours2 = "0"+String(endTime.getHours());}
    else {var hours2 = endTime.getHours();}
    if (endTime.getMinutes() < 10) {var minutes2 = "0"+String(endTime.getMinutes());}
    else {var minutes2 = endTime.getMinutes();}
    document.getElementById('editEventEndTime').value = hours2+':'+minutes2
    document.getElementById('editEventType').value=event[8]
    document.getElementById('editEventActivity').value=event[4]
    var officers = document.getElementById('editEventOfficer').children
    for (var i = 0; i<officers.length;i++) {
      if (officers[i].value == event[9]) {
        officers[i].selected=true
      }
    }
    document.getElementById('editEventLocation').value=event[7]
    document.getElementById('editEventSpinner').setAttribute('hidden','true')
  }
}

function editEvent() {
  
  var id = document.getElementById('editEventID').innerHTML
  var name = document.getElementById('editEventName').value
  var date = document.getElementById('editEventDate').value
  var startTime = new Date(date+' '+document.getElementById('editEventStartTime').value)
  var endTime = new Date(date+' '+document.getElementById('editEventEndTime').value)
  var type = document.getElementById('editEventType').value
  var activity = document.getElementById('editEventActivity').value
  var officer = document.getElementById('editEventOfficer').value
  var location = document.getElementById('editEventLocation').value
  var repeated = document.getElementById('editEventCopy').checked
  if (String(new Date(date)) == 'Invalid Date') {
    alert2('Error: invalid date')
  }
  else if (startTime.getTime()>endTime.getTime() || document.getElementById('editEventStartTime').value == '' || document.getElementById('editEventEndTime').value == '') {
    alert2('Error: invalid event times')
  }
  else if (name == '') {
    alert2('Error: invalid event name')
  }
  else {
  var event = getEventById(id)
  if (event == "Error: event not found") {
    return event
  }
  else {
    var hours = Math.round(100*(((new Date(endTime)).getTime()-(new Date(startTime)).getTime())/3600000))/100
    if (hours<=0) {
       alert2("Error: invalid times")
    }
    if (activity == "Meeting") {
      hours=0
    }
    var club = event[3]
    var startOffset = (new Date(startTime)).getTime()-(new Date(event[1])).getTime()
    var endOffset = (new Date(endTime)).getTime()-(new Date(event[2])).getTime()
    var dataArray = officerEventData[club]
    

    
    for (var i = 0; i<dataArray.length; i++) {
      if (dataArray[i][0] == id) {
        dataArray[i][1] = new Date(startTime).toString()
        dataArray[i][2] = new Date(endTime).toString()
        dataArray[i][4] = activity
        dataArray[i][5] = name
        dataArray[i][6] = hours
        dataArray[i][7] = location
        dataArray[i][8] = type
        dataArray[i][9] = officer
        
        for (var n = 0; n<officerLogData.length; n++) {
          if (officerLogData[n][2] == id) {
            officerLogData[n][5]=activity
            officerLogData[n][6]=hours
          }
        }
      }
    }
    
    for (var i = 0; i<myEventData.length; i++) {
      if (myEventData[i][0] == id) {
        myEventData[i][1] = new Date(startTime).toString()
        myEventData[i][2] = new Date(endTime).toString()
        myEventData[i][4] = activity
        myEventData[i][5] = name
        myEventData[i][6] = hours
        myEventData[i][7] = location
        myEventData[i][8] = type
        myEventData[i][9] = officer
        
        for (var n = 0; n<myLogData.length; n++) {
          if (myLogData[n][2] == id) {
            myLogData[n][5]=activity
            myLogData[n][6]=hours
          }
        }
      }
    }
    
    if (repeated==true) {
      var id2 = id.split('-')
      var generalID = id2[0]
      var oldTime = new Date(event[2])
      for (var i = 0; i<dataArray.length; i++) {
        if (String(dataArray[i][0]).indexOf(generalID)>-1) {
          var startTime2 = new Date(dataArray[i][1])
          var endTime2 = new Date(dataArray[i][2])
          if (endTime2.getTime()>oldTime.getTime() && dataArray[i][0] != id) {
            var newStart = new Date(startTime2.getTime()+startOffset)
            var newEnd = new Date(endTime2.getTime()+endOffset)
            var newHours = Math.round(100*(((new Date(newEnd)).getTime()-(new Date(newStart)).getTime())/3600000))/100
            if (activity == "Meeting") {
              newHours=0
            }
            
            dataArray[i][1] = newStart.toString()
            dataArray[i][2] = newEnd.toString()
            dataArray[i][4] = activity
            dataArray[i][5] = name
            dataArray[i][6] = newHours
            dataArray[i][7] = location
            dataArray[i][8] = type
            dataArray[i][9] = officer
            
            for (var n = 0; n<officerLogData.length; n++) {
              if (officerLogData[n][2] == dataArray[i][0]) {
                officerLogData[n][5]=activity
                officerLogData[n][6]=newHours
              }
            }
          }
        }
      }
    }
    
    
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).editEvents(id,String(startTime),String(endTime),name,activity,location,officer,type,repeated)
    var modal = document.getElementById('editModal');
    $(modal).modal('show')
    }
  }
}


function updateNewEventOfficers() {
  document.getElementById('eventOfficerSpinner').removeAttribute("hidden")
  document.getElementById('newEventOfficer').innerHTML=''
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateNewEventModal2).getClubOfficerData()
  updateNewEventTypes()
}


function updateNewEventModal2(clubs) {
  var club = document.getElementById('newEventClub').value
  var club2 = document.getElementById('editEventClub').value
  for (var i = 0; i<clubs.length;i++) {
    if (clubs[i][0] == club) {
      var officers = String(clubs[i][2]).split(',')
    }
  }
  var select = document.getElementById('newEventOfficer')
  select.innerHTML=''
  for (var i = 0; i<officers.length; i++) {
    var option = document.createElement('option')
    option.value=officers[i]
    option.innerHTML=getUserName(officers[i])
    select.appendChild(option)
  }
  for (var i = 0; i<clubs.length;i++) {
    if (clubs[i][0] == club2) {
      var officers2 = String(clubs[i][2]).split(',')
    }
  }
  var select = document.getElementById('editEventOfficer')
  select.innerHTML=''
  for (var i = 0; i<officers2.length; i++) {
    var option = document.createElement('option')
    option.value=officers2[i]
    option.innerHTML=getUserName(officers2[i])
    select.appendChild(option)
  }
  document.getElementById('eventOfficerSpinner').setAttribute("hidden", 'true')
}

function updateNewEventTypes() {
  var datalist = document.getElementById('types')
  var datalist2 = document.getElementById('types2')
  var club = document.getElementById('newEventClub').value
  var array1 = officerEventData[club]
  var club2 = document.getElementById('editEventClub').value
  var array2 = officerEventData[club2]
  datalist.innerHTML=''
  datalist2.innerHTML=''
  var options = []
  var options2 = []
  
  for (var i = 0; i<array1.length;i++) {
    if (String(options).indexOf(array1[i][8])<0 && array1[i][3] == club) {
      options.push([array1[i][8]])
      var option = document.createElement('option')
      option.value=array1[i][8]
      datalist.appendChild(option)
    }
  }
  for (var i = 0; i<array2.length;i++) {
    if (String(options2).indexOf(array2[i][8])<0 && array2[i][3] == club2) {
      options2.push([array2[i][8]])
      var option = document.createElement('option')
      option.value=array2[i][8]
      datalist2.appendChild(option)
    }
  }
}

function newEvent() {
  var club = document.getElementById('newEventClub').value
  var name = document.getElementById('newEventName').value
  var activity = document.getElementById('newEventActivity').value
  var date = document.getElementById('newEventDate').value
  var start = document.getElementById('newEventStartTime').value
  var end = document.getElementById('newEventEndTime').value
  var location = document.getElementById('newEventLocation').value
  var type = document.getElementById('newEventType').value
  var officer = document.getElementById('newEventOfficer').value
  var repeat = document.getElementById('newEventRepeat').value
  var startTime = new Date(date+' '+start)
  var endTime = new Date(date+' '+end)
  if (String(startTime)=='Invalid Date' || String(startTime)=='Invalid Date' || start == '' || end == '') {
    alert2('Error: invalid date')
    return ''
  }
  if (repeat != "never") {
    var endRepeat = new Date(document.getElementById('newEventEndRepeat').value+' '+end)
    if (endRepeat.getTime()<endTime.getTime() || String(new Date(document.getElementById('newEventEndRepeat').value)) == 'Invalid Date') {
      alert2('Error: invalid repeat date')
      return ''
    }
  }
  else {
    var endRepeat = ''
  }
  if (startTime.getTime()>endTime.getTime()) {
    alert2('Error: invalid event times')
  }
  else if (name == '') {
    alert2('Error: invalid event name')
  }
  else {
    $('#createModal').modal('hide')
    google.script.run.withSuccessHandler(eventsCreatedClientSide).withFailureHandler(scriptFailure).createEvent(String(startTime),String(endTime),club,activity,name,location,type,officer,repeat,String(endRepeat))
  }
}


function showRepeats() {
  var repeats = document.getElementById('newEventRepeat').value
  if (repeats == "never") {
    document.getElementById("newEventEndRepeatLabel").setAttribute('hidden','true')
    document.getElementById("newEventEndRepeat").setAttribute('hidden','true')
  }
  else {
    document.getElementById("newEventEndRepeatLabel").removeAttribute('hidden')
    document.getElementById("newEventEndRepeat").removeAttribute('hidden')
  }
}


//update created events on client side 
function eventsCreatedClientSide(data){
  var message = data[0]
  var created = data[1]
  var club = data[1][0][3]
  for(var i=0; i<created.length; i++){
    officerEventData[club].push(created[i]);
    myEventData.push(created[i]);
  }
  showToast(message);
}

function getAttendeesPage(id){
  var event = getEventById(id);
  var attendees = []
  for (var n = 0; n<officerLogData.length; n++) {
    if (officerLogData[n][2] == id) {
      attendees.push([officerLogData[n][3],officerLogData[n][6]])
    }
  }
  
  setAttendeesPage([event, attendees]);
}

function setAttendeesPage(data){
  var logGrid = document.getElementById('logGrid')
  logGrid.innerHTML=''
  var event = data[0]
  var now = new Date()
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
  var members=officerMembers[event[3]]
    var startTime = new Date(event[1])
      var id = event[0]
      var endTime = new Date(event[2])
      var activity = event[4]
      var name = event[5]
      var hours = event[6]
      var type = event[7]
      var officer = event[8]
      var attendees = data[1]
      
      var div1 = document.createElement('div')
      var card1 = document.createElement('div')
      div1.appendChild(card1)
      var body1 = document.createElement('div')
      card1.appendChild(body1)
      
      
      var table = document.createElement('table')
      table.className="table"
      body1.appendChild(table)
      var thead = document.createElement('thead')
      var tr = document.createElement('tr')
      thead.appendChild(tr)
      var th1 = document.createElement('th')
      th1.setAttribute('scope', 'col')
      th1.innerHTML="Name"
      tr.appendChild(th1)
      var th2 = document.createElement('th')
      th2.setAttribute('scope', 'col')
      th2.innerHTML="Time"
      tr.appendChild(th2)
      var th3 = document.createElement('th')
      th3.setAttribute('scope', 'col')
      th3.innerHTML="Attendees"
      tr.appendChild(th3)
      var th4 = document.createElement('th')
      th4.setAttribute('scope', 'col')
      th4.innerHTML="Type"
      tr.appendChild(th4)
      var th5 = document.createElement('th')
      th5.setAttribute('scope', 'col')
      th5.innerHTML="Activity"
      tr.appendChild(th5)
      var th6 = document.createElement('th')
      th6.setAttribute('scope', 'col')
      th6.innerHTML="Hours"
      tr.appendChild(th6)
      var tbody = document.createElement('tbody')
      var tr2 = document.createElement('tr')
      tbody.appendChild(tr2)
      var td1 = document.createElement('td')
      td1.innerHTML=name
      tr2.appendChild(td1)
      var td2 = document.createElement('td')
      td2.innerHTML=String(String(days[startTime.getDay()])+', '+String(months[startTime.getMonth()])+' '+String(startTime.getDate())+', '+String(startTime.getFullYear())+' | '+getTimeString(startTime,endTime,1))
      tr2.appendChild(td2)
      var td3 = document.createElement('td')
      td3.innerHTML=attendees.length
      td3.id="attendees"+id
      tr2.appendChild(td3)
      var td4 = document.createElement('td')
      td4.innerHTML=type
      tr2.appendChild(td4)
      var td5 = document.createElement('td')
      td5.innerHTML=activity
      tr2.appendChild(td5)
      var td6 = document.createElement('td')
      td6.innerHTML=hours
      td6.id=id+'hours'
      tr2.appendChild(td6)
      table.appendChild(thead)
      table.appendChild(tbody)
      
      var div2 = document.createElement('div')
      body1.appendChild(div2)
      var table2 = document.createElement('table')
      table2.className="table"
      table2.id='table'+id
      div2.appendChild(table2)
      var thead2 = document.createElement('thead')
      table2.appendChild(thead2)
      var tr3 = document.createElement('tr')
      thead2.appendChild(tr3)
      var th8 = document.createElement('th')
      th8.className="text-left align-middle"
      th8.innerHTML = "Attendance"
      thead2.appendChild(th8)
      var th9 = document.createElement('th')
      th9.className="text-left align-middle"
      th9.innerHTML="Photo"
      thead2.appendChild(th9)
      var th10 = document.createElement('th')
      th10.className="text-left align-middle"
      th10.innerHTML="Name"
      thead2.appendChild(th10)
      if (activity!="Meeting") {
        var th11 = document.createElement('th')
        th11.className="text-left align-middle"
        th11.innerHTML="Hours"
        thead2.appendChild(th11)
      }
      var tbody2 = document.createElement('tbody')
      table2.appendChild(tbody2)
      
      for (var n = 0; n<attendees.length; n++) {
        var tr3 = document.createElement('tr')
        var td1 = document.createElement('td')
        td1.className="align-middle"
        tr3.appendChild(td1)
        var checkbox = document.createElement('input')
        checkbox.className="align-middle checkbox"+id
        checkbox.setAttribute('type','checkbox')
        checkbox.setAttribute('onchange','updateLog("'+id+'")')
        checkbox.setAttribute('checked','true')
        checkbox.value=attendees[n][0]
        td1.appendChild(checkbox)
        var td2 = document.createElement('td')
        td2.className="text-left align-middle"
        var divpicture1 = document.createElement('div')
        divpicture1.className="text-left align-middle"
        var divpicture2 = document.createElement('div')
        divpicture2.className="image-circle-50 rounded-circle"
        var photo=getUserPhoto(attendees[n][0])
        divpicture2.style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+photo+'")'
        divpicture1.appendChild(divpicture2)
        td2.appendChild(divpicture1)
        tr3.appendChild(td2)
        var td3 = document.createElement('td')
        td3.className="text-left align-middle"
        td3.innerHTML=getUserName(attendees[n][0])
        tr3.appendChild(td3)
        if (activity!="Meeting") {
          var td4 = document.createElement('td')
          td4.className="text-left align-middle"
          tr3.appendChild(td4)
          var hourinput = document.createElement('input')
          hourinput.className="align-middle form-control hours"+id
          hourinput.setAttribute('type','value')
          hourinput.value=attendees[n][1]
          hourinput.id=members[n]+id
          hourinput.setAttribute('onchange','updateLog("'+id+'")')
          td4.appendChild(hourinput)
        }
        tbody2.appendChild(tr3)
      }
      
      for (var n = 0; n<members.length; n++) {
        if (String(attendees).indexOf(members[n][0])<0) {
          var tr3 = document.createElement('tr')
          var td1 = document.createElement('td')
          td1.className="align-middle"
          tr3.appendChild(td1)
          var checkbox = document.createElement('input')
          checkbox.className="align-middle checkbox"+id
          checkbox.setAttribute('type','checkbox')
          checkbox.setAttribute('onchange','updateLog("'+id+'")')
          checkbox.value=members[n][0]
          td1.appendChild(checkbox)
          var td2 = document.createElement('td')
          td2.className="text-left align-middle"
          var divpicture1 = document.createElement('div')
          divpicture1.className="text-left align-middle"
          var divpicture2 = document.createElement('div')
          divpicture2.className="image-circle-50 rounded-circle"
          var photo=getUserPhoto(members[n][0])
          divpicture2.style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+photo+'")'
          divpicture1.appendChild(divpicture2)
          td2.appendChild(divpicture1)
          tr3.appendChild(td2)
          var td3 = document.createElement('td')
          td3.className="text-left align-middle"
          td3.innerHTML=getUserName(members[n][0])
          tr3.appendChild(td3)
          if (activity!="Meeting") {
            var td4 = document.createElement('td')
            td4.className="text-left align-middle"
            tr3.appendChild(td4)
            var hourinput = document.createElement('input')
            hourinput.className="align-middle form-control hours"+id
            hourinput.setAttribute('type','value')
            hourinput.value="0"
            hourinput.setAttribute('onchange','updateLog("'+id+'")')
            hourinput.id=members[n][0]+id
            td4.appendChild(hourinput)
          }
          tbody2.appendChild(tr3)
        }      
      logGrid.appendChild(div1)
    }
}

//update logs from attendees page
function updateLog(id) {
  var checkboxes = document.getElementsByClassName('checkbox'+id)
  var hours = document.getElementsByClassName('hours'+id)
  var users = []
  for (var i = 0; i<checkboxes.length; i++) {
    if (checkboxes[i].checked == true) {
      if (hours.length == checkboxes.length && hours[i].value==0) {
        var eventHours = document.getElementById(id+'hours').innerHTML
        hours[i].value=eventHours
      }
    }
    if (hours.length == checkboxes.length) {
      var userHours = hours[i].value
    }
    else {
      var userHours = 0
    }
    if (checkboxes[i].checked == true) {
      if (String(users).indexOf(checkboxes[i])<0) {
        users.push([checkboxes[i].value,userHours])
      }
    }
    else {
      if (hours.length == checkboxes.length) {
        hours[i].value=0
      }
    }
  }
  document.getElementById('attendees'+id).innerHTML=users.length
  for (var i = 0; i<users.length; i++) {
    var user = users[i][0]
    var hours = users[i][1]
    var alreadylogged = false
    for (var n = 0; n<officerLogData.length; n++) {
      if (officerLogData[n][2] == id && officerLogData[n][3] == user && officerLogData[n][2] != '') {
        if (officerLogData[n][6] != hours) {
          officerLogData[n][6]=hours
        }
        alreadylogged = true
      }
    }
    if (alreadylogged == false) {
      var now = new Date()
      var ID = String(now.getTime())+user
      var event = getEventById(id)
      if (event != "Error: event not found") {
        officerLogData.push([ID,now.toString(),id,user,event[3],event[4],event[6].toString()])
      }
    }
  }
  var row =0;
  for (var i = 0; i<officerLogData.length; i++) {
    if (officerLogData[i][2] == id && String(users).indexOf(officerLogData[i][3])<0 && officerLogData[i][2] != '') {
      officerLogData.splice(row,1)
    }
    else{
      row+=1;
    }
  }
  

  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).updateLog(id,users)
}


function changeQR() {
  var club = String(document.getElementById('qrClubs').value)
  var type = document.getElementById('qrType').value
  var url = "https://chart.googleapis.com/chart?chs=547x547&cht=qr&chl="
  club = String(club).split(' ')
  var club2=club.join('_')
  if (type == "join") {
    var final=url+"https://sasserviceportal.com/join/?"+String(club2)
  }
  else if (type == "checkin") {
    var final=url+"https://sasserviceportal.com/checkin/?"+String(club2)
  }
  else {
    document.getElementById('qr').innerHTML="Error: image could not be displayed"
  }
  var img = document.createElement('img')
  img.src=final
  img.alt=final
  img.className='img-fluid border border-info'
  document.getElementById('qr').innerHTML=''
  document.getElementById('qr').appendChild(img)
}


function getSettingsValues() {
  $("#settingSpinner").removeAttr("hidden")
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(setSettingsValues).getClubOfficerData()
}


//set all setting values
function setSettingsValues(clubs) {
  var club = document.getElementById('settingsClubs').value;
    for (var i = 0; i<clubs.length; i++) {
    if (clubs[i][0]==club) {
      if (clubs[i][5] != '') {
        var postBackgroundColor=clubs[i][5]
      }
      else {
        var postBackgroundColor='#ffffff'
      }
      if (clubs[i][6] != '') {
        var postTextColorPrimary=clubs[i][6]
      }
      else {
        var postTextColorPrimary='#000000'
      }
      if (clubs[i][7] != '') {
        var postTextColorSecondary=clubs[i][7]
      }
      else {
        var postTextColorSecondary='#000000'
      }
      var officers = String(clubs[i][2]).split(',')
      officers.sort()
      var sponsors = String(clubs[i][3]).split(',')
      sponsors.sort()
      var notificationOfficer = clubs[i][8]
      var mission = clubs[i][4]
      var umbrella = clubs[i][1]
      var meetings = clubs[i][9]
    }
    }
      document.getElementById('settingsColor').value=postBackgroundColor
      document.getElementById('settingsText1').value=postTextColorPrimary
      document.getElementById('settingsText2').value=postTextColorSecondary
      document.getElementById('settingsCard').style.backgroundColor=postBackgroundColor
      document.getElementById('settingsTitle').innerHTML=club
      document.getElementById('settingsMissionText').innerHTML=mission+"<br><p><i>Meetings:</i> "+meetings+"</p>"
      document.getElementById('settingsUmbrella').innerHTML=umbrella
      document.getElementById('settingsTitle').style.color=postTextColorPrimary
      document.getElementById('settingsMissionText').style.color=postTextColorPrimary
      document.getElementById('settingsUmbrella').style.color=postTextColorSecondary
      //document.getElementById('newOfficerLabel').innerHTML="New Officer for "+club+":"
      document.getElementById('settingsMission').value=mission
      document.getElementById('settingsMeetings').value=meetings
      
      var officerTable = document.getElementById('officerTable')
      officerTable.innerHTML=''
      var notificationOfficers = document.getElementById('notificationOfficer')
      notificationOfficers.innerHTML=''
      for (var i = 0; i<officers.length; i++) {
      if (officers[i] != '') {
        var row = document.createElement('tr')
        var td1 = document.createElement('td')
        td1.className="text-left align-middle"
        var td2 = document.createElement('td')
        var td3 = document.createElement('td')
        td3.className="text-left align-middle"
        var checkbox = document.createElement('input')
        checkbox.setAttribute('type','checkbox')
        checkbox.className="align-middle officerCheckbox"
        checkbox.setAttribute('onchange','showRemoveOfficer()')
        checkbox.value=officers[i]
        td1.appendChild(checkbox)
        var div2 = document.createElement('div')
        div2.className="image-circle-50 rounded-circle"
        var photo=getUserPhoto(officers[i])
        div2.style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+photo+'")'
        td2.appendChild(div2)
        var name = getUserName(officers[i])
        td3.innerHTML=name
        
        row.appendChild(td1)
        row.appendChild(td2)
        row.appendChild(td3)
        officerTable.appendChild(row)
        
        var option = document.createElement('option')
        option.value=officers[i]
        option.innerHTML=name
        if (notificationOfficer == officers[i]) {
          option.selected=true
        }
        notificationOfficers.appendChild(option)
      }
      }
      var sponsorTable = document.getElementById('sponsorTable')
      sponsorTable.innerHTML=''
      for (var i = 0; i<sponsors.length; i++) {
      if (sponsors[i] != '') {
        var row = document.createElement('tr')
        var td1 = document.createElement('td')
        td1.className="text-left align-middle"
        var td2 = document.createElement('td')
        var td3 = document.createElement('td')
        td3.className="text-left align-middle"
        var checkbox = document.createElement('input')
        checkbox.setAttribute('type','checkbox')
        checkbox.className="align-middle sponsorCheckbox"
        checkbox.setAttribute('onchange','showRemoveSponsor()')
        checkbox.value=sponsors[i]
        td1.appendChild(checkbox)
        var div2 = document.createElement('div')
        div2.className="image-circle-50 rounded-circle"
        var photo=getUserPhoto(sponsors[i])
        div2.style.backgroundImage='url("https://drive.google.com/uc?export=download&id='+photo+'")'
        td2.appendChild(div2)
        var name = getUserName(sponsors[i])
        td3.innerHTML=name
        
        row.appendChild(td1)
        row.appendChild(td2)
        row.appendChild(td3)
        sponsorTable.appendChild(row)
      }
    }
    document.getElementById('settingSpinner').setAttribute('hidden','true');
}

function editClubSettings() {
    $('.settingChangeSpinner').removeAttr('hidden')
    var club = document.getElementById('settingsClubs').value
    var color = document.getElementById('settingsColor').value
    var text1 = document.getElementById('settingsText1').value
    var text2 = document.getElementById('settingsText2').value
    var notificationOfficer = document.getElementById('notificationOfficer').value
    var mission = document.getElementById('settingsMission').value
    var meetings = document.getElementById('settingsMeetings').value
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).editClubInfo(club,color,text1,text2,notificationOfficer,mission,meetings)
    document.getElementById('settingsColor').value=color
    document.getElementById('settingsText1').value=text1
    document.getElementById('settingsText2').value=text2
    document.getElementById('settingsCard').style.backgroundColor=color
    document.getElementById('settingsTitle').style.color=text1
    document.getElementById('settingsMission').value=mission
    document.getElementById('settingsMeetings').value=meetings
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(updateClubs).getClubs()
}


function changeColors() {
  var color = document.getElementById('settingsColor').value
  var text1 = document.getElementById('settingsText1').value
  var text2 = document.getElementById('settingsText2').value
  document.getElementById('settingsCard').style.backgroundColor=color
  document.getElementById('settingsMissionText').style.color=text1
  document.getElementById('settingsTitle').style.color=text1
  document.getElementById('settingsUmbrella').style.color=text2
}

function showRemoveOfficer() {
  var elements = document.getElementsByClassName('officerCheckbox')
  var result = 0
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].checked==true) {
      result+=1
    }
  }
  if (result>0) {
    document.getElementById('removeOfficer').removeAttribute('hidden')
  }
  else {
    document.getElementById('removeOfficer').setAttribute('hidden','true')
  }
}

function showRemoveSponsor() {
  var elements = document.getElementsByClassName('sponsorCheckbox')
  var result = 0
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].checked==true) {
      result+=1
    }
  }
  if (result>0) {
    document.getElementById('removeSponsor').removeAttribute('hidden')
  }
  else {
    document.getElementById('removeSponsor').setAttribute('hidden','true')
  }
}


function removeOfficerConfirmed(){
  document.getElementById('removeOfficer').setAttribute('hidden','true')
  var club = document.getElementById('settingsClubs').value
  var elements = document.getElementsByClassName('officerCheckbox')
  var removals = []
  var names = []
  var allNames = []
  for (var i = 0; i < elements.length; i++) {
    allNames.push([getUserName(elements[i].value)])
    if (elements[i].checked==true) {
      removals.push([elements[i].value])
      names.push([getUserName(elements[i].value)])
    }
  }
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).removeOfficer(club,removals,names,allNames);
}

function removeOfficer() {
  var club = document.getElementById('settingsClubs').value
  var elements = document.getElementsByClassName('officerCheckbox')
  var removals = []
  var names = []
  var allNames = []
  for (var i = 0; i < elements.length; i++) {
    allNames.push([getUserName(elements[i].value)])
    if (elements[i].checked==true) {
      removals.push([elements[i].value])
      names.push([getUserName(elements[i].value)])
    }
  }
  var message = "Are you sure you want to remove "+String(names)+" from the officer team of "+club+"? This requires prior approval from a club sponsor and the ESC."
  
  document.getElementById('confirmMessageButton').setAttribute('onclick', 'removeOfficerConfirmed()')
  document.getElementById('confirmMessageCancel').setAttribute('data-target', '#dasboardModal'); 
  $('#confirmMessageModalText').html(message)
  $('#confirmMessageModal').modal('show')
}

function removeSponsorConfirmed(){
  document.getElementById('removeOfficer').setAttribute('hidden','true')
  var club = document.getElementById('settingsClubs').value
  var elements = document.getElementsByClassName('sponsorCheckbox')
  var removals = []
  var names = []
  var allNames = []
  for (var i = 0; i < elements.length; i++) {
    allNames.push([getUserName(elements[i].value)])
    if (elements[i].checked==true) {
      removals.push([elements[i].value])
      names.push([getUserName(elements[i].value)])
    }
  }
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).removeSponsor(club,removals,names,allNames);
}

function removeSponsor() {
  var club = document.getElementById('settingsClubs').value
  var elements = document.getElementsByClassName('sponsorCheckbox')
  var removals = []
  var names = []
  var allNames = []
  for (var i = 0; i < elements.length; i++) {
    allNames.push([getUserName(elements[i].value)])
    if (elements[i].checked==true) {
      removals.push([elements[i].value])
      names.push([getUserName(elements[i].value)])
    }
  }
  var message = "Are you sure you want to remove "+String(names)+" as a sponsor of "+club+"? This requires prior approval from the sponsor and the ESC."
  
  document.getElementById('confirmMessageButton').setAttribute('onclick', 'removeSponsorConfirmed()')
  document.getElementById('confirmMessageCancel').setAttribute('data-target', '#dasboardModal'); 
  $('#confirmMessageModalText').html(message)
  $('#confirmMessageModal').modal('show')
}

function addOfficer() {
  var user = document.getElementById('newOfficerName').value
  var club = document.getElementById('settingsClubs').value
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).addOfficer(club,user)
}

function addSponsor() {
  var user = document.getElementById('newSponsorName').value
  var club = document.getElementById('settingsClubs').value
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).addSponsor(club,user)
}












// club page --> set clubs, join & leave clubs (message, confirm)

function updateClubs(clubs) {  
  document.getElementById('clubspinner').removeAttribute('hidden');
  //update list
  var grid = document.getElementById('clubsGrid')
  
  grid.innerHTML=''
  
  for (var i=0; i<clubs.length; i++) {
    var club = clubs[i][0]    
    var umbrella = clubs[i][1]
    var mission = safeString(clubs[i][2])
    var meetings = safeString(clubs[i][3])

    var clubColors=getClubColors(club)
    
    var cardObject = document.createElement('div');
    
    var umbrella2 = umbrella.replace(/\s/g, "");
    cardObject.className = "card text-center filter "+ umbrella2;
    cardObject.style.backgroundColor = clubColors[0];
    cardObject.style.display = "inline-block";
    
    
    var cardBody = document.createElement('div');
    cardBody.className = "card-body";

    var cardTitle = document.createElement('h3')
    cardTitle.className="card-title"
    cardTitle.innerHTML=club
    cardTitle.style.color=clubColors[1]
    
    var cardUmbrella = document.createElement('h6')
    cardUmbrella.className="card-text"
    cardUmbrella.innerHTML=umbrella
    cardUmbrella.style.color=clubColors[2]
    
    var cardMission = document.createElement('p')
    cardMission.className="card-text"
    cardMission.innerHTML=mission+"<br><p><i>Meetings:</i> "+meetings+"</p>"
    cardMission.style.color=clubColors[1]
    
    var joinButton = document.createElement('a')
    joinButton.className="btn btn-secondary btn-block text-white"
    if ("String(<?=user[6]?>)".indexOf(club) >-1) {
      joinButton.innerHTML="Leave";
      joinButton.setAttribute('data-dismiss', 'modal')
      joinButton.setAttribute('onclick','leaveClub("'+club+'")')
    }
    else {
      joinButton.innerHTML="Join"
      joinButton.setAttribute('data-dismiss', 'modal')
      joinButton.setAttribute('onclick','joinClub("'+club+'")')
    }
    
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardUmbrella);
    cardBody.appendChild(cardMission);
    cardBody.appendChild(joinButton);
    cardObject.appendChild(cardBody);

    grid.appendChild(cardObject);
  }
  document.getElementById('clubspinner').setAttribute('hidden','true');
}


function leaveClubConfirmed(){
  var club = document.getElementById('clubReference').innerHTML
  var memberships = membership.split(',');
  var index = memberships.indexOf(club);
  membership = memberships.splice(index,1).join();
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).changeClubMembership(club,"leave");
}

function leaveClub(club) {
  var message = "Are you sure you want to leave "+club+"?"
  $('#confirmMessageModalText').html(message)
  $('#confirmMessageModal').modal('show')
  document.getElementById('confirmMessageCancel').setAttribute('data-target', '#clubsModal'); 
  document.getElementById('clubReference').innerHTML=club
  document.getElementById('confirmMessageButton').setAttribute('onclick', 'leaveClubConfirmed()');
}

function joinClubConfirmed(){
  var club = document.getElementById('clubReference').innerHTML
  membership += ','+club
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).changeClubMembership(club,"join");
}

function joinClub(club) {
  var message = "Are you sure you want to join "+club+"?"
  $('#confirmMessageModalText').html(message)
  $('#confirmMessageModal').modal('show')
  document.getElementById('clubReference').innerHTML=club
  document.getElementById('confirmMessageCancel').setAttribute('data-target', '#clubsModal'); 
  document.getElementById('confirmMessageButton').setAttribute('onclick', 'joinClubConfirmed()');
}








// links page

function updateLinks(string) {
  var data = splitString(string)
  if (data[0][2] == "All") {
    var grid = document.getElementById('linksGrid')
  }
  else {
    var grid = document.getElementById('officerLinksGrid')
  }
  grid.innerHTML=''
  for (var i = 0; i<data.length; i++) {
    var div = document.createElement('div')
    div.className='card text-center col-md my-2'
    
    var divBody = document.createElement('div')
    divBody.className='card-body d-flex flex-column'
    
    var h3 = document.createElement('h4')
    h3.innerHTML=data[i][0]
    h3.className='card-title'
        
    var a = document.createElement('a')
    a.className='btn btn-secondary btn-block align-self-end text-white'
    a.innerHTML="Open Link <svg class='bi bi-box-arrow-up-right' width='1.1em' height='1.1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> <path fill-rule='evenodd' d='M1.5 13A1.5 1.5 0 0 0 3 14.5h8a1.5 1.5 0 0 0 1.5-1.5V9a.5.5 0 0 0-1 0v4a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 0 0-1H3A1.5 1.5 0 0 0 1.5 5v8zm7-11a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.5H9a.5.5 0 0 1-.5-.5z'/><path fill-rule='evenodd' d='M14.354 1.646a.5.5 0 0 1 0 .708l-8 8a.5.5 0 0 1-.708-.708l8-8a.5.5 0 0 1 .708 0z'/></svg>"
    a.setAttribute('onclick',"window.open('"+data[i][1]+"');")
    
    divBody.appendChild(h3)
    divBody.appendChild(a)
    div.appendChild(divBody)
    
    grid.appendChild(div)
  }
}











// service log page --> onclick, parse my log, set my log, get past events, set past events (for checkin), checkin (onclick, update client side (add, remove)), checkout (delete from log), checkout confirmed, show details

function getMyLog() {
  document.getElementById('logTable').innerHTML=''
  document.getElementById('logTableSummary').innerHTML=''
  document.getElementById('mylogSpinner').removeAttribute('hidden')
  document.getElementById('summarySpinner').removeAttribute('hidden')
  document.getElementById('pastEventSpinner').removeAttribute('hidden')
  parseMyLog()
}


//submission id, timestamp, email, id, club, activity, hours
function parseMyLog(){
/**
  var myLogData = JSON.parse(localStorage.getItem("myLogData"));
  var myEventData = JSON.parse(localStorage.getItem("myEventData"));
  var officerships = localStorage.getItem("officerships");
  var memberships = localStorage.getItem("memberships");**/
  var result = []
  for (var i = 0; i<myLogData.length; i++) {
    if (myLogData[i][2] != '') {
      var event = getEventNameById(myLogData[i][2])
      if(event!="Error: event not found"){
        var name = event
      }
      else{
        var name = 'None'
      }
    }
    else{
      var name = 'None'
    }
    if (officerships.indexOf(myLogData[i][4])>-1) {
      var status = "Officer"
    }
    else if (String(memberships).indexOf(myLogData[i][4])>-1) {
      var status = "Member"
    }
    else {
      var status = "Non-Member"
    }
    result.push([myLogData[i][0],String(new Date(myLogData[i][1])),myLogData[i][4],name,myLogData[i][5],myLogData[i][6],status,myLogData[i][2]])
  }

  var result2 = []
  for (var i = 0; i<result.length; i++) {
    result2.push([new Date(result[i][1]).getTime(),result[i]])
  }
  result2 = result2.sort().reverse()
  for (var i = 0; i<result.length; i++) {
    result[i]=result2[i][1]
  }
  var membershipsArray = memberships.split(",")
  for (var i = 0; i<membershipsArray.length; i++) {
    if (String(result).indexOf(membershipsArray[i])<0) {
      result.push(['Member-only','None',membershipsArray[i],'None','None','None','Member','None'])
    }
  }
  setMyLog(makeStrings(result))
}

//create log elements on service log
function setMyLog(data) {
  getMyPastEvents()
  var logTableSummary = document.getElementById('logTableSummary')
  logTableSummary.innerHTML=''
  var clubs = []
  for (var i = 0; i<data.length; i++) {
    if (String(clubs).indexOf(data[i][2])<0) {
      clubs.push([data[i][2],data[i][6],0,0])
    }
  }
  for (var i = 0; i<data.length; i++) {
    for (var n = 0; n<clubs.length; n++) {
      if (data[i][2] == clubs[n][0] && data[i][0] != 'Member-only') {
        clubs[n][3] = Number(clubs[n][3])+Number(data[i][5])
        if (data[i][4] == "Meeting") {
          clubs[n][2] = Number(clubs[n][2])+1
        }
        
      }
    }
  }
  clubs.sort()
  for (var i = 0; i<clubs.length; i++) {
    if (clubs[i][0] != '') {
      var row = document.createElement('tr')
      var td1 = document.createElement('td')
      td1.className="text-left align-middle"
      var td2 = document.createElement('td')
      td2.className="text-left align-middle"
      var td3 = document.createElement('td')
      td3.className="text-left align-middle"
      var td4 = document.createElement('td')
      td4.className="text-left align-middle"
      td1.innerHTML=clubs[i][0]
      td2.innerHTML=clubs[i][1]
      td3.innerHTML=clubs[i][2]
      td4.innerHTML=parseFloat(clubs[i][3]).toFixed(2);
       
      row.appendChild(td1)
      row.appendChild(td2)
      row.appendChild(td3)
      row.appendChild(td4)
      logTableSummary.appendChild(row)
    }
  }
  var logTable = document.getElementById('logTable')
  logTable.innerHTML=''
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
  for (var i = 0; i<data.length; i++) {
    if (data[i][0] != '' && data[i][0] != 'Member-only') {
      var id = data[i][0]
      var time = new Date(data[i][1])
      var row = document.createElement('tr')
      row.id = "logRow"+id
      var td1 = document.createElement('td')
      td1.className="text-left align-middle"
      var td2 = document.createElement('td')
      td2.className="text-left align-middle"
      var td3 = document.createElement('td')
      td3.className="text-left align-middle"
      var td4 = document.createElement('td')
      td4.className="text-left align-middle"
      var td5 = document.createElement('td')
      td5.className="text-left align-middle"
      var td6 = document.createElement('td')
      td6.className="text-left align-middle"
      var td7 = document.createElement('td')
      var span = document.createElement('span');
      span.innerHTML = "×"
      span.style.fontSize = '30px'
      span.className = 'memberPageClose'
      span.style.cursor = 'pointer'
      span.setAttribute('onclick', 'deleteMemberLog("'+id+'")')
      td7.appendChild(span)
      td2.innerHTML=String(String(days[time.getDay()])+', '+String(months[time.getMonth()])+' '+String(time.getDate())+', '+String(time.getFullYear()))
      td3.innerHTML=data[i][2]
      td4.innerHTML=data[i][3]
      td5.innerHTML=data[i][4]
      td6.innerHTML=parseFloat(data[i][5]).toFixed(2);
       
      //row.appendChild(td1)
      row.appendChild(td2)
      row.appendChild(td3)
      row.appendChild(td4)
      row.appendChild(td5)
      row.appendChild(td6)
      row.appendChild(td7)
      logTable.appendChild(row)
    }
  }
  document.getElementById('mylogSpinner').setAttribute('hidden','true')
  document.getElementById('summarySpinner').setAttribute('hidden','true')
}

function deleteMemberLog(id){
  var message = "Are you sure you want to remove this log?"

  document.getElementById('confirmMessageButton').setAttribute('onclick', 'deleteMemberLogConfirmed("'+id+'")')
  document.getElementById('confirmMessageCancel').setAttribute('data-target', '#logModal'); 
  $('#confirmMessageModalText').html(message)
  $('#confirmMessageModal').modal('show')
}

function deleteMemberLogConfirmed(id){
  var row = document.getElementById("logRow"+id);
  row.style.display='none'
  for(var i=0; i<officerLogData.length; i++){
    if(officerLogData[i][0]==id){
      officerLogData.splice(i,1)
    }
  }
  for(var i=0; i<myLogData.length; i++){
    if(myLogData[i][0]==id){
      myLogData.splice(i,1)
    }
  }
  google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(alert2).deleteMemberLog(id);
}

//get all of my clubs' past events
function getMyPastEvents(){
  var time = (new Date()).getTime()
  var result = []
  for(var i=0; i<myEventData.length; i++){
    var time2 = (new Date(myEventData[i][2])).getTime()+900000;
    if (memberships.indexOf(myEventData[i][3])>-1 && time2<time) {
      result.push([(new Date(myEventData[i][1])).getTime(),myEventData[i][3],myEventData[i][5],myEventData[i][0]])
    }
  }
  result.sort().reverse()
  listAllEvents(result)
}


//list all events in check-in
function listAllEvents(data) {
  var select = document.getElementById('checkinLateEvent')
  select.innerHTML=''
  var option = document.createElement('option')
  option.value=''
  option.selected = true
  option.innerHTML="Miscellaneous"
  select.appendChild(option)
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
  for (var i = 0; i<data.length; i++) {
    var option2 = document.createElement('option')
    option2.value=data[i][3]
    var time = new Date(data[i][0])
    option2.innerHTML=data[i][2]+"; "+String(days[time.getDay()])+', '+String(months[time.getMonth()])+' '+String(time.getDate())+" - "+data[i][1]
    select.appendChild(option2)
  }
  showCheckinDetails()
  document.getElementById('pastEventSpinner').setAttribute('hidden','true')
}

//check in/out from events page, late checkin from service log
function checkin(ID,check) {
  console.log(officerEventData)
  //console.log(myLogData);
  showToast("Loading...");
  if (check=="checkin") {
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(addToMyLogDataClientSide).checkin(ID)
    var check = document.getElementById('check'+ID)
    check.innerHTML = '   <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.646 11.354a.5.5 0 0 1 0-.708L14.293 8l-2.647-2.646a.5.5 0 0 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"/><path fill-rule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/><path fill-rule="evenodd" d="M2 13.5A1.5 1.5 0 0 1 .5 12V4A1.5 1.5 0 0 1 2 2.5h7A1.5 1.5 0 0 1 10.5 4v1.5a.5.5 0 0 1-1 0V4a.5.5 0 0 0-.5-.5H2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-1.5a.5.5 0 0 1 1 0V12A1.5 1.5 0 0 1 9 13.5H2z"/></svg>'
    check.setAttribute('title','Check out of this event.')
    check.setAttribute('onclick','checkin("'+ID+'","checkout")')
  }
  else if (check == "checkout") {
    google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(removeFromMyLogDataClientSide).checkout([ID])
    var check = document.getElementById('check'+ID)
    check.innerHTML = '  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-in-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.146 11.354a.5.5 0 0 1 0-.708L10.793 8 8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"/><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 1 8z"/><path fill-rule="evenodd" d="M13.5 14.5A1.5 1.5 0 0 0 15 13V3a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 4 3v1.5a.5.5 0 0 0 1 0V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 5 13v-1.5a.5.5 0 0 0-1 0V13a1.5 1.5 0 0 0 1.5 1.5h8z"/></svg>'
    check.setAttribute('onclick','checkin("'+ID+'","checkin")')
    check.setAttribute('title','Check in at this event')
  }
  else if (check == "late") {
    $('#pastEventsSelect').removeClass("show")
    ID=document.getElementById('checkinLateEvent').value
    if (ID!='') {
      google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(addToMyLogDataClientSide).checkin(ID)
    }
    else {
      var activity = document.getElementById('checkinActivity').value
      var club = document.getElementById('checkinClub').value
      var time = String(new Date(document.getElementById('checkinTime').value))
      if(time=="Invalid Date"){
        alert2("Please enter a valid date.")
        return ''
      }
      
      if (activity == "Meeting") {
        var hours = 0
      }
      else {
        var hours = document.getElementById('checkinHours').value
      }
      
      document.getElementById('checkinHours').value = "0";
      document.getElementById('checkinTime').value = "mm/dd/yyyy --:-- --";
      if (club == '') {
      alert2('Club name invalid')
      }
      else{
      google.script.run.withFailureHandler(scriptFailure).withSuccessHandler(addToMyLogDataClientSide).logMisc(time,club,activity,hours)
      }
    }
  }
}


function addToMyLogDataClientSide(data){
  if(data.indexOf("Error")<0){
    for(var i=0; i<data.length; i++){
      myLogData.push(data[i])
      if(officerships.indexOf(data[i][4])>-1){
        officerLogData.push(data[i])
      }
    }
    //console.log(myLogData);
    showToast("Service Log Updated");
    getMyLog()
  }
  else{
    showToast(data);
  }
}



function removeFromMyLogDataClientSide(data){
  var deleted = 0;
  var row = 0;
  for(var i=0; i<myLogData.length; i++){
    if(data.indexOf(myLogData[i][2])>-1){
      myLogData.splice(row,1);
      deleted+=1;
    }
    else{
      row += 1;
    }
  }
  row = 0;
  for(var i=0; i<officerLogData.length; i++){
    if(data.indexOf(officerLogData[i][2])>-1){
      officerLogData.splice(row,1);
    }
    else{
      row +=1;
    }
  }
  if(deleted>0){ 
    showToast("Logs Removed");
  }
  else{
    showToast("Error: No Logs Removed");
  }
  getMyLog()
}


function showCheckinDetails() {
 var event = document.getElementById('checkinLateEvent')
 if (event.value == "") {
   document.getElementById('checkinActivity').removeAttribute('hidden')
   document.getElementById('checkinClub').removeAttribute('hidden')
   document.getElementById('checkinTime').removeAttribute('hidden')
   document.getElementById('checkinActivityLabel').removeAttribute('hidden')
   document.getElementById('checkinClubLabel').removeAttribute('hidden')
   document.getElementById('checkinTimeLabel').removeAttribute('hidden')
   if (document.getElementById('checkinActivity').value != "Meeting") {
     document.getElementById('checkinHours').removeAttribute('hidden')
     document.getElementById('checkinHoursLabel').removeAttribute('hidden')
   }
   document.getElementById('checkinHours').removeAttribute('hidden')
   document.getElementById('checkinHoursLabel').removeAttribute('hidden')
 }
 else {
   document.getElementById('checkinActivity').setAttribute('hidden','true')
   document.getElementById('checkinClub').setAttribute('hidden','true')
   document.getElementById('checkinTime').setAttribute('hidden','true')
   document.getElementById('checkinActivityLabel').setAttribute('hidden','true')
   document.getElementById('checkinClubLabel').setAttribute('hidden','true')
   document.getElementById('checkinTimeLabel').setAttribute('hidden','true')
   document.getElementById('checkinHours').setAttribute('hidden','true')
   document.getElementById('checkinHoursLabel').setAttribute('hidden','true')
 }
}



//quiz page

function loadQuizData(data) {
  var table = document.getElementById('clubQuizData')
  table.innerHTML=''
  for (var i = 0; i<data.length; i++) {
    var row = document.createElement('tr')
    table.appendChild(row)
    for (var n = 0; n<data[i].length; n++) {
      var td = document.createElement('td')
      td.innerHTML=data[i][n]
      row.appendChild(td)
    }
  }
  getQuizTable()
  shuffleRows('serviceAreaTable')
  shuffleRows('serviceTypeTable')
}
</script>