//index of currently presented profile in the suitor stack
let profileIndex = 0;
//array to contain list of matched profiles
let matchList = [];
//variable for handling age of current user (current user's profile will not be created/updated if user is underage)
let userAge = "";
//current user, initialised to no info with locally stored photograph
let userProfile = {
    profName: '',
    age: null,
    bio: '',
    pic: 'assets/UserPic.jpg',
    email: '',
    dob: ''
}

//X coordinates for last mouse "down" and "up" event for detecting drag/swipe over profile
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
    let data = {
        message: message,
        toAddress: userProfile.email
    }    // ajax sends a request to the server providing message content for the email
    $.ajax({
        url: "/sendMessage",
        contentType: 'application/json',
        data: JSON.stringify(data),
        type: 'POST',
        success: function (result) {
            console.log(result)
        }
    });
}

//takes a date of birth and returns the age
function calculateAge(dateOfBirth) {
    let now = new Date();
    let dob = new Date(dateOfBirth);
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

//takes profile form inputs and stores in local user profile data
const createUserProfile = () => {
    userProfile.profName = $('#firstName').val();
    userProfile.bio = $('#bio').val();
    userProfile.email = $('#email').val();
    userProfile.dob = $('#dob').val();
    //for ease of use, store calculated age
    userProfile.age = calculateAge($('#dob').val());
    //  alert(userProfile.bio);
    //update any web displays with the new information
    userProfileUpdate();
}


//checks whether profileForm inputs are valid and age >= 18, returns boolean
function validateProfileForm() {
    let oldEnough = false;
    let formValid = false;
    userAge = calculateAge($('#dob').val());

    //if form date input is valid, check age
    if (dob.checkValidity()) {
        userAge = calculateAge($('#dob').val());
        //if under 18, alert user
        if (userAge > 17) {
            oldEnough = true;
        } else { //alert and send back to home screen
            alert('Sorry. You must be 18 years or older to use this service');
            $('#welcome').removeClass('hidden');
            $('#profileEntry').addClass('hidden')
        }
    }
    //if old enough and all required inputs are valid, form is valid
    if (oldEnough && firstName.checkValidity() && email.checkValidity()) {
        //  return formValid;
        return true;
    }
}


//stores user data in local profile and sets display for reviewing suitors
const getMatchingFunction = () => {
    //only proceed if form is valid
    let validForm = validateProfileForm();
    if (validForm) {
        //set up suitors screen, then hide the profile entry container/pane (as callback)
        setUpSuitorDisplay(function () { $('#profileEntry').addClass('hidden') });
    }
}

const setUpSuitorDisplay = (callback) => {
    //store our new user's profile data
    createUserProfile();
    //display first profile in stack in "matching" pane
    displayProfile(0);
    //unhide the matching pane display
    $('#matching').removeClass('hidden');
    callback();

}


//(on profile rejection) shows next profile or goes to "matchingComplete" function if none remain
const nopeSelectedFunction = () => {
    profileIndex++;
    //while still profiles left in the stack, display the next profile
    if (profileIndex < profileStack.length) {
        displayProfile(profileIndex);
    }
    //if stack is empty, go to matching is complete 
    else {
        matchingComplete();
    }
}

//displays when stack is empty (all profiles have been presented and judged)
const matchingComplete = () => {
    //if there were matches, list them
    if (matchList.length > 0) {
        //calls function to construct match list in 'listMatches' container/pane
        constructMatchesDisplay();
        //hide the 'matching' display container and show the 'listMatches' display instead.
        $('#matching').addClass('hidden');
        $('#listMatches').removeClass('hidden');

    } else {
        //hide matching pane
        $('#matching').addClass('hidden');
        //display no more matches screen
        $('#noMatches').removeClass('hidden');
    }
}

//uses elements of matchList array to build a html picture/name list of profiles for the match list pane.
const constructMatchesDisplay = () => {
    let listContents = '';
    //for each element (profile) in the matchlist, add a row displaying its picture and name to the string
    matchList.forEach((profile, index) => {
        listContents += '<div class="row"><div class="matchRow"><img src="' + profile.pic + '" class="miniImg circle" alt=""></div><div class="matchRow">' + profile.profName + '</div></div>';
    })
    //then fill the constructed list with created html
    $('#constructedList').html(listContents);
}

//updates modal match display with the index profile details
const modalMatchUpdate = (index) => {
    let picUrl = profileStack[index].pic;
    $("#matchPic").attr("src", picUrl);
    $("#matchNameAge").html(profileStack[index].profName + ", " + profileStack[index].age);
    $("#matchBio").html(profileStack[index].bio);
}

//updates profile name, age, picture and bio wherever the applicable class is in use 
const userProfileUpdate = () => {
    $("#userProfPic").attr("src", userProfile.pic);
    $("#userNameAge").html(userProfile.profName + ", " + userProfile.age);
    $("#userBio").html(userProfile.bio);
    //also change center icon to reflect current user pic
    $("#centreIcon").attr("src", userProfile.pic);
}

//(on profile liking) displays match pane, adds to match list & triggers email before proceeding to next profile (or "matching complete" if no more)
const likeSelectedFunction = () => {
    //set the modal to display current profile (it's a match!)
    modalMatchUpdate(profileIndex);
    //show the modal that displays the match
    $('#matchAlert').modal('open');
    //the current profile is added to the matches list
    matchList.push(profileStack[profileIndex]);
    //construct match message and give it to 
    let msgString = `Congratulations ${userProfile.profName}, you have found a match. ${profileStack[profileIndex].profName} will contact you soon!`;
    sendMatchMail(msgString);
    profileIndex++;
    //display the next profile, or go to matching complete pane if no more in the stack.
    if (profileIndex < profileStack.length) {
        displayProfile(profileIndex);
    }
    else {
        matchingComplete();
    }
}

//displays the selected profile in the matching pane
const displayProfile = (index) => {
    let picUrl = profileStack[index].pic;
    $("#profPic").attr("src", picUrl);
    $("#nameAge").html(profileStack[index].profName + ", " + profileStack[index].age);
    $("#profBio").html(profileStack[index].bio);
}

//stores X coordinate of mouse button down event
const updateMouseDownX = (event) => {
    downMouseX = event.clientX;
}

//on "mouse button up" event need to compare to last mouse-down to detect swipe direction 
const updateMouseUpX = (event) => {
    upMouseX = event.clientX;
    //compare the up coordinate with the down coordinate to see if a legitimate-sized "swipe" has occurred
    let dragMovement = upMouseX - downMouseX;
    //if X difference is positive by more than 10, user has swiped right - run "like selected" function
    if (dragMovement > 10) {
        likeSelectedFunction();
    }
    //if X difference is negative by more than 10, user has swiped left - run "nope selected" function
    if (dragMovement < -10) {
        //user has swiped left - 
        nopeSelectedFunction();
    }
    // (if there has not been a swipe/drag of sufficient size to register, no action is taken)
}

//hide welcome screen, show profile entry form
const newProfileFunction = () => {
    //hide the welcome container
    $('#welcome').addClass('hidden');
    //shows the profile entry container
    $('#profileEntry').removeClass('hidden');
}

$(document).ready(function () {
    //reinitialise form inputs
    M.updateTextFields();
    //initialize date picker, reset default date to today
    let now = new Date();
    $('.datepicker').datepicker({ yearRange: 120, defaultDate: now });
    console.log('Ready');
    //initialisation for using modals
    $('.modal').modal();
    //bind the buttons
    $('#newProfileButton').click(newProfileFunction)
    $('#likeButton').click(likeSelectedFunction)
    $('#nopeButton').click(nopeSelectedFunction)
    $('#getMatchingButton').click(getMatchingFunction)
    //detect mouse up/down events occurring over the matching pane (to detect left/right swipes)
    $("#matching").mousedown(updateMouseDownX)
    $("#matching").mouseup(updateMouseUpX)
})
