//TO DO
//Do I need user AND user profile?
//DO I ADD userprofile to profiles and then skip if it's me??
//remove all the stuff that's not mine


//the current user, initialised to null
let username = null;
//index to keep track of profile in a stack
let profileIndex = 0;
let matchList = [];
let userProfile = {
    profName: '',
    age: null,
    bio: '',
    pic: '',
    email: ''
}

let downMouseX = null;
let upMouseX = null;

let profileStack = [
    {
        profName: 'Izabelle',
        age: 25,
        bio: 'Likes pina colada and walks in the rain',
        pic: 'assets/prof.jpeg',
        email: 'Izi@hotmail.com'
    },

    {
        profName: 'Joshua',
        age: 32,
        bio: 'My passions include motorcycles and woodturning',
        pic: 'assets/flame.png',
        email: 'JoshRides@gmail.com'
    },

    {
        profName: 'Mary',
        age: 27,
        bio: 'Architect and dog lover',
        pic: 'assets/prof.jpeg',
        email: 'MaryD@gmail.com'
    },

    {
        profName: 'Adam',
        age: 19,
        bio: 'Thrill seeker and bass guitarist',
        pic: 'assets/flame.png',
        email: 'AdamPlays@yahoo.com'
    },

    {
        profName: 'Janine',
        age: 28,
        bio: 'Likes Taylor Swift and bunnies',
        pic: 'assets/prof.jpeg',
        email: 'JayJay@yahoo.com'
    },

]
/*let mockdata=[{
  _id:12324124,author:'alex', text:'sto cazzo', date:1231455,comments:[
    {author:'alex',text:'some comment'},
    {author:'alex',text:'some comment2'},
  ]
},{
  _id:12324125,auhtor:'alex', text:'sto cazzo', data:1231455,comments:[
    {author:'alex',text:'some comment'},
    {author:'alex',text:'some comment2'},
  ]
}]*/

const createUserProfile = () => {

    userProfile.profName = $('#name').val();
    userProfile.age = $('#age').val();
    userProfile.bio = $('#bio').val();
    userProfile.pic = $('#pic').val();
    userProfile.email = $('#email').val();
    //hides the welcome/create profile screen
    $('#welcome').addClass('hidden');
    //shows the matching pane
    $('#matching').removeClass('hidden');
}

const nopeButtonFunction = () => {
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
        alert('this is where matches will be listed');
        //list matches
    } else {
        alert('There were no matches');
        //display no more matches screen
    }

}
const likeButtonFunction = () => {
    //the current profile is added to the matches list
    matchList.push(profileStack[profileIndex]);
    let alertString = 'you matched with '+ profileStack[profileIndex].profName;
   alert(alertString);
   sendMatchMail(alertString);
    //display modal of matching pair and message about emailing and email.
    profileIndex++;
    if (profileIndex < profileStack.length) {
        displayProfile(profileIndex);
    }
    else {
        //display no more matches
    }
}

const displayProfile = (index) => {
    let picUrl = profileStack[index].pic;
    $("#profPic").attr("src", picUrl);
}
/*

function checkDirection(event) {
    log.insertAdjacentHTML('afterbegin', `movement: ${event.movementX}, ${event.movementY}<br>`);
    while (log.childNodes.length > 10) log.lastChild.remove()
  }  */

//const log = document.getElementById('log');
// document.addEventListener('mousemove', checkDirection);

//--- from other env file

const testButtonFunction = () => {
    alert('Thank you for clicking')
}
/* 
 const checkDragFunction=()=>{
   alert('Thank you for dragging')

 //  alert(movementX);
 }
 */
const updateMouseDownX = (event) => {
    downMouseX = event.clientX;
}

const updateMouseUpX = (event) => {
    upMouseX = event.clientX;
    //compare the up coordinate with the down coordinate to see if a legitimate-sized "swipe" has occurred
    let dragMovement = upMouseX - downMouseX;
    if (dragMovement > 10) {
        alert("You swiped right!");
    }
    if (dragMovement < -10) {
        alert("You swiped left.")
    }
    //if there has not been a swipe/drag of sufficient size to register, no action is taken
}



$(document).ready(function () {
    console.log('Ready')

    //initialisation for using modals
    $('.modal').modal();

    //bind the buttons
    $('#testButton').click(testButtonFunction)


    $('#likeButton').click(likeButtonFunction)
    $('#nopeButton').click(nopeButtonFunction)
    $('#profileButton').click(createUserProfile)
    // movementX
    // $('#matching').movementX(checkDragFunction)

    // $('#matching').drag(checkDragFunction);
    //object.addEventListener("drag", checkDragFunction);

    $("#matching").mousedown(updateMouseDownX)
    $("#matching").mouseup(updateMouseUpX)

    /*
        $( "#testIt" ).draggable({
            start: function() {
          
            },
            drag: function() {
          
            },
            stop: function() {
          alert("Got here")
            }
          });
    */

    //object.addEventListener("drag", myScript); 

    //test get call
    $.get('/test?user_name="Fantastic User"', (result) => {
        console.log(result)
    })


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
