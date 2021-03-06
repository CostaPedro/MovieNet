//Movie Network App

$(document).ready(function(){
  
  var moviesURL = 'https://api.themoviedb.org/3/search/person?api_key=c523ca485fcd8c30e9105dd1f691321f';

  //Firstfunction called to start the app.  
  
  filterResults();

  //Event handler receives input and gets matching results.
  function filterResults() {
    $('.js-search-form').submit(function(event) {
      event.preventDefault();
      var userInput = $(this).find('.js-query').val();
      console.log(userInput);
      getNamesFromApi(userInput);
    });

  }

  //Makes the query using the user input.

  function getNamesFromApi(userInput) {
    var query = {
      query: userInput,
    }

    $.getJSON(moviesURL, query, displayOptions);
  }

  //Displays initial clickable results for a further filtering by the user.

  function displayOptions(data) {
    
    var resultNames = '';
    
    var namesOptionsHeader = `<h2 class="description">Following are the top results for your search. If the person you are looking for is not listed, please check the spelling or provide a full name.</h2>
                              <h3 class="selection_title">Please narrow your search by choosing one of the following names:</h3>`

    

    var resultPageSetup = `<div id="background2">
                           <img src="http://kingofwallpapers.com/film/film-015.jpg">
                           </div>`

    $('.results').prepend(resultPageSetup);                         
    $('.js-search-results-headings').html(namesOptionsHeader);
    
    //For each matching object--Name and actor ID is shown
    if (data.results) {
      
      data.results.forEach(function(searchNames){
        var nameOf = (searchNames.name);
        var actorId =(searchNames.id); 
               
        resultNames += `<li actorId='${actorId}' class="selection"><p class="name">${nameOf}</p></li></div>`;
      });
    }
    
    else {
      resultNames += '<p>No results</p>';
    }

    $('.columns').html(resultNames);


    //Makes each <li> tag clickable and redirects to the final display to include a filmography
    //with summary info and a list of all cast and crew that selected person has been credited with.

  finalDisplaySetup();
  };

  //------------------------------------------------------------------- 

  function finalDisplaySetup() {
    $('.selection').click(function() {
      var selPerson= $(this).text();
      console.log(selPerson);
      var selActorId = ($(this).attr("actorid"));
      console.log(selActorId);
      
  $('.landing-page').remove();

      var filmographyURL ='https://api.themoviedb.org/3/person/'+selActorId+'/movie_credits?api_key=c523ca485fcd8c30e9105dd1f691321f&language=en-US';
  
      //Makes the call to the api to get movie credits based on the actor id.
      //data passed into the function includes titles, film id, job/role for cast and crew. 
     
      $.getJSON(filmographyURL).done(function displayFilms(data) {
        var resultFilms = '';
        var filmographyHeader = `<h1>${selPerson}</h1>
                             <h2>Known For:</h2>`;
        var newDivFilmBoxes = `<div class="scrollbox1" id="style"></div>`
        


        $('.js-search-results-headings').html(filmographyHeader);
        $('.js-search-results').html(newDivFilmBoxes);

        //This will be an array of films the actor or crew member has been involved in.

        var filmIds=[]
   

        if (data.crew||data.cast)  {
      
          data.crew.forEach(function(films){
            var titleOf = (films.title);
            var job =(films.job);
            var filmId =(films.id);
            var poster = (films.poster_path);

            console.log(poster);
            console.log(titleOf);
            console.log(job);
            console.log(filmId);
               
            resultFilms += `<div class="film-boxes">
                            <a href="https://www.themoviedb.org/movie/`+filmId+`">
                            <li class="poster">
                            <object data=https://image.tmdb.org/t/p/w500`+poster+`>
                            <img class="placeholder" src=https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/80px-No_image_available.svg.png>
                            </object>
                            </li>
                            <li class="movie">${titleOf}</li>
                            <li class="job">(${job})</li>
                            </a>
                            </div>`;
            //<object data="http://lorempixel.com/200/200/people/1" type="image/png"></object>

//<object data="http://broken.img/url" type="image/png"></object>
            filmIds.push({filmId:filmId});

          

          });

          data.cast.forEach(function(films){
            var titleOf = (films.title);
            var filmId =(films.id);
            var role=(films.character); 
            var poster = (films.poster_path);

            console.log(poster);
            console.log(titleOf); 
            console.log (role);
            console.log(filmId);
               
            resultFilms += `<div class="film-boxes">
                            <a href="https://www.themoviedb.org/movie/`+filmId+`">
                            <li class="poster">
                            <object data=https://image.tmdb.org/t/p/w500`+poster+`>
                            <img class="placeholder" src=https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/80px-No_image_available.svg.png>
                            </object>
                            </li>
                            <li class="movie">${titleOf}</li>
                            <li class="role">(${role})</li>
                            </a>
                            </div>`;
            
            filmIds.push({filmId:filmId});

          });

          //Ends this section which builds the filmIds array of films the person has been involved in.

          console.log(filmIds);

          //based on film ids we iterate to get the credits and the subsequent cast and crew list

          
//============================================================================
          var castAndCrewColleagues = [];

          Promise.all(filmIds.map(function(objects){
            console.log(data);
            var filmId = objects.filmId;
            var castsAndCrewsURL= 'https://api.themoviedb.org/3/movie/'+filmId+'/credits?api_key=c523ca485fcd8c30e9105dd1f691321f';

              return $.getJSON(castsAndCrewsURL);

          })).then(function(data){   
                console.log(data);
                //array of film id objects with cast and crew

//This function will get specific values from properties in the array of objects

                function getFields(input, field) {
                   
                  for (var i=0; i < input.length ; ++i)
                  castAndCrewColleagues.push(input[i][field]);
                  return castAndCrewColleagues;
                }
//------------------------------------------------------------------------------------
                
                for (var i=0; i < data.length; ++i){
                  getFields(data[i].cast,"name");
                  getFields(data[i].crew,"name");
                  } 

                                    
              var frequency= {};

              console.log(selPerson);

                          
              var withoutSelPerson =castAndCrewColleagues.filter(val=>val!==selPerson);  

              console.log(withoutSelPerson);

              /*withoutSelPerson.forEach(function(NumOfCredits) {
                frequency[NumOfCredits] = (frequency[NumOfCredits] || 0) + 1;
              });


              withoutSelPerson.sort(function(x, y) {
                return frequency[y] - frequency[x];
              });

              var array  = [];

              for (var key in frequency) {
                if (frequency.hasOwnProperty(key)) {
                  array.push([key," "+ frequency[key]]);
                }
              }

              array.sort(compareSecondColumn);

              function compareSecondColumn(a, b) {
                return b[1] - a[1];
                
              }*/

              //console.log(frequency);

              //console.log(array);

              //console.log(withoutSelPerson);

             //--------------------------------------------------------------------------------------------------

             function compare(a, b) {
              var splitA = a.split(" ");
              var splitB = b.split(" ");
              var lastA = splitA[splitA.length - 1];
              var lastB = splitB[splitB.length - 1];

              if (lastA < lastB) return -1;
              if (lastA > lastB) return 1;
              return 0;
            }
 
            var alphabetical = withoutSelPerson.sort(compare);
            
            console.log(withoutSelPerson);
            var newLine = '<br><div class="subtitle">Click on names for additional info.</div></br>';

                   
            withoutDupes= [];

            withoutSelPerson.forEach(function(person){
              if (withoutDupes.indexOf(person) <0) {
                withoutDupes.push(person);
              }
            });

            var numPeople = withoutDupes.length;
            console.log(numPeople);

            $('.cast-crew-final-result-title').append(`MovieNet has found `+ numPeople + ` people `+ selPerson +` has worked with in ##### films:`+ newLine);

            var resultPeople = '';

            withoutDupes.forEach(function(persons) {
          
              resultPeople += `<li class="person">${persons},  </li>`;
              
              });

            
            var newDivFilmBox2 = `<div class="scrollbox2" id="style"></div>`;
            $('.cast-crew-final-result').html(newDivFilmBox2);
            $('.scrollbox2').html(resultPeople);  
          }); 
              
//=====================================================================================
        };

        
        $('.scrollbox1').html(resultFilms);
        
      });        
          
    });      
  }; 
});

//=====================================================================================  

  