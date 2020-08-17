const testButtonFunction=()=>{
  alert('Thank you for clicking')
}


$(document).ready(function(){
  console.log('Ready')
  
  //bind the button
  $('#testButton').click(testButtonFunction)


  $('#likeButton').click(testButtonFunction)
  $('#nopeButton').click(testButtonFunction)
  $('#profileButton').click(createUserProfile)



  //test get call
  $.get('/test?user_name="Fantastic User"',(result)=>{
    console.log(result)
  })


})

/*
<div class="row">
                            <div class="input-field col s12 m9 l10 ">
                                <input required value="" id="age" type="number" class="validate">
                                <label class="active" for="age">Age</label>
                            </div>
                        </div>



                        =============

                        <div class="row">
                    <div class="input-field col s12 m9 l10">
                        <input value="" id="pic" type="url" class="validate">
                        <label class="active" for="pic">Picture URL</label>
                        <span class="helper-text" data-error="Please enter a valid URL" data-success="Great!">URL
                            containing your picture</span>
                    </div>
                </div> -->

                -----


                        <a href="#!" type="submit" class="waves-effect waves-green btn-flat" id="profileButton1">Start
                            Matching
                            <i class="material-icons right">send</i></a>
                        */

