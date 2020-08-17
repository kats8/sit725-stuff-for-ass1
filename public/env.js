

//DO I ADD userprofile to profiles and then skip if it's me??
//remove all the stuff that's not mine


//the current user, initialised to null
//index to keep track of profile in a stack
let profileIndex = 0;
let matchList = [];
//current user, initialised to no information and locally stored photograph
let userProfile = {
    profName: '',
    age: null,
    bio: '',
    pic: 'assets/UserPic.jpg',
    email: ''
}

let downMouseX = null;
let upMouseX = null;

let profileStack = [
    {
        profName: 'Izabelle',
        age: 25,
        bio: 'Likes pina colada and walks in the rain',
        pic: 'assets/Izabelle.jpg',
        email: 'Izi@hotmail.com'
    },

    {
        profName: 'Joshua',
        age: 32,
        bio: 'My passions include motorcycles and woodturning',
        pic: 'assets/Joshua.jpg',
        email: 'JoshRides@gmail.com'
    },

    {
        profName: 'Mary',
        age: 27,
        bio: 'Architect and dog lover',
        pic: 'assets/Mary.jpg',
        email: 'MaryD@gmail.com'
    },

    {
        profName: 'Adam',
        age: 19,
        bio: 'Thrill seeker and bass guitarist',
        pic: 'assets/Adam.jpg',
        email: 'AdamPlays@yahoo.com'
    },

    {
        profName: 'Janine',
        age: 28,
        bio: 'Likes Taylor Swift and bunnies',
        pic: 'assets/Janine.jpg',
        email: 'JayJay@yahoo.com'
    },

]


const sendMatchMail = (message) => {
    //the text to be sent
    //let message = "You have been matched with " + profileStack[profileIndex].profName;
    //this needs to access a node.js function - we will be getting this from mail.js
    let data = { message: message }
    // alert(myData.message)
    $.ajax({
        url: "/sendMessage",
        contentType: 'application/json',
        data: JSON.stringify(data),
        type: 'POST',
        success: function (result) {
            console.log(result)
        }
    });

    /* $.post("/sendMessage",
         {
             text: "Donald Duck",
             message: "Duckburg"
         },
         function (data, status) {
             alert("Data: " + String(data.message) + "\nStatus: " + status);
         });*/
}


const createUserProfile = () => {

    userProfile.profName = $('#name').val();
    userProfile.age = $('#age').val();
    userProfile.bio = $('#bio').val();
    //    userProfile.pic = $('#pic').val(); //I will remove this from form and select one of my own.
    userProfile.email = $('#email').val();

    //update any web displays with the created information
    userProfileUpdate();
}


const getMatchingFunction = () => {
    //set our user's profile
    createUserProfile();
    //put top profile in stack in the view
    displayProfile(0);
    //hide the welcome/create profile screen
    $('#welcome').addClass('hidden');
    //shows the presenting profile pane
    $('#matching').removeClass('hidden');
}

const nopeSelectedFunction = () => {
    profileIndex++;
    if (profileIndex < profileStack.length) {
        displayProfile(profileIndex);
    }
    else {
        matchingComplete();
    }
}

const matchingComplete = () => {
    if (matchList.length > 0) {
        //hide matching pane
        constructMatchesDisplay();
        $('#matching').addClass('hidden');
        //display no more matches screen
        $('#listMatches').removeClass('hidden');

    } else {
        //hide matching pane
        $('#matching').addClass('hidden');
        //display no more matches screen
        $('#noMatches').removeClass('hidden');


    }

}


const constructMatchesDisplay = () => {
    let listContents = '';
    //for each element (profile) in the matchlist, add a row displaying its picture and name to the string
    matchList.forEach((profile, index) => {
        listContents += '<div class="row"><div class="matchRow"><img src="'+profile.pic+'" class="miniImg circle" alt=""></div><div class="matchRow">' + profile.profName + ', age</div></div>';

    })
    //then fill the constructed list with created html
    $('#constructedList').html(listContents);
    /*
 //constructs a list of profile pics and names of successful matches
 let jComments=$("<div class='matches container'><div>");
 journal.comments.forEach((comment)=>{
   let thisComment="<div class='col s12 comment'><i class='material-icons left' style='color:white font-size: larger;'>chat_bubble_outline</i>"+comment.text+" by <b>"+comment.author+"</b></div>"
   jComments.append(thisComment)
 })
 let temp=jComments.html()
 let jString ="<div class='col s12 journalBox'>\
   <div class='col s8'>"+journal.author+"</div><div class='col s4'>"+journal.date+"</div>\
   <div class='col s12 journalText'>"+journal.text+"</div>\
   <div class='col s12 commentsContainer row'>"+temp+"</div>\
   <div class='col s12 center'><a id='buttonComment' \
   onclick=commentPost(this) value="+journal._id+" class='waves-effect waves-light btn modal-trigger' href='#modalComments'>Comment</a><div>\
 </div>";
 

 let jEntry = $(jString)
 //jEntry.append('Sto cazzo')

 $('#journal').append(jEntry)
 */
}

//updates modal display with the specified profile
const modalMatchUpdate = (index) => {
    let picUrl = profileStack[index].pic;
    $("#matchPic").attr("src", picUrl);
    $("#matchNameAge").html(profileStack[index].profName + ", " + profileStack[index].age);
    $("#matchBio").html(profileStack[index].bio);

}

//updates profile name, age, picture and bio wherever the applicable class is in use
const userProfileUpdate = () => {
    $(".userProfPic").attr("src", userProfile.pic);
    $(".userNameAge").html(userProfile.profName + ", " + userProfile.age);
    $(".userBio").html(userProfile.bio);
}
const likeSelectedFunction = () => {
    //set the modal to display current profile (it's a match!)
    modalMatchUpdate(profileIndex);
    //show the modal that displays the match
    $('#matchAlert').modal('open');
    //the current profile is added to the matches list
    matchList.push(profileStack[profileIndex]);
    let alertString = 'Congratulations ' + userProfile.profName + ', you have found a match. ' + profileStack[profileIndex].profName + ' will contact you soon!';
    sendMatchMail(alertString);
    //display modal of matching pair and message about emailing and email.
    profileIndex++;
    if (profileIndex < profileStack.length) {
        displayProfile(profileIndex);
    }
    else {
        matchingComplete();
    }
}

const displayProfile = (index) => {
    let picUrl = profileStack[index].pic;
    $("#profPic").attr("src", picUrl);
    $("#nameAge").html(profileStack[index].profName + ", " + profileStack[index].age);
    $("#profBio").html(profileStack[index].bio);
}


const updateMouseDownX = (event) => {
    downMouseX = event.clientX;
}

const updateMouseUpX = (event) => {
    upMouseX = event.clientX;
    //compare the up coordinate with the down coordinate to see if a legitimate-sized "swipe" has occurred
    let dragMovement = upMouseX - downMouseX;
    if (dragMovement > 10) {
        //      alert("You swiped right!");
        likeSelectedFunction();
    }
    if (dragMovement < -10) {
        //        alert("You swiped left.")
        nopeSelectedFunction();
    }
    //if there has not been a swipe/drag of sufficient size to register, no action is taken
}



$(document).ready(function () {
    //reinitialise form inputs
    M.updateTextFields();
    console.log('Ready')
    //initialisation for using modals
    $('.modal').modal();

    //bind the buttons
    // $('#testButton').click(testButtonFunction)


    //   $('#likeButton').click(likeButtonFunction)
    $('#likeButton').click(likeSelectedFunction)


    //this needs to access a node.js function - we will be getting this from mail.js
    // { let myData = { message: message }
    //  alert(myData.message)
    /* $.ajax({
         url: "/sendMessage",
         /*
         contentType: 'application/json',
         //  data: JSON.stringify(data),
         data: {"message": message},
         type: 'POST',
         success: function (result) {
             console.log(result)
         } 
         type: 'POST',  // http method
         data: { myData: 'This is my data.' },  // data to submit
         success: function (data, status, xhr) {
             $('p').append('status: ' + status + ', data: ' + data);
         },
         error: function (jqXhr, textStatus, errorMessage) {
                 $('p').append('Error' + errorMessage);
         }
     });  }*/


    //====================================

    $('#nopeButton').click(nopeSelectedFunction)
    $('#profileButton').click(getMatchingFunction)
    // movementX
    // $('#matching').movementX(checkDragFunction)

    // $('#matching').drag(checkDragFunction);
    //object.addEventListener("drag", checkDragFunction);

    $("#matching").mousedown(updateMouseDownX)
    $("#matching").mouseup(updateMouseUpX)

    /*
        //test get call
        $.get('/test?user_name="Fantastic User"', (result) => {
            console.log(result)
        })
    */

})

//=========================OTHER STUFF=====================


const getJournals = () => {
    $.get('/api/journal', (journals) => {
        if (journals.length > 0) {
            $('#journal').empty()
            journals.forEach(journal => {
                appendJournal(journal)
            })
        }
    })
}


const commentPost = (element) => {
    let test = $(element)
    postId = test.attr('value')
    //console.log(element.val())
}
const newJournal = () => {
    let text = $('#journalText').val()
    if (username == null) {
        username = 'Guest'
        console.log('guest')
    }
    console.log(username)
    let data = {
        text: text,
        author: username
    }
    $.ajax({
        url: '/api/journal',
        contentType: 'application/json',
        data: JSON.stringify(data), // access in body
        type: 'POST',
        success: function (result) {
            console.log(result)
        }
    });
}



const submitPost = () => {
    let text = $('#commentText').val()
    if (username == null) {
        username = 'Guest'
        console.log('guest')
    }
    console.log(username)
    let data = {
        _id: postId,
        text: text,
        author: username
    }
    console.log(data)

    $.ajax({
        url: '/api/journal',
        contentType: 'application/json',
        data: JSON.stringify(data), // access in body
        type: 'PUT',
        success: function (result) {
            console.log(result)
        }
    });

}

const login = () => {
    let user = $('#username').val()
    if (user.length <= 0) {
        username = 'Guest'
        console.log('guest')
    } else {
        username = user
    }
    $('#buttonLogin').hide()

    $('#user').html(username)

}


//handle journal
const appendJournal = (journal) => {
    // this iterates through all the comments and creates an object containing all of the comments
    let jComments = $("<div class='col container'><div>");
    journal.comments.forEach((comment) => {
        let thisComment = "<div class='col s12 comment'><i class='material-icons left' style='color:white font-size: larger;'>chat_bubble_outline</i>" + comment.text + " by <b>" + comment.author + "</b></div>"
        jComments.append(thisComment)
    })
    let temp = jComments.html()
    let jString = "<div class='col s12 journalBox'>\
    <div class='col s8'>"+ journal.author + "</div><div class='col s4'>" + journal.date + "</div>\
    <div class='col s12 journalText'>"+ journal.text + "</div>\
    <div class='col s12 commentsContainer row'>"+ temp + "</div>\
    <div class='col s12 center'><a id='buttonComment' \
    onclick=commentPost(this) value="+ journal._id + " class='waves-effect waves-light btn modal-trigger' href='#modalComments'>Comment</a><div>\
  </div>";


    let jEntry = $(jString)
    //jEntry.append('Sto cazzo')

    $('#journal').append(jEntry)

}

/*
$(document).ready(function () {

    console.log('Ready')

    setInterval(() => {
        getJournals()
    }, 5000)
    //test get call
    $.get('/test?user_name="Fantastic User"', (result) => {
        console.log(result)
    })
    // initialise the tabs
    $('.tabs').tabs();

    //initialise the map
    var map = L.map('worldMap').setView([-37.7, 145], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([-37.5, 144.7]).addTo(map)
        .bindPopup('Bogan Castle')
    L.marker([-37.8, 145.1]).addTo(map)
        .bindPopup('VB Fortress')





    $('.modal').modal();
    getJournals()

})
*/
