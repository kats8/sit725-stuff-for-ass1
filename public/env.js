

//DO I ADD userprofile to profiles and then skip if it's me??
//remove all the stuff that's not mine


//the current user, initialised to null
//index to keep track of profile in a stack
let profileIndex = 0;
let matchList = [];
//tracks age of user (profile will not be created/updated if user under age)
let userAge = "";
//current user, initialised to no information and locally stored photograph
let userProfile = {
    profName: '',
    age: null,
    bio: '',
    pic: 'assets/UserPic.jpg',
    email: '',
    dob: ''
}

//tracks X coordinants for mouse on down and up to detect drag/swipe
let downMouseX = null;
let upMouseX = null;

//collection of suitor profiles
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

//sends request to server to send the user an email 
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


const calculateAge = (testDob) => {
    let now = new Date();
    let dob = new Date(testDob);
    //calculate age with assumption bithday for the year has occurred
    let age = (now.getFullYear() - dob.getFullYear());
    //if the birthmonth is yet to occur, take a year off age
    if (dob.getMonth() > now.getMonth()) {
        age--;
    }
    //if in the birthmonth and the day is yet to occur, take a year off age
    if (dob.getMonth() == now.getMonth()) {
        if (dob.getDate() > now.getDate()) {
            age--;
        }
    }
    return age;
}

const createUserProfile = () => {
    userProfile.profName = $('#firstName').val();
    userProfile.bio = $('#bio').val();
    //    userProfile.pic = $('#pic').val(); //I will remove this from form and select one of my own.
    userProfile.email = $('#email').val();
    userProfile.dob = $('#dob').val();
    //for ease of use, store calculated age
    userProfile.age = userAge;
    //update any web displays with the created information
    userProfileUpdate();
}

const validateForm = () => {
    let oldEnough = false;
    //if form date input is valid, check age
    if (dob.checkValidity()) {
        let formAge = calculateAge($('#dob').val());
        //if under 18, alert user
        if (formAge > 17) {
            oldEnough = true;
        } else {
            alert('You must be 18 years or older to use this service');
        }
    }
    //only proceed if inputs are valid
    let formValid = (oldEnough && firstName.checkValidity() && email.checkValidity() && bio.checkValidity())
    if (formValid) {
        return true;
    }
}
//if form inputs are valid, presents first match
const getMatchingFunction = () => {
    //only if form is valid, close form and display matches
    if (validateForm()) {
        //put top profile in stack in the view
        displayProfile(0);
        //set our user's profile
        createUserProfile();
        //put top profile in stack in the view
        // displayProfile(0);
        //shows the presenting profile pane
        $('#matching').removeClass('hidden');
        //hide the profile entry container/pane
        $('#profileEntry').addClass('hidden');

    }
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
        listContents += '<div class="row"><div class="matchRow"><img src="' + profile.pic + '" class="miniImg circle" alt=""></div><div class="matchRow"><h5>' + profile.profName + '</h5></div></div>';

    })
    //then fill the constructed list with created html
    $('#constructedList').html(listContents);
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
    //also change center icon to reflect current user 
    $("#centreIcon").attr("src", userProfile.pic);

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

const newProfileFunction = () => {
    //hide the welcome container
    $('#welcome').addClass('hidden');
    //shows the profile entry container
    $('#profileEntry').removeClass('hidden');
}


$(document).ready(function () {
    //reinitialise form inputs
    M.updateTextFields();
    console.log('Ready')
    //initialisation for using modals
    $('.modal').modal();

    //bind the buttons
    // $('#testButton').click(testButtonFunction)

    $('#newProfileButton').click(newProfileFunction)
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
    $('#getMatchingButton').click(getMatchingFunction)

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
